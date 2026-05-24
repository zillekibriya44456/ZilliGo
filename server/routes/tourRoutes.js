const express = require('express');
const router = express.Router();
const { getTours, getTourById, createTour } = require('../controllers/tourController');
const { protect, guide } = require('../middleware/authMiddleware');

router.get('/', getTours);
router.get('/:id', getTourById);
router.post('/', protect, guide, createTour);

module.exports = router;
