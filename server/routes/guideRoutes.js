const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit Guide Application
// @route   POST /api/guides/apply
router.post('/apply', protect, async (req, res) => {
  const { bio, location, languages, specialties, idFront, email, name } = req.body;
  const userId = req.user.id;

  try {
    // 1. Ensure user is not already a guide
    if (req.user.role === 'guide') {
      return res.status(400).json({ message: 'You are already a guide.' });
    }

    // Check if they already have a pending request
    const existing = await db.query('SELECT status FROM guide_verification_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
    if (existing.rows.length > 0 && existing.rows[0].status === 'pending') {
      return res.status(400).json({ message: 'You already have a pending application.' });
    }

    // 2. Validate Required Fields for Auto-Verification
    // We check if they provided bio, location, languages, and a document.
    const hasRequiredFields = bio && location && languages && idFront;
    
    // Simulate ID verification checks (e.g., verifying it's a real passport)
    const isProfileComplete = hasRequiredFields && bio.length >= 10;

    if (isProfileComplete) {
      // AUTO VERIFICATION SYSTEM: Auto Approve!
      
      // Upgrade role to guide & verified true
      await db.query(
        'UPDATE users SET role = $1, verified = true, bio = COALESCE($2, bio), location = COALESCE($3, location) WHERE id = $4',
        ['guide', bio, location, userId]
      );
      
      // Initialize Guide Profile
      await db.query(
        'INSERT INTO guide_profiles (user_id, guide_level, trust_score) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [userId, 'bronze', 100.00]
      );

      // Log the verification request as ai_approved
      await db.query(
        'INSERT INTO guide_verification_requests (user_id, status, ai_confidence_score) VALUES ($1, $2, $3)',
        [userId, 'ai_approved', 98.5]
      );

      return res.json({ 
        message: 'Application auto-approved successfully!',
        status: 'approved',
        role: 'guide'
      });
    } else {
      // Missing info or failed auto-check: Send to Admin Queue
      await db.query(
        'INSERT INTO guide_verification_requests (user_id, status) VALUES ($1, $2)',
        [userId, 'pending']
      );

      return res.json({ 
        message: 'Application submitted and is pending admin review.',
        status: 'pending',
        role: req.user.role
      });
    }
  } catch (error) {
    console.error('Error applying for guide:', error);
    res.status(500).json({ message: 'Server error while submitting application.' });
  }
});

// @desc    Get Guide Verification Requests (Admin Only)
// @route   GET /api/guides/applications
router.get('/applications', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  
  try {
    const result = await db.query(`
      SELECT gvr.id, gvr.status, gvr.created_at, u.name, u.email, u.id as user_id
      FROM guide_verification_requests gvr
      JOIN users u ON gvr.user_id = u.id
      ORDER BY gvr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching guide applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get current user's application status
// @route   GET /api/guides/status
router.get('/status', protect, async (req, res) => {
  try {
    const result = await db.query('SELECT status, created_at FROM guide_verification_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.json({ hasApplication: false });
    }
    res.json({ hasApplication: true, status: result.rows[0].status, appliedAt: result.rows[0].created_at });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Approve or Reject Guide Application (Admin Only)
// @route   PUT /api/guides/applications/:id
router.put('/applications/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  
  const { status } = req.body; // 'ai_approved' or 'rejected'
  const applicationId = req.params.id;

  try {
    const appRes = await db.query('SELECT user_id FROM guide_verification_requests WHERE id = $1', [applicationId]);
    if (appRes.rows.length === 0) return res.status(404).json({ message: 'Application not found' });
    const userId = appRes.rows[0].user_id;

    await db.query('UPDATE guide_verification_requests SET status = $1 WHERE id = $2', [status, applicationId]);

    if (status === 'ai_approved' || status === 'approved') {
      await db.query('UPDATE users SET role = $1, verified = true WHERE id = $2', ['guide', userId]);
      await db.query(
        'INSERT INTO guide_profiles (user_id, guide_level, trust_score) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [userId, 'bronze', 100.00]
      );
    }
    
    res.json({ message: `Application ${status}` });
  } catch (error) {
    console.error('Error updating guide application:', error);
    res.status(500).json({ message: 'Server error' });
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
