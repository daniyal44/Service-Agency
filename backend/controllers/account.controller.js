const User = require('../models/User');

/**
 * Get current user profile.
 * If authentication middleware sets req.user.id, it will be used.
 * Otherwise a `userId` query param is accepted for dev/test.
 */
exports.getMe = async (req, res) => {
  try {
    const id = (req.user && req.user.id) || req.query.userId;
    if (!id) return res.status(400).json({ ok: false, error: 'Missing user id' });

    const user = await User.findById(id).select('-password -__v');
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    return res.json({ ok: true, user });
  } catch (err) {
    console.error('account.getMe error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

/**
 * Update current user profile.
 * Accepts JSON body with allowed fields. If auth middleware sets req.user.id it will be used.
 * Otherwise accept userId in body for dev purposes.
 */
exports.updateMe = async (req, res) => {
  try {
    const id = (req.user && req.user.id) || req.body.userId;
    if (!id) return res.status(400).json({ ok: false, error: 'Missing user id' });

    // whitelist of updatable fields
    const allowed = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'bio',
      'profilePhoto', // accept data URL or URL
      'notifications',
      'profileVisibility',
      'shareAnalytics',
      'shareThirdParty',
      'twoFactorEnabled',
      'connectedAccounts'
    ];

    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updates[key] = req.body[key];
    }

    // simple email uniqueness check
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: id } });
      if (existing) return res.status(400).json({ ok: false, error: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).select('-password -__v');
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    return res.json({ ok: true, user });
  } catch (err) {
    console.error('account.updateMe error', err);
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};