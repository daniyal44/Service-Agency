const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const ordersRoutes = require('./orders.routes');
const paymentsRoutes = require('./payments.routes');

// Integrate all route modules
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);

module.exports = router;