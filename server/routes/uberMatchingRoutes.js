const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const MatchingEngine = require('../services/MatchingEngine');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/uber/status
// @desc    Guide sets online status and location
router.post('/status', protect, async (req, res) => {
  try {
    const { latitude, longitude, online_status } = req.body;
    const guideId = req.user.id;

    if (req.user.role !== 'guide') {
      return res.status(403).json({ message: 'Only guides can go online.' });
    }

    // Upsert guide location
    await db.query(`
      INSERT INTO guide_locations (guide_id, latitude, longitude, online_status, last_updated)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (guide_id) 
      DO UPDATE SET 
        latitude = EXCLUDED.latitude, 
        longitude = EXCLUDED.longitude, 
        online_status = EXCLUDED.online_status,
        last_updated = NOW()
    `, [guideId, latitude, longitude, online_status]);

    res.json({ success: true, message: `Status updated to ${online_status}` });
  } catch (err) {
    console.error('Status Update Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/uber/request
// @desc    Traveler requests a guide
router.post('/request', protect, async (req, res) => {
  try {
    const { city, latitude, longitude, amount, durationMinutes } = req.body;
    const travelerId = req.user.id;

    // Find nearest
    const nearestGuide = await MatchingEngine.findNearestGuide(city, latitude, longitude);
    
    if (!nearestGuide) {
      return res.status(404).json({ message: 'No guides available in this area currently.' });
    }

    // Create booking request (60s expiry)
    const reqRes = await db.query(`
      INSERT INTO booking_requests (traveler_id, guide_id, city, latitude, longitude, amount, duration_minutes, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '60 seconds')
      RETURNING id, expires_at
    `, [travelerId, nearestGuide.guide_id, city, latitude, longitude, amount, durationMinutes]);

    const requestData = reqRes.rows[0];

    // Emit to socket
    const io = req.app.get('io');
    io.emit('booking_request', {
      requestId: requestData.id,
      guideId: nearestGuide.guide_id,
      guideName: nearestGuide.guide_name,
      distance: nearestGuide.distance.toFixed(1),
      travelerId,
      travelerName: req.user.name,
      amount,
      duration: durationMinutes,
      expiresAt: requestData.expires_at
    });

    res.json({
      success: true,
      message: 'Request sent to nearest guide.',
      guide: nearestGuide,
      requestId: requestData.id
    });
  } catch (err) {
    console.error('Booking Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/uber/accept
// @desc    Guide accepts request
router.post('/accept', protect, async (req, res) => {
  try {
    const { requestId } = req.body;
    const guideId = req.user.id;

    // Atomic update to prevent double-accepting
    const reqRes = await db.query(`
      UPDATE booking_requests 
      SET status = 'accepted', updated_at = NOW()
      WHERE id = $1 AND guide_id = $2 AND status = 'pending' AND expires_at > NOW()
      RETURNING *
    `, [requestId, guideId]);

    if (reqRes.rows.length === 0) {
      return res.status(400).json({ message: 'Request expired or already handled.' });
    }

    const bookingReq = reqRes.rows[0];

    // Mark guide as busy
    await db.query(`UPDATE guide_locations SET availability_status = 'busy' WHERE guide_id = $1`, [guideId]);

    // Emit success to traveler
    const io = req.app.get('io');
    io.emit('booking_accepted', {
      requestId,
      travelerId: bookingReq.traveler_id,
      guideId,
      message: 'Guide has accepted your request! They are on their way.'
    });

    res.json({ success: true, message: 'Booking accepted.' });
  } catch (err) {
    console.error('Accept Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/uber/reject
// @desc    Guide rejects request
router.post('/reject', protect, async (req, res) => {
  try {
    const { requestId } = req.body;
    const guideId = req.user.id;

    // Mark as rejected
    await db.query(`
      UPDATE booking_requests 
      SET status = 'rejected', updated_at = NOW()
      WHERE id = $1 AND guide_id = $2
    `, [requestId, guideId]);

    // We can immediately trigger the escalation loop here by marking it 'expired' and invoking the engine
    // But for simplicity, we'll let the Cron/Interval pick it up OR we explicitly expire it:
    await db.query(`UPDATE booking_requests SET expires_at = NOW() - INTERVAL '1 second', status = 'pending' WHERE id = $1`, [requestId]);
    
    // Engine will pick it up on next tick
    const io = req.app.get('io');
    MatchingEngine.processEscalations(io);

    res.json({ success: true, message: 'Request rejected. Route sent to next guide.' });
  } catch (err) {
    console.error('Reject Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
