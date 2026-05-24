const { Pool } = require('pg');
require('dotenv').config();

let pool;
let isDemoMode = false;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
      isDemoMode = true;
    }
  });
} catch (err) {
  isDemoMode = true;
}

const mockDB = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@zillgo.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'admin', verified: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
    { id: 2, name: 'Alex Johnson', email: 'alex@example.com', password_hash: '$2b$10$ePWfm/5O/6glEPGRZWh1WuRxNG.P0WFegWqxs25a1p0tmm7QD7STq', role: 'traveler', verified: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
  ]
};

module.exports = {
  query: async (text, params) => {
    if (isDemoMode) {
      if (text.includes('SELECT * FROM users WHERE email = $1')) {
        const user = mockDB.users.find(u => u.email === params[0]);
        return { rows: user ? [user] : [] };
      }
      return { rows: [] };
    }

    try {
      return await pool.query(text, params);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
        console.warn('⚠️ Database offline. Falling back to Demo Mode.');
        isDemoMode = true;
        return module.exports.query(text, params);
      }
      throw err;
    }
  },
};
