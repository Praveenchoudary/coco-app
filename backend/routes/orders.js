const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const db      = require('../models/db');
const { authMiddleware } = require('../middleware/auth');

// ── Razorpay setup ────────────────────────────────────────────────────────────
let rzp = null;
if (process.env.RZP_KEY_ID &&
    process.env.RZP_KEY_ID !== 'rzp_test_CHANGE_ME') {
  try {
    const Razorpay = require('razorpay');
    rzp = new Razorpay({
      key_id:     process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized');
  } catch(e) {
    console.log('⚠️  Razorpay package not found, demo mode active');
  }
} else {
  console.log('ℹ️  Razorpay keys not set — demo/COD mode active');
}

// ── QR Code ───────────────────────────────────────────────────────────────────
let QRCode = null;
try { QRCode = require('qrcode'); } catch(e) {}

// ════════════════════════════════════════════════════════════════════════════
// POST /api/orders  →  place order
// ════════════════════════════════════════════════════════════════════════════
router.post('/', authMiddleware, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      items,
      delivery,
      total_amount,
      order_type,
      event_name,
      event_date,
      special_instructions,
      payment,
    } = req.body;

    // ── Validate required fields ─────────────────────────────────────────────
    if (!items || !items.length) {
      await conn.rollback(); conn.release();
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!delivery || !delivery.name || !delivery.mobile ||
        !delivery.address || !delivery.city ||
        !delivery.district || !delivery.pincode) {
      await conn.rollback(); conn.release();
      return res.status(400).json({ message: 'Missing delivery details' });
    }

    // ── Razorpay signature verify ────────────────────────────────────────────
    if (payment?.method === 'razorpay' && rzp && payment.signature) {
      const body = `${payment.rzp_order_id}|${payment.ref}`;
      const expected = crypto
        .createHmac('sha256', process.env.RZP_KEY_SECRET)
        .update(body)
        .digest('hex');
      if (expected !== payment.signature) {
        await conn.rollback(); conn.release();
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    // ── Insert order ─────────────────────────────────────────────────────────
    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (user_id, total_amount, order_type, event_name, event_date,
          delivery_name, delivery_mobile, delivery_address,
          delivery_city, delivery_district, delivery_pincode,
          payment_status, payment_method, payment_ref,
          special_instructions)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id,
        parseFloat(total_amount) || 0,
        order_type || 'normal',
        event_name  || null,
        event_date  || null,
        String(delivery.name).substring(0, 100),
        String(delivery.mobile).substring(0, 15),
        String(delivery.address),
        String(delivery.city).substring(0, 100),
        String(delivery.district).substring(0, 100),
        String(delivery.pincode).substring(0, 10),
        payment?.status  || 'pending',
        payment?.method  || 'cod',
        payment?.ref     || ('DEMO-' + Date.now()),
        special_instructions || null,
      ]
    );

    const orderId = orderResult.insertId;

    // ── Insert order items ───────────────────────────────────────────────────
    for (const item of items) {
      const productId = parseInt(item.product_id || item.id);
      const quantity  = parseInt(item.quantity   || item.qty);
      const price     = parseFloat(item.price);

      if (!productId || !quantity || !price) continue;

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        [orderId, productId, quantity, price]
      );
      await conn.query(
        'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
        [quantity, productId]
      );
    }

    await conn.commit();
    console.log(`✅ Order #${orderId} placed by user ${req.user.id}`);
    res.json({ message: 'Order placed successfully!', order_id: orderId });

  } catch (err) {
    await conn.rollback();
    console.error('❌ Order error:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: `Failed to place order: ${err.message}` });
  } finally {
    conn.release();
  }
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/orders/initiate  →  create Razorpay order
// ════════════════════════════════════════════════════════════════════════════
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    const { total_amount, payment_method } = req.body;
    if (payment_method === 'cod' || !rzp) {
      return res.json({ mode: 'demo' });
    }
    const rzpOrder = await rzp.orders.create({
      amount:   Math.round(parseFloat(total_amount) * 100),
      currency: 'INR',
      receipt:  'natu_' + Date.now(),
    });
    res.json({
      mode:         'razorpay',
      rzp_order_id: rzpOrder.id,
      rzp_key_id:   process.env.RZP_KEY_ID,
      amount:       total_amount,
    });
  } catch (err) {
    console.error('Initiate error:', err.message);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/orders/my  →  order history
// ════════════════════════════════════════════════════════════════════════════
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url, p.unit
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    console.error('My orders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/orders/upi-qr  →  generate UPI QR
// ════════════════════════════════════════════════════════════════════════════
router.get('/upi-qr', authMiddleware, async (req, res) => {
  try {
    const amount  = parseFloat(req.query.amount || 0).toFixed(2);
    const upiId   = process.env.UPI_ID   || 'natucoconut@upi';
    const upiName = process.env.UPI_NAME || 'NatuCoconut';
    const upiUrl  = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=NatuCoconut`;

    if (QRCode) {
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 280, margin: 2,
        color: { dark: '#0d3b0d', light: '#ffffff' },
      });
      return res.json({ qr: qrDataUrl, upiUrl, upiId, upiName });
    }
    res.json({ qr: null, upiUrl, upiId, upiName });
  } catch (err) {
    res.status(500).json({ message: 'QR generation failed' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/orders/webhook/razorpay
// ════════════════════════════════════════════════════════════════════════════
router.post('/webhook/razorpay',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    try {
      if (!process.env.RZP_WEBHOOK_SECRET) return res.json({ ok: true });
      const sig = req.headers['x-razorpay-signature'];
      const expected = crypto
        .createHmac('sha256', process.env.RZP_WEBHOOK_SECRET)
        .update(req.body).digest('hex');
      if (sig !== expected) return res.status(400).json({ message: 'Bad signature' });
      res.json({ ok: true });
    } catch(e) {
      res.status(500).json({ message: 'Webhook error' });
    }
  }
);

module.exports = router;
