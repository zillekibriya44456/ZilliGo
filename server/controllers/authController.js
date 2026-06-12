const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

const JWT_SECRET = process.env.JWT_SECRET || 'zilligo_super_secure_jwt_secret_key_2026';
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password, role, referralCode } = req.body;

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Resolve referred_by if referralCode is provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await db.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (referrer.rows.length > 0) {
        referredBy = referrer.rows[0].id;
      }
    }

    // Generate unique referral code for the new user
    const newReferralCode = crypto.randomBytes(4).toString('hex') + Date.now().toString().slice(-4);

    // Create user
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role, referral_code, referred_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, referral_code',
      [name, email, hashedPassword, role || 'traveler', newReferralCode, referredBy]
    );

    const user = toCamel(newUser.rows[0]);

    // If successfully referred, you could add points to referrer here
    if (referredBy) {
      await db.query('UPDATE users SET reward_points = reward_points + 100 WHERE id = $1', [referredBy]);
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
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
    let result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // Auto-seed default admin if database is connected but hasn't been seeded yet
    if (!user && email === 'admin@zilligo.com') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      try {
        const insertRes = await db.query(
          "INSERT INTO users (name, email, password_hash, role, verified, avatar) VALUES ($1, $2, $3, 'admin', true, $4) RETURNING *",
          ['Admin User', 'admin@zilligo.com', hashedPassword, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80']
        );
        user = insertRes.rows[0];
      } catch (err) {
        console.error('Failed to auto-seed admin user:', err);
      }
    }

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
      `SELECT id, name, email, role, avatar, cover_image, verified, suspended, reward_points, 
       bio, location, phone_number, country, state, city, languages_spoken, experience, social_links 
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    const user = result.rows[0];

    if (user) {
      res.json(toCamel(user));
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
  const { 
    name, bio, location, avatar, role, coverImage, 
    phone, country, state, city, languages, experience, socialLinks 
  } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE users SET 
      name = COALESCE($1, name), 
      bio = COALESCE($2, bio), 
      location = COALESCE($3, location), 
      avatar = COALESCE($4, avatar),
      role = COALESCE($5, role),
      cover_image = COALESCE($6, cover_image),
      phone_number = COALESCE($7, phone_number),
      country = COALESCE($8, country),
      state = COALESCE($9, state),
      city = COALESCE($10, city),
      languages_spoken = COALESCE($11, languages_spoken),
      experience = COALESCE($12, experience),
      social_links = COALESCE($13, social_links)
      WHERE id = $14 RETURNING *`,
      [
        name, bio, location, avatar, role, coverImage, 
        phone, country, state, city, languages, experience, 
        socialLinks ? JSON.stringify(socialLinks) : null,
        req.user.id
      ]
    );
    res.json(toCamel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
