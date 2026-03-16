const jwt  = require('jsonwebtoken');
const db   = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'coconutsecret2024';

// ── Auth Middleware ──────────────────────────────────────────────────────────
// Decodes JWT AND verifies user still exists in DB
// This prevents stale tokens from causing FK constraint failures
const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }

  // Verify user actually exists in DB (prevents FK failures)
  try {
    const [rows] = await db.query(
      'SELECT id, name, mobile, role FROM users WHERE id = ?',
      [decoded.id]
    );
    if (!rows.length) {
      return res.status(401).json({
        message: 'Session expired. Please login again.',
        code: 'USER_NOT_FOUND'
      });
    }
    // Always use fresh DB data (not stale JWT data)
    req.user = rows[0];
    next();
  } catch (e) {
    console.error('Auth DB error:', e.message);
    return res.status(500).json({ message: 'Auth check failed' });
  }
};

// ── Admin Middleware ──────────────────────────────────────────────────────────
const adminMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };
