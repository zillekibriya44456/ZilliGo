const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'traveler']
    );

    const user = toCamel(newUser.rows[0]);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      if (user.suspended) {
        return res.status(403).json({ message: 'Account suspended. Contact support.' });
      }

      const userResponse = toCamel(user);
      res.json({
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email,
        role: userResponse.role,
        verified: userResponse.verified,
        token: generateToken(userResponse.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, avatar, verified, suspended, reward_points FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (user) {
      res.json(toCamel(user));
    } else if (req.user && req.user.id > 10000) {
      res.json({ id: req.user.id, name: 'Demo User', role: 'traveler', verified: true, avatar: `https://ui-avatars.com/api/?name=Demo+User&background=00d4aa&color=000` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateUserProfile = async (req, res) => {
  const { name, bio, location, avatar } = req.body;
  try {
    const result = await db.query(
      `UPDATE users SET 
      name = COALESCE($1, name), 
      bio = COALESCE($2, bio), 
      location = COALESCE($3, location), 
      avatar = COALESCE($4, avatar) 
      WHERE id = $5 RETURNING id, name, email, role, avatar, bio, location, verified, reward_points`,
      [name, bio, location, avatar, req.user.id]
    );
    res.json(toCamel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
