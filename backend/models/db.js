const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             parseInt(process.env.DB_PORT || '3306'),
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || 'coconut123',
  database:         process.env.DB_NAME     || 'coconut_store',
  charset:          'utf8mb4',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  connectTimeout:   20000,
  // Reconnect on lost connection
  enableKeepAlive:  true,
  keepAliveInitialDelay: 0,
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ DB connection pool created successfully');
    conn.release();
  })
  .catch(err => {
    console.log('⚠️  DB pool creation warning (will retry):', err.message);
  });

module.exports = pool;
