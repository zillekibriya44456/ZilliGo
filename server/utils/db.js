const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ No DATABASE_URL or POSTGRES_URL found in production environment.');
}

const needsSsl = process.env.NODE_ENV === 'production' || 
                 (connectionString && (
                   connectionString.includes('neon.tech') || 
                   connectionString.includes('supabase.co') || 
                   connectionString.includes('sslmode=require')
                 ));

const pool = new Pool({
  connectionString: connectionString,
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
