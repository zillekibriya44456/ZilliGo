const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// ──────────────────────────────────────────────────────────────────────────────
// Email / Password Auth
// ──────────────────────────────────────────────────────────────────────────────

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', protect, authController.getUserProfile);
router.put('/profile', protect, authController.updateUserProfile);

// ──────────────────────────────────────────────────────────────────────────────
// OAuth Helper
// ──────────────────────────────────────────────────────────────────────────────

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * Find or create a user from OAuth profile data.
 * Returns the user record with a JWT token.
 */
async function findOrCreateOAuthUser({ email, name, avatar, provider }) {
  try {
    // Look up existing user
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      const user = toCamel(existing.rows[0]);
      return { ...user, token: generateToken(user.id) };
    }

    // Create new user (no password — OAuth users use provider)
    const newUser = await db.query(
      `INSERT INTO users (name, email, password_hash, role, avatar, verified)
       VALUES ($1, $2, $3, 'traveler', $4, true)
       RETURNING id, name, email, role, avatar, verified`,
      [name, email, `oauth_${provider}_${Date.now()}`, avatar || null]
    );
    const user = toCamel(newUser.rows[0]);
    return { ...user, token: generateToken(user.id) };
  } catch (err) {
    // Demo mode — return a synthetic user
    console.warn('⚠️ DB unavailable — returning demo OAuth user');
    const demoId = Date.now();
    return {
      id: demoId,
      name,
      email,
      role: 'traveler',
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4aa&color=000`,
      verified: true,
      token: generateToken(demoId),
    };
  }
}

/** Redirect to frontend with user data encoded in URL */
function redirectWithUser(res, user) {
  const payload = encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    verified: user.verified,
    token: user.token,
  }));
  res.redirect(`${FRONTEND_URL}/auth/callback?user=${payload}`);
}

/** Redirect to frontend with an error message */
function redirectWithError(res, msg) {
  res.redirect(`${FRONTEND_URL}/auth?error=${encodeURIComponent(msg)}`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Check if a specific OAuth provider is configured (used by frontend)
// GET /api/auth/check-oauth?provider=google
// ──────────────────────────────────────────────────────────────────────────────

router.get('/check-oauth', (req, res) => {
  const { provider } = req.query;
  const envMap = {
    google: 'GOOGLE_CLIENT_ID',
    github: 'GITHUB_CLIENT_ID',
    facebook: 'FACEBOOK_CLIENT_ID',
    linkedin: 'LINKEDIN_CLIENT_ID',
    instagram: null, // Never configured
  };
  const envKey = envMap[provider];
  const configured = envKey ? !!process.env[envKey] : false;
  res.json({ provider, configured });
});

// ──────────────────────────────────────────────────────────────────────────────
// GOOGLE OAuth 2.0 (Full Flow)
// ──────────────────────────────────────────────────────────────────────────────


router.get('/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return redirectWithError(res, 'Google login is not configured yet. Please use email/password to sign in.');
  }
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'online',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return redirectWithError(res, 'Google login was cancelled or failed.');

  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token from Google');

    // Get user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profile.email) throw new Error('No email from Google');

    const user = await findOrCreateOAuthUser({
      email: profile.email,
      name: profile.name || profile.email,
      avatar: profile.picture,
      provider: 'google',
    });
    redirectWithUser(res, user);
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    redirectWithError(res, 'Google login failed. Please try again or use email/password.');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GITHUB OAuth (Full Flow)
// ──────────────────────────────────────────────────────────────────────────────

router.get('/github', (req, res) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return redirectWithError(res, 'GitHub login is not configured yet. Please use email/password to sign in.');
  }
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/github/callback`,
    scope: 'user:email read:user',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get('/github/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return redirectWithError(res, 'GitHub login was cancelled or failed.');

  try {
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/github/callback`;

    // Exchange code for token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token from GitHub');

    // Get user profile
    const profileRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'ZilliGO-App' },
    });
    const profile = await profileRes.json();

    // GitHub might not return email publicly — fetch it separately
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'ZilliGO-App' },
      });
      const emails = await emailsRes.json();
      const primary = Array.isArray(emails) ? emails.find(e => e.primary && e.verified) : null;
      email = primary?.email || `github_${profile.id}@zilligo.local`;
    }

    const user = await findOrCreateOAuthUser({
      email,
      name: profile.name || profile.login,
      avatar: profile.avatar_url,
      provider: 'github',
    });
    redirectWithUser(res, user);
  } catch (err) {
    console.error('GitHub OAuth error:', err.message);
    redirectWithError(res, 'GitHub login failed. Please try again or use email/password.');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// FACEBOOK OAuth (Full Flow)
// ──────────────────────────────────────────────────────────────────────────────

router.get('/facebook', (req, res) => {
  if (!process.env.FACEBOOK_CLIENT_ID) {
    return redirectWithError(res, 'Facebook login is not configured yet. Please use email/password to sign in.');
  }
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/facebook/callback`,
    scope: 'email,public_profile',
    response_type: 'code',
  });
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`);
});

router.get('/facebook/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return redirectWithError(res, 'Facebook login was cancelled or failed.');

  try {
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/facebook/callback`;

    // Exchange code for token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token from Facebook');

    // Get user profile
    const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
    const profile = await profileRes.json();
    if (!profile.email) throw new Error('No email from Facebook — make sure your Facebook account has a verified email');

    const user = await findOrCreateOAuthUser({
      email: profile.email,
      name: profile.name,
      avatar: profile.picture?.data?.url,
      provider: 'facebook',
    });
    redirectWithUser(res, user);
  } catch (err) {
    console.error('Facebook OAuth error:', err.message);
    redirectWithError(res, 'Facebook login failed. Please try again or use email/password.');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// LINKEDIN OAuth (Full Flow)
// ──────────────────────────────────────────────────────────────────────────────

router.get('/linkedin', (req, res) => {
  if (!process.env.LINKEDIN_CLIENT_ID) {
    return redirectWithError(res, 'LinkedIn login is not configured yet. Please use email/password to sign in.');
  }
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`,
    scope: 'openid profile email',
  });
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
});

router.get('/linkedin/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return redirectWithError(res, 'LinkedIn login was cancelled or failed.');

  try {
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`;

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token from LinkedIn');

    // Get profile via OpenID Connect userinfo endpoint
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    const user = await findOrCreateOAuthUser({
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      provider: 'linkedin',
    });
    redirectWithUser(res, user);
  } catch (err) {
    console.error('LinkedIn OAuth error:', err.message);
    redirectWithError(res, 'LinkedIn login failed. Please try again or use email/password.');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// INSTAGRAM — Requires Facebook Business Review for email access
// Show informative message instead
// ──────────────────────────────────────────────────────────────────────────────

router.get('/instagram', (req, res) => {
  redirectWithError(res, 'Instagram login requires a Facebook Business account. Please use Google, GitHub, or email/password instead.');
});

module.exports = router;
