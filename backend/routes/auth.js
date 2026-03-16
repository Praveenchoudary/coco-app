const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, password } = req.body;
    if (!name || !mobile || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (!/^[6-9]\d{9}$/.test(mobile))
      return res.status(400).json({ message: 'Invalid mobile number' });

    const [existing] = await db.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Mobile number already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)',
      [name, mobile, hashed]
    );
    const token = jwt.sign(
      { id: result.insertId, name, mobile, role: 'customer' },
      process.env.JWT_SECRET || 'coconutsecret2024',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: result.insertId, name, mobile, role: 'customer' } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid mobile or password' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid mobile or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET || 'coconutsecret2024',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, mobile: user.mobile, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
