const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

// @desc    Get all tours
// @route   GET /api/tours
exports.getTours = async (req, res) => {
  try {
    const { category, location, kidFriendly } = req.query;
    let query = 'SELECT * FROM tours WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (location) {
      query += ` AND location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (kidFriendly === 'true') {
      query += ` AND kid_friendly = true`;
    }

    const result = await db.query(query, params);
    res.json(toCamel(result.rows));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tours' });
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
exports.getTourById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tours WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(toCamel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tour' });
  }
};

// @desc    Create a tour (Guides only)
// @route   POST /api/tours
exports.createTour = async (req, res) => {
  const { title, description, price, location, latitude, longitude, category, cover_image, duration_minutes, max_participants, kid_friendly } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO tours 
      (guide_id, title, description, price, location, latitude, longitude, category, cover_image, duration_minutes, max_participants, kid_friendly) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [req.user.id, title, description, price, location, latitude, longitude, category, cover_image, duration_minutes, max_participants, kid_friendly]
    );
    res.status(201).json(toCamel(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating tour' });
  }
};
