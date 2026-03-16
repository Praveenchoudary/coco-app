const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE stock > 0';
    const params = [];
    if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`,`%${search}%`); }
    if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY is_bulk ASC, id ASC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
