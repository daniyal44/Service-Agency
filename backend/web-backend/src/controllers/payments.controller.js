const PaymentService = require('../services/payment.service');
const sendResponse = require('../utils/sendResponse');

// Process a payment
const processPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        const paymentResult = await PaymentService.processPayment(paymentData);
        sendResponse(res, 200, paymentResult);
    } catch (error) {
        sendResponse(res, 500, { message: 'Payment processing failed', error: error.message });
    }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const paymentDetails = await PaymentService.getPaymentDetails(paymentId);
        if (!paymentDetails) {
            return sendResponse(res, 404, { message: 'Payment not found' });
        }
        sendResponse(res, 200, paymentDetails);
    } catch (error) {
        sendResponse(res, 500, { message: 'Failed to retrieve payment details', error: error.message });
    }
};

// Export the controller functions
module.exports = {
    processPayment,
    getPaymentDetails,
};