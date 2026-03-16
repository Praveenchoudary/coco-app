require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./models/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
// Raw body needed for Razorpay webhook BEFORE json parser
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/admin',    require('./routes/admin'));

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'Coconut Store API Running' })
);

// ── DB retry connect then listen ─────────────────────────────────────────────
const startServer = async (retries = 10, delay = 4000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await db.query('SELECT 1');
      console.log('✅ MySQL connected');
      app.listen(PORT, () =>
        console.log(`🥥 NatuCoconut API running on port ${PORT}`)
      );
      return;
    } catch (e) {
      console.log(`⏳ DB not ready (attempt ${i}/${retries}), retrying...`);
      if (i === retries) { console.error('❌ DB failed'); process.exit(1); }
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

startServer();
