const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Throttle login attempts — max 10 per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' },
});

/**
 * POST /api/auth/login
 * Body: { password: string }
 * Returns: { token, expiresIn }
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Compare against the hashed password stored in .env (or plain text fallback)
    const storedPassword = process.env.ADMIN_PASSWORD;
    const isMatch = storedPassword.startsWith('$2')
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword; // plain-text fallback for dev

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/auth/verify
 * Verifies a token is still valid (useful for frontend session checks).
 */
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  try {
    jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
