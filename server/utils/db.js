const { Pool } = require('pg');
require('dotenv').config();

const needsSsl = process.env.NODE_ENV === 'production' || 
                 (process.env.DATABASE_URL && (
                   process.env.DATABASE_URL.includes('neon.tech') || 
                   process.env.DATABASE_URL.includes('supabase.co') || 
                   process.env.DATABASE_URL.includes('sslmode=require')
                 ));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: async (text, params) => {
    return await pool.query(text, params);
  },
  pool,
};
