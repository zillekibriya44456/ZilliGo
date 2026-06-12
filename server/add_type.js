const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_qJ3mal6TMCpg@ep-long-meadow-ap9hn99r-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await pool.query("ALTER TABLE tours ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'live';");
    await pool.query("UPDATE tours SET type = 'live' WHERE type IS NULL;");
    console.log("Migration successful");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
