require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedSmart = async () => {
  try {
    console.log('Starting Smart Launch Seed...');
    
    // First, clear old seed data to prevent duplicates
    await pool.query('DELETE FROM activities WHERE is_seed_data = true');
    await pool.query('DELETE FROM live_streams WHERE is_seed_data = true');
    await pool.query('DELETE FROM reviews WHERE is_seed_data = true');
    await pool.query('DELETE FROM bookings WHERE is_seed_data = true');
    await pool.query('DELETE FROM tours WHERE is_seed_data = true');
    await pool.query("DELETE FROM users WHERE is_seed_data = true AND email != 'admin@zilligo.com'");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    console.log('Seeding Demo Guides & Travelers...');
    
    const users = [
      { name: 'Elena Rodriguez', email: 'elena.seed@zilligo.com', role: 'guide', location: 'Barcelona, Spain', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
      { name: 'Kenji Sato', email: 'kenji.seed@zilligo.com', role: 'guide', location: 'Kyoto, Japan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
      { name: 'Amira Hassan', email: 'amira.seed@zilligo.com', role: 'guide', location: 'Cairo, Egypt', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
      { name: 'David Chen', email: 'david.seed@zilligo.com', role: 'traveler', location: 'New York, USA', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
      { name: 'Sarah Miller', email: 'sarah.seed@zilligo.com', role: 'traveler', location: 'London, UK', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' }
    ];

    let userMap = {};
    for (const u of users) {
      const res = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, verified, location, avatar, is_seed_data) VALUES ($1, $2, $3, $4, true, $5, $6, true) RETURNING id',
        [u.name, u.email, passwordHash, u.role, u.location, u.avatar]
      );
      userMap[u.name] = res.rows[0].id;
    }

    console.log('Seeding Demo Tours...');
    const tours = [
      { guide: 'Elena Rodriguez', title: 'Gothic Quarter Secrets & Tapas', price: 25, location: 'Barcelona, Spain', category: 'Culture & Food', img: 'https://images.unsplash.com/photo-1583422409516-2895a77ef244?w=800&q=80' },
      { guide: 'Kenji Sato', title: 'Zen Temples & Tea Ceremony', price: 30, location: 'Kyoto, Japan', category: 'History & Tradition', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' },
      { guide: 'Amira Hassan', title: 'Pyramids of Giza Virtual Walk', price: 20, location: 'Cairo, Egypt', category: 'Historical Wonders', img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=800&q=80' }
    ];

    let tourMap = {};
    for (const t of tours) {
      const res = await pool.query(
        'INSERT INTO tours (guide_id, title, price, location, category, cover_image, is_seed_data, rating, review_count) VALUES ($1, $2, $3, $4, $5, $6, true, 4.9, 128) RETURNING id',
        [userMap[t.guide], t.title, t.price, t.location, t.category, t.img]
      );
      tourMap[t.title] = res.rows[0].id;
    }

    console.log('Seeding Demo Reviews...');
    await pool.query(
      'INSERT INTO reviews (user_id, tour_id, rating, comment, is_seed_data) VALUES ($1, $2, 5, $3, true)',
      [userMap['Sarah Miller'], tourMap['Gothic Quarter Secrets & Tapas'], 'Absolutely breathtaking experience! Elena was incredible.']
    );

    console.log('Seeding Live Streams...');
    await pool.query(
      'INSERT INTO live_streams (guide_id, title, location, viewer_count, cover_image, is_seed_data) VALUES ($1, $2, $3, 142, $4, true)',
      [userMap['Kenji Sato'], 'Live from Fushimi Inari Shrine', 'Kyoto, Japan', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80']
    );

    console.log('Seeding Activity Feed...');
    const activities = [
      { user_id: userMap['David Chen'], type: 'new_user', desc: 'David Chen joined ZilliGo from New York' },
      { user_id: userMap['Elena Rodriguez'], type: 'booking', desc: 'Elena received a new booking for Gothic Quarter' },
      { user_id: userMap['Kenji Sato'], type: 'live_tour', desc: 'Kenji is live at Fushimi Inari Shrine' },
      { user_id: userMap['Sarah Miller'], type: 'review', desc: 'Sarah left a 5-star review for Elena' }
    ];

    for (const a of activities) {
      await pool.query(
        'INSERT INTO activities (user_id, type, description, is_seed_data) VALUES ($1, $2, $3, true)',
        [a.user_id, a.type, a.desc]
      );
    }

    console.log('Smart Seed Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedSmart();
