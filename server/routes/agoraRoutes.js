const express = require('express');
const router = express.Router();
const { protect, guide } = require('../middleware/authMiddleware');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const db = require('../utils/db');

// In a real production environment, these must be set in .env
// We provide dummy fallbacks just to allow the server to start without crashing
const APP_ID = process.env.AGORA_APP_ID || 'dummy_app_id';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || 'dummy_app_certificate';

// GET /api/agora/token/:channelName
// role query param: 'publisher' (for guides) or 'subscriber' (for travelers)
router.get('/token/:channelName', protect, (req, res) => {
  const { channelName } = req.params;
  const { role } = req.query;

  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  // Define role based on query param
  let agoraRole = RtcRole.SUBSCRIBER;
  if (role === 'publisher' || req.user.role === 'guide') {
    agoraRole = RtcRole.PUBLISHER;
  }

  // Token expires in 2 hours
  const expirationTimeInSeconds = 3600 * 2;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    // Generate token. We use user ID as uid.
    const uid = req.user.id;
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID, 
      APP_CERTIFICATE, 
      channelName, 
      uid, 
      agoraRole, 
      privilegeExpiredTs
    );
    
    return res.json({ token, uid, appId: APP_ID });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
});

// POST /api/agora/start-stream
// Guide spawns a new live stream session from an existing tour
router.post('/start-stream', protect, guide, async (req, res) => {
  const { tourId } = req.body;
  if (!tourId) return res.status(400).json({ message: 'tourId is required' });

  try {
    // Verify tour exists and belongs to this guide
    const tourRes = await db.query('SELECT * FROM tours WHERE id = $1 AND guide_id = $2', [tourId, req.user.id]);
    if (tourRes.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found or you are not authorized' });
    }

    const tour = tourRes.rows[0];

    // Create a new active live stream session
    const insertRes = await db.query(`
      INSERT INTO live_streams 
      (guide_id, title, location, language, duration_minutes, cover_image) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, [req.user.id, tour.title, tour.location, 'English', tour.duration_minutes, tour.cover_image]);

    return res.status(201).json({ liveStreamId: insertRes.rows[0].id });
  } catch (error) {
    console.error('Error starting live stream:', error);
    res.status(500).json({ message: 'Error starting live stream' });
  }
});

module.exports = router;
