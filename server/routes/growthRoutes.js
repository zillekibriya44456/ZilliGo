const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Join Waitlist
// @route   POST /api/growth/waitlist
router.post('/waitlist', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    await db.query('INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    res.status(201).json({ message: 'Successfully joined waitlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user referral stats
// @route   GET /api/growth/referrals
router.get('/referrals', protect, async (req, res) => {
  try {
    const userResult = await db.query('SELECT referral_code, reward_points FROM users WHERE id = $1', [req.user.id]);
    const referralsResult = await db.query('SELECT COUNT(*) FROM users WHERE referred_by = $1', [req.user.id]);
    
    res.json({
      referralCode: userResult.rows[0].referral_code,
      rewardPoints: userResult.rows[0].reward_points,
      totalReferred: parseInt(referralsResult.rows[0].count, 10),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
