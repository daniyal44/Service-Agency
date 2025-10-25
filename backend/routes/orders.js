const express = require('express');
const Order = require('../models/Order.js');

const router = express.Router();

// Create an order (frontend checkout calls this)
router.post('/', async (req, res) => {
  try {
    const { userId, guestToken, lineItems = [], currency = 'USD', metadata = {} } = req.body;
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: 'lineItems are required' });
    }
    const total = lineItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
    const order = new Order({ userId: userId || null, guestToken, lineItems, total, currency, metadata, status: 'created' });
    await order.save();
    return res.status(201).json({ ok: true, orderId: order._id, status: order.status, redirectUrl: `/billing/${order._id}` });
  } catch (err) {
    console.error('Error creating order', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true, order });
  } catch (err) {
    console.error('Error fetching order', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel order
router.post('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    if (order.status === 'paid') return res.status(400).json({ error: 'Cannot cancel paid order' });
    order.status = 'cancelled';
    await order.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error cancelling order', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
