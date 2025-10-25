const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

// Create a new order
router.post('/', ordersController.createOrder);

// Get all orders
router.get('/', ordersController.getAllOrders);

// Get a specific order by ID
router.get('/:id', ordersController.getOrderById);

// Update an order by ID
router.put('/:id', ordersController.updateOrder);

// Delete an order by ID
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;