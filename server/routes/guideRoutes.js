const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit Guide Application
// @route   POST /api/guides/apply
router.post('/apply', protect, async (req, res) => {
  const { 
    name, email, phone, country, state, city, languages, 
    bio, experience, socialLinks, idFront, idBack 
  } = req.body;
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

    // 2. Insert/Update fields in Users table immediately for the application
    await db.query(`
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        phone_number = $2,
        country = $3,
        state = $4,
        city = $5,
        languages_spoken = $6,
        bio = $7,
        experience = $8,
        social_links = $9,
        location = $10
      WHERE id = $11
    `, [
      name, phone, country, state, city, languages, bio, experience, 
      socialLinks ? JSON.stringify(socialLinks) : '{}', 
      city && country ? `${city}, ${country}` : null,
      userId
    ]);

    // 3. Create Pending Request
    const requestRes = await db.query(
      'INSERT INTO guide_verification_requests (user_id, status) VALUES ($1, $2) RETURNING id',
      [userId, 'pending']
    );
    const requestId = requestRes.rows[0].id;

    // 4. Store Documents
    if (idFront) {
      await db.query(
        'INSERT INTO guide_documents (request_id, document_type, encrypted_file_url) VALUES ($1, $2, $3)',
        [requestId, 'id_front', idFront]
      );
    }
    if (idBack) {
      await db.query(
        'INSERT INTO guide_documents (request_id, document_type, encrypted_file_url) VALUES ($1, $2, $3)',
        [requestId, 'id_back', idBack]
      );
    }

    // Trigger realtime notification to Admins
    const io = req.app.get('io');
    if (io) {
      io.emit('new_guide_application', { userId, requestId, name });
    }

    return res.json({ 
      message: 'Application submitted and is pending admin review.',
      status: 'pending',
      role: req.user.role
    });
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
    
    const io = req.app.get('io');
    if (io) {
      io.emit('guide_application_status', { userId, status });
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
