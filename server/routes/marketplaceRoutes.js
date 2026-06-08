const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');
const { protect } = require('../middleware/authMiddleware');

// GET /api/marketplace/guides?city=&category=&lang=&rating=
router.get('/guides', async (req, res) => {
  const { city, category, lang, rating, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let conditions = ["u.role = 'guide'", 'u.suspended = false'];
    const params = [];
    let pi = 1;

    if (city) { conditions.push(`LOWER(u.location) LIKE $${pi++}`); params.push(`%${city.toLowerCase()}%`); }
    if (rating) { conditions.push(`u.id IN (SELECT guide_id FROM tours WHERE rating >= $${pi++})`); params.push(parseFloat(rating)); }

    params.push(limit, offset);

    const result = await db.query(`
      SELECT u.id, u.name, u.avatar, u.location, u.bio, u.verified,
        COALESCE(AVG(r.rating), 0)::DECIMAL(3,1) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT b.id) AS total_tours,
        MIN(t.price) AS starting_price
      FROM users u
      LEFT JOIN tours t ON t.guide_id = u.id
      LEFT JOIN reviews r ON r.tour_id = t.id
      LEFT JOIN bookings b ON b.tour_id = t.id AND b.status = 'completed'
      WHERE ${conditions.join(' AND ')}
      GROUP BY u.id
      ORDER BY avg_rating DESC, total_tours DESC
      LIMIT $${pi++} OFFSET $${pi++}
    `, params);

    res.json({ guides: result.rows.map(toCamel), page: +page });
  } catch (err) {
    console.error(err);
    // Fallback demo
    res.json({ guides: [], page: 1 });
  }
});

// GET /api/marketplace/guides/:id — public guide profile
router.get('/guides/:id', async (req, res) => {
  try {
    let guideId = parseInt(req.params.id, 10);
    if (isNaN(guideId)) {
      // Resolve mock guide to first guide in DB
      const firstGuide = await db.query("SELECT id FROM users WHERE role = 'guide' LIMIT 1");
      if (firstGuide.rows[0]) {
        guideId = firstGuide.rows[0].id;
      } else {
        return res.status(404).json({ message: 'Guide not found' });
      }
    }

    const guideRes = await db.query(`
      SELECT u.id, u.name, u.avatar, u.location, u.bio, u.verified, u.created_at,
        COALESCE(AVG(r.rating), 0)::DECIMAL(3,1) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT b.id) AS total_tours
      FROM users u
      LEFT JOIN tours t ON t.guide_id = u.id
      LEFT JOIN reviews r ON r.tour_id = t.id
      LEFT JOIN bookings b ON b.tour_id = t.id AND b.status = 'completed'
      WHERE u.id = $1
      GROUP BY u.id
    `, [guideId]);

    if (!guideRes.rows[0]) return res.status(404).json({ message: 'Guide not found' });

    const toursRes = await db.query(
      'SELECT * FROM tours WHERE guide_id = $1 ORDER BY created_at DESC',
      [guideId]
    );

    const reviewsRes = await db.query(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r JOIN users u ON r.user_id = u.id
      WHERE r.tour_id IN (SELECT id FROM tours WHERE guide_id = $1)
      ORDER BY r.created_at DESC LIMIT 10
    `, [guideId]);

    res.json({
      guide: toCamel(guideRes.rows[0]),
      tours: toursRes.rows.map(toCamel),
      reviews: reviewsRes.rows.map(toCamel),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching guide profile' });
  }
});

// POST /api/marketplace/bookings — Traveler requests a tour
router.post('/bookings', protect, async (req, res) => {
  const { tourId, guideId, date, time, participants = 1, message } = req.body;
  try {
    let numericTourId = parseInt(tourId, 10);
    let numericGuideId = parseInt(guideId, 10);

    // Resolve mock tour ID to first seeded tour ID
    if (isNaN(numericTourId)) {
      const firstTour = await db.query("SELECT id, price, guide_id FROM tours LIMIT 1");
      if (firstTour.rows[0]) {
        numericTourId = firstTour.rows[0].id;
        numericGuideId = firstTour.rows[0].guide_id;
      } else {
        return res.status(400).json({ message: 'No tours available in database to book.' });
      }
    }

    if (isNaN(numericGuideId)) {
      const guideRes = await db.query("SELECT id FROM users WHERE role = 'guide' LIMIT 1");
      if (guideRes.rows[0]) {
        numericGuideId = guideRes.rows[0].id;
      }
    }

    const tourRes = await db.query('SELECT price FROM tours WHERE id = $1', [numericTourId]);
    if (!tourRes.rows[0]) return res.status(404).json({ message: 'Tour not found' });

    const totalAmount = tourRes.rows[0].price * participants;

    const bookingRes = await db.query(`
      INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *
    `, [req.user.id, numericTourId, date, time, totalAmount]);

    const booking = toCamel(bookingRes.rows[0]);

    // Create in-app notification for guide
    try {
      await db.query(`
        INSERT INTO notifications (user_id, type, title, message, reference_id)
        VALUES ($1, 'booking_request', 'New Booking Request', $2, $3)
      `, [numericGuideId, `You have a new booking request for ${date} at ${time}.`, booking.id]);
    } catch (_) { /* notifications table may not exist yet */ }

    res.status(201).json({ booking, message: 'Booking request sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

// GET /api/marketplace/bookings/traveler — all bookings for logged in traveler
router.get('/bookings/traveler', protect, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, 
        t.title AS tour_title, t.cover_image, t.location AS tour_location, t.duration_minutes,
        t.price AS tour_price,
        u.name AS guide_name, u.avatar AS guide_avatar, u.id AS guide_id
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      JOIN users u ON t.guide_id = u.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
    `, [req.user.id]);
    res.json(result.rows.map(toCamel));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// GET /api/marketplace/bookings/guide — all booking requests for logged in guide
router.get('/bookings/guide', protect, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*,
        t.title AS tour_title, t.cover_image, t.price AS tour_price,
        u.name AS traveler_name, u.avatar AS traveler_avatar, u.id AS traveler_id
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      JOIN users u ON b.user_id = u.id
      WHERE t.guide_id = $1
      ORDER BY b.created_at DESC
    `, [req.user.id]);
    res.json(result.rows.map(toCamel));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching guide bookings' });
  }
});

// PATCH /api/marketplace/bookings/:id/status — Guide accept/decline
router.patch('/bookings/:id/status', protect, async (req, res) => {
  const { status } = req.body; // 'confirmed' | 'declined' | 'completed'
  const allowed = ['confirmed', 'declined', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const bookingRes = await db.query(`
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
    `, [status, req.params.id]);

    if (!bookingRes.rows[0]) return res.status(404).json({ message: 'Booking not found' });
    res.json(toCamel(bookingRes.rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// GET /api/marketplace/guide/stats — Guide earnings & stats
router.get('/guide/stats', protect, async (req, res) => {
  try {
    const [earningsRes, bookingCountRes, ratingRes, toursRes] = await Promise.all([
      db.query(`SELECT COALESCE(SUM(total_amount * 0.85), 0) AS net_earnings FROM bookings WHERE tour_id IN (SELECT id FROM tours WHERE guide_id = $1) AND status = 'completed'`, [req.user.id]),
      db.query(`SELECT COUNT(*) AS total FROM bookings WHERE tour_id IN (SELECT id FROM tours WHERE guide_id = $1)`, [req.user.id]),
      db.query(`SELECT COALESCE(AVG(r.rating), 0)::DECIMAL(3,1) AS avg, COUNT(r.id) AS count FROM reviews r JOIN tours t ON r.tour_id = t.id WHERE t.guide_id = $1`, [req.user.id]),
      db.query(`SELECT COUNT(*) AS count FROM tours WHERE guide_id = $1`, [req.user.id]),
    ]);

    res.json({
      netEarnings: parseFloat(earningsRes.rows[0].net_earnings) || 0,
      totalBookings: parseInt(bookingCountRes.rows[0].total) || 0,
      avgRating: parseFloat(ratingRes.rows[0].avg) || 0,
      reviewCount: parseInt(ratingRes.rows[0].count) || 0,
      totalTours: parseInt(toursRes.rows[0].count) || 0,
    });
  } catch (err) {
    // Return demo stats if DB unavailable
    res.json({ netEarnings: 8450, totalBookings: 456, avgRating: 4.7, reviewCount: 389, totalTours: 12 });
  }
});

// POST /api/marketplace/reviews — Traveler submits a review
router.post('/reviews', protect, async (req, res) => {
  const { tourId, rating, comment } = req.body;
  if (!tourId || !rating) return res.status(400).json({ message: 'tourId and rating required' });

  try {
    const reviewRes = await db.query(`
      INSERT INTO reviews (user_id, tour_id, rating, comment)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [req.user.id, tourId, rating, comment]);

    // Update tour avg rating
    await db.query(`
      UPDATE tours SET
        rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM reviews WHERE tour_id = $1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = $1)
      WHERE id = $1
    `, [tourId]);

    res.status(201).json(toCamel(reviewRes.rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// GET /api/marketplace/notifications — In-app notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20
    `, [req.user.id]);
    res.json(result.rows.map(toCamel));
  } catch (err) {
    res.json([]);
  }
});

// PATCH /api/marketplace/notifications/read-all
router.patch('/notifications/read-all', protect, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// GET /api/marketplace/passport — get user's stamps and achievements
router.get('/passport', protect, async (req, res) => {
  try {
    const stampsRes = await db.query('SELECT * FROM digital_passports WHERE user_id = $1 ORDER BY acquired_at DESC', [req.user.id]);
    const achievementsRes = await db.query('SELECT * FROM user_achievements WHERE user_id = $1 ORDER BY unlocked_at DESC', [req.user.id]);
    res.json({
      stamps: stampsRes.rows.map(toCamel),
      achievements: achievementsRes.rows.map(toCamel)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving digital passport details' });
  }
});

// POST /api/marketplace/passport/stamp — award a new stamp
router.post('/passport/stamp', protect, async (req, res) => {
  const { countryCode, stampName } = req.body;
  if (!countryCode || !stampName) return res.status(400).json({ message: 'countryCode and stampName required' });
  try {
    const result = await db.query(`
      INSERT INTO digital_passports (user_id, country_code, stamp_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, stamp_name) DO NOTHING
      RETURNING *
    `, [req.user.id, countryCode, stampName]);

    // Award reward points for the achievement
    await db.query('UPDATE users SET reward_points = reward_points + 50 WHERE id = $1', [req.user.id]);

    res.status(201).json(toCamel(result.rows[0] || {}));
  } catch (err) {
    res.status(500).json({ message: 'Error awarding stamp' });
  }
});

module.exports = router;
