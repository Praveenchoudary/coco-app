import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ── Tamil Nadu districts ─────────────────────────────────────────────────────
const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri',
  'Dindigul','Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur',
  'Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal',
  'Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem',
  'Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli',
  'Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai',
  'Tiruvarur','Vellore','Villupuram','Virudhunagar',
];

const STEPS = ['Delivery', 'Payment', 'Confirm'];

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step,      setStep]      = useState(0);
  const [placing,   setPlacing]   = useState(false);
  const [orderId,   setOrderId]   = useState(null);
  const [payMethod, setPayMethod] = useState('upi');
  const [upiData,   setUpiData]   = useState(null); // {qr, upiUrl, upiId}
  const [upiTxnId,  setUpiTxnId]  = useState('');
  const [card,      setCard]      = useState({ number:'', expiry:'', cvv:'', holder:'' });

  const delivery_charge = total >= 500 ? 0 : 50;
  const grand = total + delivery_charge;

  const [delivery, setDelivery] = useState({
    name: user?.name || '', mobile: user?.mobile || '',
    address: '', city: '', district: '', pincode: '', special_instructions: '',
  });

  // Redirect if cart empty
  useEffect(() => { if (cart.length === 0 && step < 3) navigate('/cart'); }, [cart, step, navigate]);

  // Load UPI QR when method selected
  useEffect(() => {
    if (payMethod === 'upi_qr' && !upiData) {
      API.get(`/orders/upi-qr?amount=${grand.toFixed(2)}`)
        .then(r => setUpiData(r.data))
        .catch(() => {
          // Fallback: build URL client-side
          const upiUrl = `upi://pay?pa=natucoconut@upi&pn=NatuCoconut&am=${grand.toFixed(2)}&cu=INR`;
          setUpiData({ qr: null, upiUrl, upiId: 'natucoconut@upi', upiName: 'NatuCoconut' });
        });
    }
  }, [payMethod, grand, upiData]);

  const validateDelivery = () => {
    if (!delivery.name || !delivery.mobile || !delivery.address ||
        !delivery.city || !delivery.district || !delivery.pincode) {
      toast.error('Please fill all required fields'); return false;
    }
    if (!/^[6-9]\d{9}$/.test(delivery.mobile)) {
      toast.error('Enter valid 10-digit mobile number'); return false;
    }
    if (delivery.pincode.length !== 6) {
      toast.error('Enter valid 6-digit PIN code'); return false;
    }
    return true;
  };

  // ─── Place Order ─────────────────────────────────────────────────────────
  const placeOrder = useCallback(async () => {
    setPlacing(true);
    try {
      const items = cart.map(i => ({ product_id: i.id, quantity: i.qty, price: i.price }));
      const isBulk = cart.some(i => i.category === 'bulk');
      const orderPayload = {
        items, delivery,
        total_amount: grand,
        order_type:   isBulk ? 'bulk' : 'normal',
        special_instructions: delivery.special_instructions || null,
      };

      // ── COD / Demo / UPI QR (no Razorpay popup) ─────────────────────────
      if (['cod', 'demo', 'upi_qr'].includes(payMethod)) {
        const payStatus = payMethod === 'upi_qr' ? 'pending' : 'paid';
        const payRef    = payMethod === 'upi_qr'
          ? (upiTxnId || 'VERIFY-' + Date.now())
          : 'DEMO-' + Date.now();

        const res = await API.post('/orders', {
          ...orderPayload,
          payment: { status: payStatus, method: payMethod, ref: payRef },
        });
        setOrderId(res.data.order_id);
        clearCart();
        setStep(3);
        return;
      }

      // ── Razorpay (UPI / Card / Net Banking) ─────────────────────────────
      if (!window.Razorpay) {
        toast.error('Payment system not loaded. Please refresh and try again.');
        return;
      }

      // Step 1: Create Razorpay order on backend
      const initRes = await API.post('/orders/initiate', {
        total_amount: grand, payment_method: payMethod,
      });

      if (initRes.data.mode === 'demo') {
        // Razorpay not configured — fallback to demo
        const res = await API.post('/orders', {
          ...orderPayload,
          payment: { status: 'paid', method: 'demo', ref: 'DEMO-' + Date.now() },
        });
        setOrderId(res.data.order_id);
        clearCart();
        setStep(3);
        return;
      }

      // Step 2: Open Razorpay popup
      const { rzp_order_id, rzp_key_id } = initRes.data;

      const options = {
        key:         rzp_key_id,
        amount:      Math.round(grand * 100),
        currency:    'INR',
        name:        'NatuCoconut',
        description: 'Fresh Tamil Nadu Coconut Products',
        order_id:    rzp_order_id,
        prefill: {
          name:    user.name,
          contact: '+91' + user.mobile,
        },
        theme: { color: '#2d7a2d' },
        // Pre-select method based on what user chose
        config: {
          display: {
            blocks: {
              utib: { name: 'UPI', instruments: [{ method: 'upi' }] },
              card: { name: 'Cards', instruments: [{ method: 'card' }] },
              nb:   { name: 'Net Banking', instruments: [{ method: 'netbanking' }] },
            },
            sequence: payMethod === 'card' ? ['card','utib','nb'] :
                       payMethod === 'netbanking' ? ['nb','utib','card'] :
                       ['utib','card','nb'],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response) => {
          // Step 3: Save verified order to DB
          try {
            const res = await API.post('/orders', {
              ...orderPayload,
              payment: {
                status:       'paid',
                method:       'razorpay',
                ref:          response.razorpay_payment_id,
                rzp_order_id: response.razorpay_order_id,
                signature:    response.razorpay_signature,
              },
            });
            setOrderId(res.data.order_id);
            clearCart();
            setStep(3);
          } catch (err) {
            toast.error('Payment succeeded but order save failed. Contact support with payment ID: ' + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setPlacing(false);
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
      setPlacing(false);
    } finally {
      if (['cod', 'demo', 'upi_qr'].includes(payMethod)) setPlacing(false);
    }
  }, [cart, delivery, grand, payMethod, upiTxnId, user, clearCart]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="ckout-pg">
      <div className="ckout-wrap">

        {/* Steps */}
        <div className="ckout-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`cks-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                <div className="cks-circle">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`cks-line${i < step ? ' done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="ckout-body">
          <div className="ckout-main">

            {/* ── STEP 0: Delivery ─────────────────────────────────────── */}
            {step === 0 && (
              <div className="ckout-card">
                <div className="ckout-card-hdr">
                  <span className="ckout-step-icon">🏠</span>
                  <div>
                    <h2>Delivery Address</h2>
                    <p className="ckout-hint">🌴 Delivery only within Tamil Nadu</p>
                  </div>
                </div>
                <div className="ck-form">
                  <div className="ck-row2">
                    <div className="ck-field">
                      <label>Full Name *</label>
                      <input value={delivery.name} onChange={e => setDelivery({...delivery, name: e.target.value})} placeholder="Recipient name"/>
                    </div>
                    <div className="ck-field">
                      <label>Mobile Number *</label>
                      <div className="ck-prefix-wrap">
                        <span>+91</span>
                        <input value={delivery.mobile} onChange={e => setDelivery({...delivery, mobile: e.target.value})} placeholder="10-digit mobile" maxLength={10}/>
                      </div>
                    </div>
                  </div>
                  <div className="ck-field">
                    <label>Full Address *</label>
                    <textarea value={delivery.address} onChange={e => setDelivery({...delivery, address: e.target.value})} placeholder="House no, street, area, landmark..." rows={3}/>
                  </div>
                  <div className="ck-row2">
                    <div className="ck-field">
                      <label>City / Town *</label>
                      <input value={delivery.city} onChange={e => setDelivery({...delivery, city: e.target.value})} placeholder="City or town"/>
                    </div>
                    <div className="ck-field">
                      <label>District *</label>
                      <select value={delivery.district} onChange={e => setDelivery({...delivery, district: e.target.value})}>
                        <option value="">Select TN District</option>
                        {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="ck-row2">
                    <div className="ck-field">
                      <label>PIN Code *</label>
                      <input value={delivery.pincode} onChange={e => setDelivery({...delivery, pincode: e.target.value})} placeholder="6-digit PIN" maxLength={6}/>
                    </div>
                    <div className="ck-field">
                      <label>Special Instructions <span className="ck-optional">(optional)</span></label>
                      <input value={delivery.special_instructions} onChange={e => setDelivery({...delivery, special_instructions: e.target.value})} placeholder="e.g. Call before delivery"/>
                    </div>
                  </div>
                  <button className="ck-next-btn" onClick={() => { if (validateDelivery()) { setStep(1); window.scrollTo(0,0); } }}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Payment ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="ckout-card">
                <div className="ckout-card-hdr">
                  <span className="ckout-step-icon">💳</span>
                  <div>
                    <h2>Payment Method</h2>
                    <p className="ckout-hint">🔒 Secure · Your money is safe</p>
                  </div>
                </div>

                {/* Method selector */}
                <div className="pay-methods-grid">
                  {[
                    { id:'upi',        icon:'📲', label:'UPI',              sub:'GPay · PhonePe · Paytm · BHIM' },
                    { id:'upi_qr',     icon:'📷', label:'UPI QR Code',      sub:'Scan with any UPI app' },
                    { id:'card',       icon:'💳', label:'Credit / Debit Card', sub:'Visa · Mastercard · RuPay' },
                    { id:'netbanking', icon:'🏦', label:'Net Banking',       sub:'All Indian banks supported' },
                    { id:'cod',        icon:'💵', label:'Cash on Delivery',  sub:'Pay when delivered' },
                  ].map(m => (
                    <div key={m.id} className={`pay-method-card${payMethod === m.id ? ' selected' : ''}`}
                         onClick={() => setPayMethod(m.id)}>
                      <div className="pmc-radio">
                        {payMethod === m.id && <div className="pmc-radio-inner"/>}
                      </div>
                      <span className="pmc-icon">{m.icon}</span>
                      <div className="pmc-text">
                        <div className="pmc-label">{m.label}</div>
                        <div className="pmc-sub">{m.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* UPI — ID entry */}
                {payMethod === 'upi' && (
                  <div className="pay-detail-box">
                    <div className="pay-info-note">
                      <span>💡</span>
                      <span>Enter your UPI ID below, or just click <strong>Pay Now</strong> to choose GPay / PhonePe / Paytm from the payment popup.</span>
                    </div>
                    <div className="ck-field">
                      <label>UPI ID (optional)</label>
                      <input placeholder="yourname@okicici or 9XXXXXXXXX@paytm" className="af-input"/>
                    </div>
                    <div className="pay-upi-apps">
                      {['GPay','PhonePe','Paytm','BHIM','Amazon Pay','Cred'].map(app => (
                        <span key={app} className="pay-upi-app">{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* UPI QR Code */}
                {payMethod === 'upi_qr' && (
                  <div className="pay-detail-box">
                    <div className="pay-qr-wrap">
                      <h4 className="pay-qr-title">Scan to Pay ₹{grand.toFixed(2)}</h4>
                      <div className="pay-qr-box">
                        {upiData ? (
                          <QRCodeSVG
                            value={upiData.upiUrl}
                            size={220}
                            level="H"
                            includeMargin={true}
                            fgColor="#0d3b0d"
                          />
                        ) : (
                          <div className="pay-qr-loading">
                            <div className="af-spinner" style={{borderColor:'#c8e6c9', borderTopColor:'#2d7a2d'}}/>
                            <span>Generating QR...</span>
                          </div>
                        )}
                      </div>
                      <p className="pay-qr-upiid">UPI ID: <strong>{upiData?.upiId || 'natucoconut@upi'}</strong></p>
                      <p className="pay-qr-apps">Works with GPay · PhonePe · Paytm · BHIM · Any UPI app</p>
                      {/* Mobile: direct link to open UPI app */}
                      {upiData?.upiUrl && (
                        <a href={upiData.upiUrl} className="pay-qr-open-app">
                          📱 Open UPI App on This Phone
                        </a>
                      )}
                    </div>
                    <div className="ck-field" style={{marginTop:14}}>
                      <label>Enter UPI Transaction ID after paying *</label>
                      <input
                        placeholder="12-digit transaction ID from your UPI app"
                        value={upiTxnId}
                        onChange={e => setUpiTxnId(e.target.value)}
                        className="af-input"
                      />
                      <span className="af-hint">Open GPay/PhonePe → History → copy the transaction ID</span>
                    </div>
                  </div>
                )}

                {/* Card */}
                {payMethod === 'card' && (
                  <div className="pay-detail-box">
                    <div className="pay-info-note">
                      <span>💡</span>
                      <span>Click <strong>Pay Now</strong> to enter card details securely in the Razorpay popup. Your card is never stored on our servers.</span>
                    </div>
                    {/* Visual card preview */}
                    <div className="pay-card-preview">
                      <div className="pcp-chip">💳</div>
                      <div className="pcp-number">{card.number || '•••• •••• •••• ••••'}</div>
                      <div className="pcp-bottom">
                        <span>{card.holder || 'CARD HOLDER'}</span>
                        <span>{card.expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                    <div className="ck-field">
                      <label>Card Number</label>
                      <input value={card.number} onChange={e => setCard({...card, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()})} placeholder="1234 5678 9012 3456" maxLength={19} className="af-input"/>
                    </div>
                    <div className="ck-field">
                      <label>Cardholder Name</label>
                      <input value={card.holder} onChange={e => setCard({...card, holder: e.target.value.toUpperCase()})} placeholder="Name on card" className="af-input"/>
                    </div>
                    <div className="ck-row2">
                      <div className="ck-field">
                        <label>Expiry (MM/YY)</label>
                        <input value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} placeholder="MM/YY" maxLength={5} className="af-input"/>
                      </div>
                      <div className="ck-field">
                        <label>CVV</label>
                        <input value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} placeholder="•••" maxLength={3} type="password" className="af-input"/>
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {payMethod === 'netbanking' && (
                  <div className="pay-detail-box">
                    <div className="pay-info-note">
                      <span>💡</span>
                      <span>Click <strong>Pay Now</strong> and select your bank from the Razorpay popup. All major banks supported.</span>
                    </div>
                    <div className="pay-bank-grid">
                      {['SBI','HDFC','ICICI','Axis','Kotak','Canara','Union Bank','PNB','BOB','Yes Bank'].map(b => (
                        <div key={b} className="pay-bank-card">{b}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {payMethod === 'cod' && (
                  <div className="pay-detail-box">
                    <div className="pay-cod-box">
                      <span className="pay-cod-icon">💵</span>
                      <div>
                        <div className="pay-cod-title">Cash on Delivery</div>
                        <div className="pay-cod-note">Keep exact change ready. Our delivery partner will collect ₹{grand.toFixed(0)} at your doorstep.</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="ck-btn-row">
                  <button className="ck-back-btn" onClick={() => setStep(0)}>← Back</button>
                  <button className="ck-next-btn" onClick={() => { setStep(2); window.scrollTo(0,0); }}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Confirm ──────────────────────────────────────── */}
            {step === 2 && (
              <div className="ckout-card">
                <div className="ckout-card-hdr">
                  <span className="ckout-step-icon">✅</span>
                  <div>
                    <h2>Review & Confirm</h2>
                    <p className="ckout-hint">Check all details before paying</p>
                  </div>
                </div>

                <div className="review-section">
                  <div className="review-section-title">🏠 Delivery Address</div>
                  <div className="review-address">
                    <div className="ra-name">{delivery.name}</div>
                    <div>📱 +91 {delivery.mobile}</div>
                    <div>{delivery.address}</div>
                    <div>{delivery.city}, {delivery.district} - {delivery.pincode}</div>
                    <div className="ra-state">Tamil Nadu</div>
                    {delivery.special_instructions && <div className="ra-note">📝 {delivery.special_instructions}</div>}
                  </div>
                </div>

                <div className="review-section">
                  <div className="review-section-title">💳 Payment Method</div>
                  <div className="review-pay">
                    {payMethod === 'upi'        && '📲 UPI (GPay / PhonePe / Paytm)'}
                    {payMethod === 'upi_qr'     && `📷 UPI QR Code${upiTxnId ? ' - Txn: ' + upiTxnId : ''}`}
                    {payMethod === 'card'       && `💳 Card ending ••••${(card.number||'').replace(/\s/g,'').slice(-4)||'••••'}`}
                    {payMethod === 'netbanking' && '🏦 Net Banking'}
                    {payMethod === 'cod'        && '💵 Cash on Delivery'}
                  </div>
                </div>

                <div className="review-section">
                  <div className="review-section-title">🛒 Items Ordered</div>
                  {cart.map(item => (
                    <div key={item.id} className="review-item-row">
                      <span className="rir-name">{item.name}</span>
                      <span className="rir-qty">× {item.qty}</span>
                      <span className="rir-price">₹{(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="review-total-box">
                  <div className="rtb-row"><span>Subtotal</span><span>₹{total.toFixed(0)}</span></div>
                  <div className="rtb-row">
                    <span>Delivery</span>
                    <span className={delivery_charge === 0 ? 'rtb-free' : ''}>
                      {delivery_charge === 0 ? 'FREE' : `₹${delivery_charge}`}
                    </span>
                  </div>
                  <div className="rtb-total"><span>Total Payable</span><span>₹{grand.toFixed(0)}</span></div>
                </div>

                {payMethod === 'upi_qr' && !upiTxnId && (
                  <div className="pay-info-note" style={{marginBottom:14}}>
                    <span>⚠️</span>
                    <span>Please enter the UPI Transaction ID (from Payment step) before confirming.</span>
                  </div>
                )}

                <div className="ck-btn-row">
                  <button className="ck-back-btn" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="ck-place-btn"
                    onClick={placeOrder}
                    disabled={placing || (payMethod === 'upi_qr' && !upiTxnId)}
                  >
                    {placing
                      ? <><span className="ck-spinner"/>Processing...</>
                      : payMethod === 'cod'
                        ? `Place Order - Pay ₹${grand.toFixed(0)} at Door`
                        : `Pay ₹${grand.toFixed(0)} →`
                    }
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Success ──────────────────────────────────────── */}
            {step === 3 && (
              <div className="ckout-success">
                <div className="cks-burst">🎉</div>
                <div className="cks-check">✓</div>
                <h2>{payMethod === 'cod' ? 'Order Placed!' : 'Payment Successful!'}</h2>
                <p className="cks-id">Order ID: <strong>#{orderId}</strong></p>
                <p className="cks-note">
                  {payMethod === 'cod'
                    ? `Your order will be delivered within 2-3 business days. Keep ₹${grand.toFixed(0)} ready for the delivery partner.`
                    : 'Your fresh coconut products will be delivered within 2-3 business days to your Tamil Nadu address.'
                  }
                </p>
                <div className="cks-track">
                  {['Order Placed','Processing','Shipped','Delivered'].map((label, i) => (
                    <React.Fragment key={label}>
                      <div className={`ckt-step${i === 0 ? ' done' : ''}`}>
                        <div className="ckt-circle">{i === 0 ? '✓' : i + 1}</div>
                        <span>{label}</span>
                      </div>
                      {i < 3 && <div className="ckt-line"/>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="cks-actions">
                  <button className="cks-orders-btn" onClick={() => navigate('/my-orders')}>View My Orders</button>
                  <button className="cks-shop-btn"   onClick={() => navigate('/products')}>Continue Shopping</button>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          {step < 3 && (
            <div className="ckout-sidebar">
              <div className="cks-box">
                <h3>Order Summary</h3>
                <div className="cks-items">
                  {cart.map(item => (
                    <div key={item.id} className="cks-item">
                      <span className="cks-item-name">
                        {item.name} <span className="cks-item-qty">×{item.qty}</span>
                      </span>
                      <span className="cks-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="cks-divider"/>
                <div className="cks-sumrow"><span>Subtotal</span><span>₹{total.toFixed(0)}</span></div>
                <div className="cks-sumrow">
                  <span>Delivery</span>
                  <span className={delivery_charge === 0 ? 'cks-free' : ''}>
                    {delivery_charge === 0 ? 'FREE' : `₹${delivery_charge}`}
                  </span>
                </div>
                <div className="cks-divider"/>
                <div className="cks-grandtotal"><span>Total</span><span>₹{grand.toFixed(0)}</span></div>
                {delivery_charge === 0 && <div className="cks-free-note">🎉 Free delivery applied!</div>}
              </div>
              <div className="cks-secure-box">
                <div className="cssb-icon">🔒</div>
                <div className="cssb-text">
                  <div>100% Secure Checkout</div>
                  <div>Powered by Razorpay</div>
                </div>
              </div>
              <div className="cks-secure-box" style={{background:'#f0fdf4',border:'1px solid #bbf7d0'}}>
                <div className="cssb-icon">🥥</div>
                <div className="cssb-text">
                  <div style={{color:'#166534'}}>Farm Direct Quality</div>
                  <div>Tamil Nadu fresh produce</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
