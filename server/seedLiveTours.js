require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedLiveTours = async () => {
  try {
    console.log('Starting Demo Live Tours Seed...');
    
    // First, clear any old seed live streams to avoid duplicates
    await pool.query('DELETE FROM live_streams WHERE is_seed_data = true');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    console.log('Seeding Specific Demo Guides...');
    
    const guides = [
      { name: 'Keiko Tanaka', email: 'keiko.demo@zilligo.com', role: 'guide', location: 'Tokyo, Japan', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
      { name: 'Marco Rossi', email: 'marco.demo@zilligo.com', role: 'guide', location: 'Rome, Italy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
      { name: 'Arjun Singh', email: 'arjun.demo@zilligo.com', role: 'guide', location: 'Jaipur, India', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
      { name: 'Anjali Nair', email: 'anjali.demo@zilligo.com', role: 'guide', location: 'Kerala, India', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
      { name: 'John Miller', email: 'john.demo@zilligo.com', role: 'guide', location: 'New York, USA', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' }
    ];

    let userMap = {};
    for (const g of guides) {
      // Upsert guide
      await pool.query('DELETE FROM users WHERE email = $1', [g.email]);
      const res = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, verified, location, avatar, is_seed_data) VALUES ($1, $2, $3, $4, true, $5, $6, true) RETURNING id',
        [g.name, g.email, passwordHash, g.role, g.location, g.avatar]
      );
      userMap[g.name] = res.rows[0].id;
    }

    console.log('Seeding Demo Live Streams...');
    const liveStreams = [
      { guide: 'Keiko Tanaka', title: 'Tokyo Street Food Adventure', location: 'Tokyo, Japan', lang: 'Japanese + English', viewers: 420, duration: 90, img: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&q=80' },
      { guide: 'Marco Rossi', title: 'Ancient Rome Walking Tour', location: 'Rome, Italy', lang: 'Italian + English', viewers: 580, duration: 120, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' },
      { guide: 'Arjun Singh', title: 'Jaipur Heritage Experience', location: 'Jaipur, India', lang: 'Hindi + English', viewers: 310, duration: 90, img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80' },
      { guide: 'Anjali Nair', title: 'Kerala Backwaters Live', location: 'Kerala, India', lang: 'Malayalam + English', viewers: 275, duration: 75, img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80' },
      { guide: 'John Miller', title: 'Times Square Live Walk', location: 'New York, USA', lang: 'English', viewers: 450, duration: 60, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80' }
    ];

    for (const l of liveStreams) {
      await pool.query(
        'INSERT INTO live_streams (guide_id, title, location, language, duration_minutes, viewer_count, cover_image, is_seed_data) VALUES ($1, $2, $3, $4, $5, $6, $7, true)',
        [userMap[l.guide], l.title, l.location, l.lang, l.duration, l.viewers, l.img]
      );
    }

    console.log('Demo Live Tours Seed Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedLiveTours();
