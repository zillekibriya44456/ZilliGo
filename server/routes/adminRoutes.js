const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect, admin } = require('../middleware/authMiddleware');
const { toCamel } = require('../utils/camelCase');

// @desc    Get global stats for admin
// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const tourCount = await db.query('SELECT COUNT(*) FROM tours');
    const bookingCount = await db.query('SELECT COUNT(*) FROM bookings');
    const revenue = await db.query('SELECT SUM(total_amount) FROM bookings WHERE status = $1', ['completed']);

    res.json({
      users: parseInt(userCount.rows[0].count),
      tours: parseInt(tourCount.rows[0].count),
      bookings: parseInt(bookingCount.rows[0].count),
      revenue: parseFloat(revenue.rows[0].sum || 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// @desc    Get all users for moderation
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, avatar, verified, suspended FROM users ORDER BY created_at DESC');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// @desc    Verify a user (usually a guide)
// @route   PUT /api/admin/verify/:id
router.put('/verify/:id', protect, admin, async (req, res) => {
  try {
    await db.query('UPDATE users SET verified = true WHERE id = $1', [req.params.id]);
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying user' });
  }
});

// @desc    Suspend/Unsuspend a user
// @route   PUT /api/admin/suspend/:id
router.put('/suspend/:id', protect, admin, async (req, res) => {
  const { suspended } = req.body;
  try {
    await db.query('UPDATE users SET suspended = $1 WHERE id = $2', [suspended, req.params.id]);
    res.json({ message: suspended ? 'User suspended' : 'User unsuspended' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

module.exports = router;
