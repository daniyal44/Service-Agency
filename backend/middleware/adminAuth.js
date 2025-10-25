const jwt = require('jsonwebtoken');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'change_this_secret';

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};