const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../config');

const verifyToken = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = await verifyToken(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;