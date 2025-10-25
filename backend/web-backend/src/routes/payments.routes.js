const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');

// Route to process a payment
router.post('/process', paymentsController.processPayment);

// Route to retrieve payment history
router.get('/history', paymentsController.getPaymentHistory);

// Route to refund a payment
router.post('/refund', paymentsController.refundPayment);

module.exports = router;