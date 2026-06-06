const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short lived access token
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
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
  const { email, password, rememberMe } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      if (user.suspended) {
        return res.status(403).json({ message: 'Account suspended. Contact support.' });
      }

      const refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1)); // 30 days or 1 day

      // Save refresh token
      await db.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, refreshToken, expiresAt]
      );

      // Save login history
      await db.query(
        'INSERT INTO login_history (user_id, ip_address, user_agent, success) VALUES ($1, $2, $3, $4)',
        [user.id, req.ip, req.headers['user-agent'], true]
      );

      const userResponse = toCamel(user);
      res.json({
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email,
        role: userResponse.role,
        verified: userResponse.verified,
        token: generateToken(userResponse.id),
        refreshToken,
      });
    } else {
      if (user) {
        await db.query(
          'INSERT INTO login_history (user_id, ip_address, user_agent, success) VALUES ($1, $2, $3, $4)',
          [user.id, req.ip, req.headers['user-agent'], false]
        );
      }
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const result = await db.query('SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false', [refreshToken]);
    const tokenRecord = result.rows[0];

    if (!tokenRecord) return res.status(403).json({ message: 'Invalid refresh token' });
    if (new Date() > new Date(tokenRecord.expires_at)) {
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    const token = generateToken(tokenRecord.user_id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [result.rows[0].id, resetToken, expiresAt]);
    
    // In a real app, send email here
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await db.query('SELECT * FROM password_resets WHERE token = $1 AND expires_at > NOW()', [token]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, result.rows[0].user_id]);
    await db.query('DELETE FROM password_resets WHERE token = $1', [token]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
  const { name, bio, location, avatar, role } = req.body;
  try {
    const result = await db.query(
      `UPDATE users SET 
      name = COALESCE($1, name), 
      bio = COALESCE($2, bio), 
      location = COALESCE($3, location), 
      avatar = COALESCE($4, avatar),
      role = COALESCE($5, role)
      WHERE id = $6 RETURNING id, name, email, role, avatar, bio, location, verified, reward_points`,
      [name, bio, location, avatar, role, req.user.id]
    );
    res.json(toCamel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
