const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET || 'zilligo_super_secure_jwt_secret_key_2026';
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
      req.user = result.rows[0];

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const guide = (req, res, next) => {
  if (req.user && (req.user.role === 'guide' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a guide' });
  }
};

module.exports = { protect, admin, guide };
