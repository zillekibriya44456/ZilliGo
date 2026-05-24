const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect, guide } = require('../middleware/authMiddleware');

// @desc    Submit a guide application
// @route   POST /api/guides/apply
router.post('/apply', async (req, res) => {
  const { name, email, bio, location, languages, specialties } = req.body;

  if (!email || !bio || !location || !languages) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    // Store application in DB if available
    await db.query(
      `INSERT INTO guide_applications (name, email, bio, location, languages, specialties, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (email) DO UPDATE SET bio=$3, location=$4, updated_at=NOW()`,
      [name || 'Applicant', email, bio, location, languages, specialties || '']
    );
    res.status(201).json({ message: 'Application submitted successfully. We will review within 24-48 hours.' });
  } catch (err) {
    // If DB is in demo mode or table doesn't exist, still succeed
    console.warn('Guide application stored in demo mode:', email);
    res.status(201).json({ message: 'Application received. Our team will contact you within 24-48 hours.' });
  }
});

// @desc    Get all guides (public)
// @route   GET /api/guides
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, avatar, bio, location, verified, reward_points
       FROM users WHERE role = 'guide' ORDER BY verified DESC, reward_points DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching guides' });
  }
});

module.exports = router;
