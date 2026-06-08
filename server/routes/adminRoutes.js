const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect, admin } = require('../middleware/authMiddleware');
const { toCamel } = require('../utils/camelCase');

// @desc    Get global stats for admin
// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const tourCount = await db.query('SELECT COUNT(*) FROM tours');
    const bookingCount = await db.query('SELECT COUNT(*) FROM bookings');
    const revenue = await db.query('SELECT SUM(total_amount) FROM bookings WHERE status = $1', ['completed']);

    res.json({
      users: parseInt(userCount.rows[0].count),
      tours: parseInt(tourCount.rows[0].count),
      bookings: parseInt(bookingCount.rows[0].count),
      revenue: parseFloat(revenue.rows[0].sum || 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// @desc    Get all users for moderation
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, avatar, verified, suspended FROM users ORDER BY created_at DESC');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// @desc    Verify a user (usually a guide)
// @route   PUT /api/admin/verify/:id
router.put('/verify/:id', protect, admin, async (req, res) => {
  try {
    await db.query('UPDATE users SET verified = true WHERE id = $1', [req.params.id]);
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying user' });
  }
});

// @desc    Suspend/Unsuspend a user
// @route   PUT /api/admin/suspend/:id
router.put('/suspend/:id', protect, admin, async (req, res) => {
  const { suspended } = req.body;
  try {
    await db.query('UPDATE users SET suspended = $1 WHERE id = $2', [suspended, req.params.id]);
    res.json({ message: suspended ? 'User suspended' : 'User unsuspended' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// @desc    Get support tickets
// @route   GET /api/admin/tickets
router.get('/tickets', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving support tickets' });
  }
});

// @desc    Reply/Resolve support ticket
// @route   PUT /api/admin/tickets/:id
router.put('/tickets/:id', protect, admin, async (req, res) => {
  const { status, reply } = req.body;
  try {
    await db.query('UPDATE support_tickets SET status = $1, reply = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [status, reply, req.params.id]);
    
    // Log admin audit
    await db.query('INSERT INTO admin_audit_logs (admin_id, action, details, ip_address) VALUES ($1, $2, $3, $4)', [
      req.user.id,
      'RESOLVE_TICKET',
      `Resolved ticket #${req.params.id} with status: ${status}`,
      req.ip
    ]);

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket' });
  }
});

// @desc    Get content reports
// @route   GET /api/admin/reports
router.get('/reports', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM content_reports ORDER BY created_at DESC');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reports' });
  }
});

// @desc    Moderate report
// @route   PUT /api/admin/reports/:id
router.put('/reports/:id', protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE content_reports SET status = $1 WHERE id = $2', [status, req.params.id]);

    await db.query('INSERT INTO admin_audit_logs (admin_id, action, details, ip_address) VALUES ($1, $2, $3, $4)', [
      req.user.id,
      'MODERATE_CONTENT',
      `Moderated report #${req.params.id} to status: ${status}`,
      req.ip
    ]);

    res.json({ message: 'Report status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report' });
  }
});

// @desc    Get system settings
// @route   GET /api/admin/settings
router.get('/settings', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM system_settings');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings' });
  }
});

// @desc    Update system settings
// @route   PUT /api/admin/settings
router.put('/settings', protect, admin, async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.query(`
      INSERT INTO system_settings (key, value) VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [key, value]);

    await db.query('INSERT INTO admin_audit_logs (admin_id, action, details, ip_address) VALUES ($1, $2, $3, $4)', [
      req.user.id,
      'UPDATE_SETTINGS',
      `Updated settings: ${key} = ${value}`,
      req.ip
    ]);

    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
router.get('/audit-logs', protect, admin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM admin_audit_logs ORDER BY created_at DESC');
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving audit logs' });
  }
});

// @desc    Get all bookings (including active disputes)
// @route   GET /api/admin/bookings
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, u.name AS traveler_name, t.title AS tour_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN tours t ON b.tour_id = t.id
      ORDER BY b.created_at DESC
    `);
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings ledger' });
  }
});

// @desc    Cancel booking as admin
// @route   PUT /api/admin/bookings/:id/cancel
router.put('/bookings/:id/cancel', protect, admin, async (req, res) => {
  try {
    await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [req.params.id]);

    await db.query('INSERT INTO admin_audit_logs (admin_id, action, details, ip_address) VALUES ($1, $2, $3, $4)', [
      req.user.id,
      'CANCEL_BOOKING',
      `Cancelled booking #${req.params.id}`,
      req.ip
    ]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// @desc    Send global platform announcement
// @route   POST /api/admin/announcement
router.post('/announcement', protect, admin, async (req, res) => {
  const { title, message, target } = req.body;
  try {
    // Select targeted user ids
    let queryStr = 'SELECT id FROM users';
    let queryParams = [];
    if (target === 'guides') {
      queryStr += " WHERE role = 'guide'";
    } else if (target === 'travelers') {
      queryStr += " WHERE role = 'traveler'";
    }

    const usersRes = await db.query(queryStr, queryParams);
    
    // Create notifications for each user
    const insertPromises = usersRes.rows.map(user => {
      return db.query(`
        INSERT INTO notifications (user_id, type, title, message, reference_id)
        VALUES ($1, 'announcement', $2, $3, '0')
      `, [user.id, title, message]);
    });
    
    await Promise.all(insertPromises);

    await db.query('INSERT INTO admin_audit_logs (admin_id, action, details, ip_address) VALUES ($1, $2, $3, $4)', [
      req.user.id,
      'SEND_ANNOUNCEMENT',
      `Announcement title: "${title}" target: ${target}`,
      req.ip
    ]);

    res.json({ message: 'Announcement broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending announcement' });
  }
});

module.exports = router;
