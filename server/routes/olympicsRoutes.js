const express = require('express');
const router = express.Router();
const olympicsController = require('../controllers/olympicsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', olympicsController.getLeaderboard);
router.post('/vote', protect, olympicsController.castVote);

module.exports = router;
