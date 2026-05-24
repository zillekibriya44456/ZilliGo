const db = require('./utils/db');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(schema);
    console.log('✅ Database Schema Implemented Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\nTIP: Make sure your PostgreSQL server is running and your DATABASE_URL in .env is correct.');
    process.exit(1);
  }
};

setupDatabase();
