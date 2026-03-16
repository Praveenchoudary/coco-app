import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductImage } from '../utils/ProductSVGs';

const MIN = 3;

export default function Cart() {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const delivery = total >= 500 ? 0 : 50;
  const grandTotal = total + delivery;

  if (cart.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty-box">
        <div className="cart-empty-illo">
          <svg viewBox="0 0 120 120" width="100" height="100">
            <circle cx="60" cy="60" r="58" fill="#f0f4f0"/>
            <text x="60" y="78" textAnchor="middle" fontSize="48">🛒</text>
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Add some fresh coconut products to get started!</p>
        <Link to="/products" className="cart-empty-cta">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-pg">
      <div className="cart-pg-inner">

        {/* ── LEFT COLUMN ────────────────────────────── */}
        <div className="cart-left">

          {/* Header */}
          <div className="cart-hdr">
            <div>
              <h1 className="cart-hdr-title">My Cart</h1>
              <span className="cart-hdr-count">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
            </div>
            <button className="cart-clear-btn" onClick={clearCart}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2 0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/></svg>
              Clear All
            </button>
          </div>

          {/* Delivery progress */}
          {delivery > 0 ? (
            <div className="cart-del-progress">
              <div className="cdp-bar-wrap">
                <div className="cdp-bar" style={{ width: `${Math.min((total / 500) * 100, 100)}%` }}/>
              </div>
              <p>Add <strong>₹{(500 - total).toFixed(0)}</strong> more to get <strong>FREE delivery</strong></p>
            </div>
          ) : (
            <div className="cart-del-free">
              <span>🎉</span> <span>You unlocked <strong>FREE delivery</strong>!</span>
            </div>
          )}

          {/* Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="ci-img-box">
                  <ProductImage imageUrl={item.image_url} size={76} />
                </div>
                <div className="ci-info">
                  <div className="ci-cat-tag">{item.category === 'fresh' ? '🌿 FRESH' : '🫙 OIL'}</div>
                  <h3 className="ci-name">{item.name}</h3>
                  <div className="ci-unit-price">₹{item.price} / {item.unit}</div>
                  <div className="ci-stars">★★★★★ <span className="ci-reviews">(128)</span></div>
                  <div className="ci-delivery-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    Courier delivery · Tamil Nadu only
                  </div>
                </div>
                <div className="ci-right">
                  <div className="ci-price-big">₹{(item.price * item.qty).toFixed(0)}</div>
                  <div className="ci-qty-ctrl">
                    <button className="ci-qbtn" onClick={() => updateQty(item.id, Math.max(MIN, item.qty - 1))}>−</button>
                    <span className="ci-qval">{item.qty}</span>
                    <button className="ci-qbtn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div className="ci-each">₹{item.price} each</div>
                  <button className="ci-remove-btn" onClick={() => removeFromCart(item.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/></svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link to="/products" className="cart-continue-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            Continue Shopping
          </Link>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────── */}
        <div className="cart-right">

          {/* Price details card */}
          <div className="cart-summary-card">
            <h2 className="csc-title">Price Details</h2>
            <div className="csc-rows">
              <div className="csc-row"><span>Price ({cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>₹{total.toFixed(0)}</span></div>
              <div className="csc-row"><span>Delivery</span>
                <span className={delivery === 0 ? 'csc-free' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
            </div>
            <div className="csc-divider"/>
            <div className="csc-total">
              <span>Total Amount</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>
            {delivery === 0 && <div className="csc-saved">🎉 You save ₹50 on delivery!</div>}
            <button className="csc-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
            <div className="csc-secure">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7,11V7a5,5,0,0,1,10,0v4"/></svg>
              Safe & Secure Checkout
            </div>
            <div className="csc-pay-methods">
              <span>UPI</span><span>Cards</span><span>Net Banking</span><span>COD</span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="cart-delivery-card">
            <h4>📦 Delivery Information</h4>
            <p>Orders dispatched within 24 hours to all 38 Tamil Nadu districts via India Post, DTDC, BlueDart, and Delhivery. Estimated delivery: 2–4 business days.</p>
            <div className="cdc-couriers">
              <span>India Post</span><span>DTDC</span><span>BlueDart</span><span>Delhivery</span>
            </div>
          </div>

          {/* Min order note */}
          <div className="cart-min-note">
            <span>ℹ️</span>
            <span>Minimum order quantity is <strong>3 units</strong> per product.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
