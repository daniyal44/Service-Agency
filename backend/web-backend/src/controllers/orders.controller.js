const Order = require('../models/Order');
const orderService = require('../services/order.service');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).json({
            success: true,
            data: newOrder,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedData = req.body;
        const updatedOrder = await orderService.updateOrder(orderId, updatedData);
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedOrder,
            message: 'Order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await orderService.deleteOrder(orderId);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};