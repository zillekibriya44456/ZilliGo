const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

// @desc    Check tour availability for a specific date and time slot
// @route   GET /api/bookings/availability/:tour_id
exports.checkAvailability = async (req, res) => {
  const { date, time } = req.query;
  const { tour_id } = req.params;
  try {
    const schedule = await db.query(
      'SELECT capacity, booked_count, status FROM tour_schedules WHERE tour_id = $1 AND date = $2 AND time_slot = $3',
      [tour_id, date, time]
    );

    if (schedule.rows.length === 0) {
      return res.json({ available: false, status: 'no_schedule' });
    }

    const slot = schedule.rows[0];
    if (slot.status !== 'available') {
      return res.json({ available: false, status: slot.status });
    }

    const spotsLeft = slot.capacity - slot.booked_count;
    res.json({
      available: spotsLeft > 0,
      spotsLeft,
      capacity: slot.capacity,
      status: spotsLeft > 0 ? 'available' : 'waitlist'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability' });
  }
};

// @desc    Create a booking (Instant, Request, Waitlist)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { tour_id, booking_date, booking_time, guests, booking_type } = req.body;
  // booking_type can be 'instant', 'request', 'waitlist'

  try {
    const tour = await db.query('SELECT price, max_participants FROM tours WHERE id = $1', [tour_id]);
    if (tour.rows.length === 0) return res.status(404).json({ message: 'Tour not found' });
    
    // Calculate total amount
    const total_amount = tour.rows[0].price * (guests?.length || 1);
    
    // Status depends on booking_type
    let initialStatus = 'pending';
    if (booking_type === 'instant') initialStatus = 'confirmed';
    if (booking_type === 'waitlist') initialStatus = 'waitlisted';

    // Begin transaction
    await db.query('BEGIN');

    // Insert booking
    const bookingRes = await db.query(
      'INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [req.user.id, tour_id, booking_date, booking_time, total_amount, initialStatus]
    );
    const bookingId = bookingRes.rows[0].id;

    // Insert guests
    if (guests && guests.length > 0) {
      for (const guest of guests) {
        await db.query(
          'INSERT INTO booking_guests (booking_id, full_name, age_group, special_requests) VALUES ($1, $2, $3, $4)',
          [bookingId, guest.name, guest.ageGroup || 'adult', guest.requests || '']
        );
      }
    }

    // Update schedule if confirmed
    if (initialStatus === 'confirmed') {
      await db.query(
        'UPDATE tour_schedules SET booked_count = booked_count + $1 WHERE tour_id = $2 AND date = $3 AND time_slot = $4',
        [guests?.length || 1, tour_id, booking_date, booking_time]
      );
    }

    await db.query('COMMIT');
    
    // Emit real-time notification to guide (handled in socket server based on events)
    // io.to(`guide_${tour.guide_id}`).emit('new_booking', { bookingId, type: initialStatus });

    res.status(201).json({ bookingId, status: initialStatus, total_amount });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Error creating booking', error: error.message });
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
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// @desc    Update booking status (Admin/Guide)
// @route   PATCH /api/bookings/:id
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    // If status changes to confirmed from pending, we should update schedule booked_count
    // For brevity, skipping the full lock logic here
    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};
