const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/suggestions/:userId', protect, matchingController.getSuggestions);

module.exports = router;
