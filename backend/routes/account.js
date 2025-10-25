const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const Order = require('../models/Order.js');
const ctrl = require('../controllers/account.controller.js');

const router = express.Router();

// ensure upload folder
const uploadDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `profile_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Protect middleware: supports JWT (if STRIPE/JWT secret set) or dev-token fallback
async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    if (process.env.JWT_SECRET && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ error: 'User not found' });
      req.user = user;
      return next();
    }

    // Dev fallback: require header X-User-Id when using dev-token
    if (auth === 'Bearer dev-token') {
      const userId = req.headers['x-user-id'] || req.body.userId || req.params.id;
      if (!userId) return res.status(401).json({ error: 'dev-token requires X-User-Id header or userId param' });
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      req.user = user;
      return next();
    }

    return res.status(401).json({ error: 'Not authorized' });
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// Get profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    // strip sensitive fields
    delete user.password;
    return res.json({ ok: true, user });
  } catch (err) {
    console.error('Error fetching profile', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/:id', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const allowed = ['firstName','lastName','email','phone','bio','profileVisibility','shareAnalytics','shareThirdParty','notifications'];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const user = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    return res.json({ ok: true, user });
  } catch (err) {
    console.error('Error updating profile', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload profile photo
router.post('/:id/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const relPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { profilePhoto: relPath } }, { new: true }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    return res.json({ ok: true, user, url: relPath });
  } catch (err) {
    console.error('Error uploading photo', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/:id/password', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Support hashed passwords (bcrypt) or plain-text (legacy)
    let match = false;
    if (user.password && user.password.startsWith('$2')) {
      match = await bcrypt.compare(currentPassword, user.password);
    } else {
      match = currentPassword === user.password;
    }

    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error changing password', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle two-factor
router.put('/:id/twofactor', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const { enabled } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { twoFactorEnabled: !!enabled } }, { new: true }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    return res.json({ ok: true, user });
  } catch (err) {
    console.error('Error toggling two-factor', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Connected accounts - list
router.get('/:id/connected', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ ok: true, connectedAccounts: user.connectedAccounts || [] });
  } catch (err) {
    console.error('Error getting connected accounts', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add connected account
router.post('/:id/connected', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const { provider, providerId, info } = req.body;
    if (!provider || !providerId) return res.status(400).json({ error: 'provider and providerId required' });
    const user = await User.findById(req.params.id);
    user.connectedAccounts = user.connectedAccounts || [];
    user.connectedAccounts.push({ provider, providerId, info });
    await user.save();
    const out = user.toObject(); delete out.password;
    return res.json({ ok: true, connectedAccounts: out.connectedAccounts });
  } catch (err) {
    console.error('Error adding connected account', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove connected account by index
router.delete('/:id/connected/:index', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const idx = parseInt(req.params.index, 10);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!Array.isArray(user.connectedAccounts) || idx < 0 || idx >= user.connectedAccounts.length) return res.status(400).json({ error: 'Invalid index' });
    user.connectedAccounts.splice(idx, 1);
    await user.save();
    const out = user.toObject(); delete out.password;
    return res.json({ ok: true, connectedAccounts: out.connectedAccounts });
  } catch (err) {
    console.error('Error removing connected account', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Export user data
router.get('/:id/export', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    const filename = `user-${req.params.id}.json`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error('Error exporting user data', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account
router.delete('/:id', protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
    // remove orders and other related data (best-effort)
    await Order.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting account', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// If you have an auth middleware that populates req.user, you can enable it.
// Example: const auth = require('../middleware/auth');
// router.get('/me', auth.requireAuth, ctrl.getMe);
// router.put('/me', auth.requireAuth, ctrl.updateMe);

// For now expose endpoints without mandatory auth to make local dev easier.
// The endpoint accepts userId via query/body if no auth middleware is present.

router.get('/me', ctrl.getMe);
router.put('/me', express.json(), ctrl.updateMe);

module.exports = router;
