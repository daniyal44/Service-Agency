const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXPIRES_IN = '8h';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      return res.status(500).json({ message: 'Admin credentials not configured on server.' });
    }

    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign({ role: 'admin', username }, ADMIN_JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    return res.json({ token, expiresIn: TOKEN_EXPIRES_IN });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Try Mongoose style
    if (typeof User.find === 'function') {
      const users = await User.find({}).select('-password -__v').lean();
      return res.json({ count: users.length, users });
    }

    // Try Sequelize style
    if (typeof User.findAll === 'function') {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      return res.json({ count: users.length, users });
    }

    return res.status(500).json({ message: 'User model does not support find/findAll' });
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};