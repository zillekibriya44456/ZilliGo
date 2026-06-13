const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const NodeCache = require('node-cache');

// Cache homepage for 60 seconds
const cache = new NodeCache({ stdTTL: 60 });
const { toCamel } = require('../utils/camelCase');

// @desc    Get dynamic homepage data (Smart Priority System)
// @route   GET /api/public/homepage
router.get('/homepage', async (req, res) => {
  try {
    const cacheKey = 'homepage_data';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('⚡ Serving homepage from cache');
      return res.json(cachedData);
    }

    // 1. Featured Tours (Combine real and seed, prioritizing real, limit 12)
    const toursRes = await db.query(`
      SELECT t.*, u.name as guide_name, u.avatar as guide_avatar 
      FROM tours t 
      JOIN users u ON t.guide_id = u.id 
      ORDER BY t.is_seed_data ASC, t.rating DESC 
      LIMIT 12
    `);

    // 2. Featured Guides (Limit 6)
    const guidesRes = await db.query(`
      SELECT id, name, avatar, location, verified, is_seed_data 
      FROM users 
      WHERE role = 'guide' 
      ORDER BY is_seed_data ASC, verified DESC 
      LIMIT 6
    `);

    // 3. Live Streams (Limit 4)
    const liveRes = await db.query(`
      SELECT l.*, u.name as guide_name, u.avatar as guide_avatar 
      FROM live_streams l 
      JOIN users u ON l.guide_id = u.id 
      ORDER BY l.is_seed_data ASC, l.viewer_count DESC 
      LIMIT 4
    `);

    // 4. Recent Activity (Limit 10)
    const activityRes = await db.query(`
      SELECT a.*, u.name as user_name, u.avatar as user_avatar 
      FROM activities a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 10
    `);

    // 5. Global Stats
    const statsRes = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM tours) as total_tours,
        (SELECT COUNT(*) FROM users WHERE role = 'guide') as total_guides,
        (SELECT COUNT(DISTINCT location) FROM tours) as total_cities,
        (SELECT COUNT(*) FROM users WHERE role = 'traveler') as total_travelers
    `);
    const stats = statsRes.rows[0];

    // 6. Testimonials / Reviews (Limit 3)
    const reviewsRes = await db.query(`
      SELECT r.id, r.rating, r.comment as text, u.name, u.avatar, u.location, t.title as tour
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      JOIN tours t ON r.tour_id = t.id 
      WHERE r.rating >= 4
      ORDER BY r.rating DESC, r.created_at DESC 
      LIMIT 3
    `);

    const responseData = {
      tours: toCamel(toursRes.rows),
      guides: toCamel(guidesRes.rows),
      liveStreams: toCamel(liveRes.rows),
      activities: toCamel(activityRes.rows),
      testimonials: toCamel(reviewsRes.rows),
      stats: {
        tours: parseInt(stats.total_tours) || 0,
        guides: parseInt(stats.total_guides) || 0,
        cities: parseInt(stats.total_cities) || 1, // At least 1 (the world)
        travelers: parseInt(stats.total_travelers) || 0
      }
    };

    // Save to cache
    cache.set(cacheKey, responseData);

    res.json(responseData);

  } catch (error) {
    console.error('Homepage data error:', error);
    res.status(500).json({ message: 'Error fetching homepage data' });
  }
});

// @desc    Get single live stream by ID
// @route   GET /api/public/live/:id
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Temporary endpoint to setup database live
router.get('/setup-live-db', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcryptjs');
    
    // 1. Run Schema
    const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    await db.query(schema);
    
    // 2. Clear existing
    await db.query('TRUNCATE reviews, messages, orders, bookings, tours, users RESTART IDENTITY CASCADE');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 3. Admin
    await db.query(
      'INSERT INTO users (name, email, password_hash, role, verified, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Admin User', 'admin@zilligo.com', passwordHash, 'admin', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80']
    );

    // 4. Guides
    const guides = [
      { name: 'Marco Rossi', email: 'marco@example.com', location: 'Rome, Italy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
      { name: 'Yuki Tanaka', email: 'yuki@example.com', location: 'Tokyo, Japan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
      { name: 'Arjun Sharma', email: 'arjun@example.com', location: 'Bangalore, India', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' }
    ];
    for (const g of guides) {
      await db.query(
        'INSERT INTO users (name, email, password_hash, role, verified, location, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [g.name, g.email, passwordHash, 'guide', true, g.location, g.avatar]
      );
    }

    // 5. Travelers
    await db.query(
      'INSERT INTO users (name, email, password_hash, role, verified, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Alex Johnson', 'alex@example.com', passwordHash, 'traveler', false, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80']
    );

    // 6. Tours
    const tours = [
      { guide_email: 'marco@example.com', title: 'Ancient Rome Walking Tour', price: 29, category: 'Historical', location: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' },
      { guide_email: 'yuki@example.com', title: 'Tokyo Street Food Adventure', price: 35, category: 'Food & Culture', location: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
      { guide_email: 'arjun@example.com', title: 'Bangalore Tech & Startup Scene', price: 15, category: 'Tech & Innovation', location: 'Bangalore, India', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80' }
    ];
    for (const t of tours) {
      const guideRes = await db.query('SELECT id FROM users WHERE email = $1', [t.guide_email]);
      const guideId = guideRes.rows[0].id;
      await db.query(
        'INSERT INTO tours (guide_id, title, price, category, location, cover_image, duration_minutes, max_participants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [guideId, t.title, t.price, t.category, t.location, t.img, 90, 20]
      );
    }

    res.json({ message: 'Database setup and seeded successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.get('/live/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const streamRes = await db.query(`
      SELECT l.*, u.name as guide_name, u.avatar as guide_avatar, u.location as guide_location 
      FROM live_streams l 
      JOIN users u ON l.guide_id = u.id 
      WHERE l.id = $1
    `, [id]);

    if (streamRes.rows.length === 0) {
      return res.status(404).json({ message: 'Live stream not found' });
    }

    res.json(toCamel(streamRes.rows[0]));
  } catch (error) {
    console.error('Error fetching live stream:', error);
    res.status(500).json({ message: 'Error fetching live stream' });
  }
});

// GET /api/public/live/:id/chat — Get live room chat history
router.get('/live/:id/chat', async (req, res) => {
  try {
    const roomId = `live_${req.params.id}`;
    const result = await db.query('SELECT * FROM live_chat_messages WHERE room_id = $1 ORDER BY created_at ASC', [roomId]);
    res.json(result.rows.map(toCamel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// GET /api/public/live/:id/questions — Get live room questions
router.get('/live/:id/questions', async (req, res) => {
  try {
    const roomId = `live_${req.params.id}`;
    const result = await db.query('SELECT * FROM live_questions WHERE room_id = $1 ORDER BY created_at ASC', [roomId]);
    res.json(result.rows.map(toCamel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

module.exports = router;
