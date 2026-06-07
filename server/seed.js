const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const seed = async () => {
  try {
    console.log('Seeding database...');
    
    // Clear existing data
    await pool.query('TRUNCATE reviews, messages, orders, bookings, tours, users RESTART IDENTITY CASCADE');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Admin
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role, verified, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Admin User', 'admin@zilligo.com', passwordHash, 'admin', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80']
    );

    // Create Guides
    const guides = [
      { name: 'Marco Rossi', email: 'marco@example.com', location: 'Rome, Italy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
      { name: 'Yuki Tanaka', email: 'yuki@example.com', location: 'Tokyo, Japan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
      { name: 'Arjun Sharma', email: 'arjun@example.com', location: 'Bangalore, India', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' }
    ];

    for (const g of guides) {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role, verified, location, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [g.name, g.email, passwordHash, 'guide', true, g.location, g.avatar]
      );
    }

    // Create Travelers
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role, verified, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Alex Johnson', 'alex@example.com', passwordHash, 'traveler', false, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80']
    );

    // Create Tours
    const tours = [
      { guide_email: 'marco@example.com', title: 'Ancient Rome Walking Tour', price: 29, category: 'Historical', location: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' },
      { guide_email: 'yuki@example.com', title: 'Tokyo Street Food Adventure', price: 35, category: 'Food & Culture', location: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
      { guide_email: 'arjun@example.com', title: 'Bangalore Tech & Startup Scene', price: 15, category: 'Tech & Innovation', location: 'Bangalore, India', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80' }
    ];

    for (const t of tours) {
      const guideRes = await pool.query('SELECT id FROM users WHERE email = $1', [t.guide_email]);
      const guideId = guideRes.rows[0].id;
      await pool.query(
        'INSERT INTO tours (guide_id, title, price, category, location, cover_image, duration_minutes, max_participants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [guideId, t.title, t.price, t.category, t.location, t.img, 90, 20]
      );
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
