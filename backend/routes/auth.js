const express = require('express');
const sendEmail = require('../utils/sendEmail.js');
const User = require('../models/User.js');
const VerificationToken = require('../models/VerificationToken.js');

const router = express.Router();

// Register (creates user and sends verification code)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    // create verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationToken.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const subject = 'Verify your email';
    const text = `Your verification code is ${code}`;
    const html = `<p>Your verification code is <strong>${code}</strong></p>`;

    const result = await sendEmail({ to: email, subject, text, html });
    if (!result.success) return res.status(500).json({ error: 'Failed to send verification email', details: result.error?.message || result.error });

    return res.json({ ok: true, previewUrl: result.previewUrl || null });
  } catch (err) {
    console.error('Error in /register:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send verification code (resend)
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationToken.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const subject = 'Your verification code';
    const text = `Your verification code is ${code}`;
    const html = `<p>Your verification code is <strong>${code}</strong></p>`;

    const result = await sendEmail({ to: email, subject, text, html });
    if (!result.success) return res.status(500).json({ error: 'Failed to send email', details: result.error?.message || result.error });

    return res.json({ ok: true, previewUrl: result.previewUrl || null });
  } catch (err) {
    console.error('Error in /send-verification:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify code
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const token = await VerificationToken.findOne({ email });
    if (!token) return res.status(400).json({ error: 'No verification token found' });

    if (token.code !== String(code)) return res.status(400).json({ error: 'Invalid code' });

    await VerificationToken.deleteOne({ email });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error in /verify-email:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic login stub (replace with real auth & password hash in production)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    // In production return JWT; for now return a simple token placeholder
    return res.json({ ok: true, user: { id: user._id, email: user.email, name: user.name }, token: 'dev-token' });
  } catch (err) {
    console.error('Error in /login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationToken.findOneAndUpdate(
      { email },
      { code: resetCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const subject = 'Password Reset Code';
    const text = `Your password reset code is ${resetCode}`;
    const html = `<p>Your password reset code is <strong>${resetCode}</strong></p>`;

    const result = await sendEmail({ to: email, subject, text, html });
    if (!result.success) return res.status(500).json({ error: 'Failed to send reset email', details: result.error?.message || result.error });

    return res.json({ ok: true, previewUrl: result.previewUrl || null });
  } catch (err) {
    console.error('Error in /forgot-password:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;