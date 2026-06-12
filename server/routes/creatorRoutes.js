const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/authMiddleware');
const { toCamel } = require('../utils/camelCase');

// GET /api/creators/profile/:id - Get creator profile and videos
router.get('/profile/:id', async (req, res) => {
  try {
    const creatorId = parseInt(req.params.id, 10);
    const profileRes = await db.query(`
      SELECT p.*, u.name, u.avatar,
             (SELECT COUNT(*) FROM creator_followers WHERE creator_id = $1) as follower_count
      FROM creator_profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `, [creatorId]);

    const videosRes = await db.query('SELECT * FROM uploaded_videos WHERE creator_id = $1 ORDER BY created_at DESC', [creatorId]);

    if (profileRes.rows.length === 0) {
      // Return a basic profile if not fully setup yet
      const userRes = await db.query('SELECT id as user_id, name, avatar FROM users WHERE id = $1', [creatorId]);
      if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
      return res.json({ profile: toCamel({...userRes.rows[0], follower_count: 0}), videos: videosRes.rows.map(toCamel) });
    }

    res.json({
      profile: toCamel(profileRes.rows[0]),
      videos: videosRes.rows.map(toCamel)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching creator profile' });
  }
});

// PUT /api/creators/profile - Update own creator profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, youtubeUrl, instagramUrl, tiktokUrl } = req.body;
    const result = await db.query(`
      INSERT INTO creator_profiles (user_id, bio, youtube_url, instagram_url, tiktok_url)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        bio = EXCLUDED.bio,
        youtube_url = EXCLUDED.youtube_url,
        instagram_url = EXCLUDED.instagram_url,
        tiktok_url = EXCLUDED.tiktok_url
      RETURNING *
    `, [req.user.id, bio, youtubeUrl, instagramUrl, tiktokUrl]);
    
    // Auto-update user role if they are setting up creator profile
    await db.query(`UPDATE users SET role = 'creator' WHERE id = $1 AND role = 'traveler'`, [req.user.id]);
    
    res.json(toCamel(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// POST /api/creators/videos - Upload a new video
router.post('/videos', protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    const result = await db.query(`
      INSERT INTO uploaded_videos (creator_id, title, description, video_url, thumbnail_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [req.user.id, title, description, videoUrl, thumbnailUrl]);
    res.status(201).json(toCamel(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading video' });
  }
});

// POST /api/creators/follow/:id - Toggle follow status
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const creatorId = parseInt(req.params.id, 10);
    if (creatorId === req.user.id) return res.status(400).json({ message: 'Cannot follow yourself' });

    // Check if following
    const check = await db.query('SELECT * FROM creator_followers WHERE creator_id = $1 AND follower_id = $2', [creatorId, req.user.id]);
    
    if (check.rows.length > 0) {
      // Unfollow
      await db.query('DELETE FROM creator_followers WHERE creator_id = $1 AND follower_id = $2', [creatorId, req.user.id]);
      res.json({ message: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      await db.query('INSERT INTO creator_followers (creator_id, follower_id) VALUES ($1, $2)', [creatorId, req.user.id]);
      
      // Notify creator
      await db.query(`
        INSERT INTO notifications (user_id, type, title, message, reference_id)
        VALUES ($1, 'new_follower', 'New Follower', 'Someone just started following you!', $2)
      `, [creatorId, req.user.id]);

      res.json({ message: 'Followed successfully', following: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating follow status' });
  }
});

module.exports = router;
