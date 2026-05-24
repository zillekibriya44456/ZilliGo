const db = require('../utils/db');

// @desc    Create a booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { tour_id, booking_date, booking_time, total_amount } = req.body;

  try {
    // Check if tour exists
    const tour = await db.query('SELECT * FROM tours WHERE id = $1', [tour_id]);
    if (tour.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const result = await db.query(
      'INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, total_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, tour_id, booking_date, booking_time, total_amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, t.title, t.cover_image, t.location, t.duration_minutes 
       FROM bookings b 
       JOIN tours t ON b.tour_id = t.id 
       WHERE b.user_id = $1 
       ORDER BY b.booking_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// @desc    Update booking status (Admin/Guide)
// @route   PATCH /api/bookings/:id
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};
