const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

// @desc    Get dynamic homepage data (Smart Priority System)
// @route   GET /api/public/homepage
router.get('/homepage', async (req, res) => {
  try {
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

    res.json({
      tours: toCamel(toursRes.rows),
      guides: toCamel(guidesRes.rows),
      liveStreams: toCamel(liveRes.rows),
      activities: toCamel(activityRes.rows),
      stats: {
        tours: parseInt(stats.total_tours) || 0,
        guides: parseInt(stats.total_guides) || 0,
        cities: parseInt(stats.total_cities) || 1, // At least 1 (the world)
        travelers: parseInt(stats.total_travelers) || 0
      }
    });

  } catch (error) {
    console.error('Homepage data error:', error);
    res.status(500).json({ message: 'Error fetching homepage data' });
  }
});

module.exports = router;
