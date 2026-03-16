const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { adminMiddleware } = require('../middleware/auth');

// All orders with items and user
router.get('/orders', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT o.*, u.name as customer_name, u.mobile as customer_mobile
                 FROM orders o JOIN users u ON o.user_id = u.id`;
    const params = [];
    if (status) { query += ' WHERE o.order_status = ?'; params.push(status); }
    query += ' ORDER BY o.created_at DESC';
    const [orders] = await db.query(query, params);
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url, p.unit FROM order_items oi
         JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/orders/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const [[{ total_orders }]] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await db.query("SELECT SUM(total_amount) as total_revenue FROM orders WHERE payment_status='paid'");
    const [[{ pending_orders }]] = await db.query("SELECT COUNT(*) as pending_orders FROM orders WHERE order_status='placed'");
    const [[{ total_customers }]] = await db.query("SELECT COUNT(*) as total_customers FROM users WHERE role='customer'");
    res.json({ total_orders, total_revenue: total_revenue || 0, pending_orders, total_customers });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Manage products
router.post('/products', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, unit, stock, image_url, category } = req.body;
    const [r] = await db.query(
      'INSERT INTO products (name, description, price, unit, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, unit, stock, image_url, category]
    );
    res.json({ id: r.insertId, message: 'Product added' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, unit, stock, image_url, category } = req.body;
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, unit=?, stock=?, image_url=?, category=? WHERE id=?',
      [name, description, price, unit, stock, image_url, category, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
