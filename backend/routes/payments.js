const express = require('express');
const Order = require('../models/Order.js');
const Stripe = require('stripe');

const router = express.Router();

const STRIPE_SECRET = process.env.STRIPE_SECRET || '';
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' }) : null;

// Methods
router.get('/methods', async (_req, res) => {
  try {
    const methods = [
      { id: 'card', label: 'Credit/Debit Card', provider: STRIPE_SECRET ? 'stripe' : 'dev', supported: ['visa','mastercard','amex'], fees: 0.029 },
      { id: 'bank', label: 'Bank Transfer', provider: 'bank', supported: [], fees: 0 },
      { id: 'crypto', label: 'Cryptocurrency', provider: 'crypto', networks: ['ETH','BTC'], fees: 0 }
    ];
    return res.json({ ok: true, methods });
  } catch (err) {
    console.error('Error fetching payment methods', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment session (idempotent by orderId)
router.post('/sessions', async (req, res) => {
  try {
    const { orderId, methodId, returnUrl } = req.body;
    if (!orderId || !methodId) return res.status(400).json({ error: 'orderId and methodId required' });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'paid') return res.status(400).json({ error: 'Order already paid' });

    // Reserve TTL (30 minutes)
    const ttlMinutes = 30;
    order.reservedUntil = new Date(Date.now() + ttlMinutes * 60 * 1000);
    order.payment = order.payment || {};
    order.payment.method = { id: methodId, provider: STRIPE_SECRET ? 'stripe' : 'dev', label: methodId };

    // If Stripe available, create PaymentIntent
    if (methodId === 'card' && stripe) {
      const amount = Math.round((order.total || 0) * 100); // cents
      // idempotency by orderId
      const intent = await stripe.paymentIntents.create({
        amount,
        currency: (order.currency || 'USD').toLowerCase(),
        metadata: { orderId: String(order._id) },
        description: `Payment for order ${order._id}`
      }, { idempotencyKey: `pi_${order._id}` });

      order.payment.payment_session_id = intent.id;
      await order.save();

      return res.json({ ok: true, provider: 'stripe', paymentSessionId: intent.id, clientSecret: intent.client_secret, expiresAt: null });
    }

    // Dev fallback: create a fake session
    const fakeSessionId = `dev_sess_${order._id}_${Date.now()}`;
    order.payment.payment_session_id = fakeSessionId;
    await order.save();
    return res.json({ ok: true, provider: 'dev', paymentSessionId: fakeSessionId, paymentUrl: null });
  } catch (err) {
    console.error('Error creating payment session', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm payment (frontend calls this after provider success for dev flow or to double-check)
router.post('/confirm', async (req, res) => {
  try {
    const { orderId, paymentSessionId } = req.body;
    if (!orderId || !paymentSessionId) return res.status(400).json({ error: 'orderId and paymentSessionId required' });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // If Stripe, verify intent status
    if (stripe && order.payment?.payment_session_id) {
      try {
        const intent = await stripe.paymentIntents.retrieve(order.payment.payment_session_id);
        if (intent && intent.status === 'succeeded') {
          order.status = 'paid';
          order.payment.verified = true;
          order.payment.paidAt = new Date();
          order.payment.attempts.push({ attemptId: intent.id, provider: 'stripe', providerResponse: intent, status: intent.status });
          await order.save();
          return res.json({ ok: true, paid: true });
        }
        return res.json({ ok: true, paid: false, status: intent.status });
      } catch (err) {
        console.error('Error verifying stripe intent', err);
        return res.status(500).json({ error: 'Failed to verify payment' });
      }
    }

    // Dev fallback: mark paid directly
    if (order.payment?.payment_session_id === paymentSessionId) {
      order.status = 'paid';
      order.payment.verified = true;
      order.payment.paidAt = new Date();
      order.payment.attempts.push({ attemptId: paymentSessionId, provider: 'dev', providerResponse: { ok: true }, status: 'succeeded' });
      await order.save();
      return res.json({ ok: true, paid: true });
    }

    return res.status(400).json({ error: 'Payment not confirmed' });
  } catch (err) {
    console.error('Error confirming payment', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook endpoint (Stripe recommended raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) {
      // dev: accept a simple JSON payload
      const body = req.body.toString ? JSON.parse(req.body.toString()) : req.body;
      const { event, paymentSessionId } = body;
      if (event === 'payment_succeeded') {
        const order = await Order.findOne({ 'payment.payment_session_id': paymentSessionId });
        if (order) {
          order.status = 'paid';
          order.payment.verified = true;
          order.payment.paidAt = new Date();
          order.payment.attempts.push({ attemptId: paymentSessionId, provider: 'dev', providerResponse: body, status: 'succeeded' });
          await order.save();
        }
      }
      return res.json({ received: true });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'paid';
        order.payment.verified = true;
        order.payment.paidAt = new Date();
        order.payment.attempts.push({ attemptId: intent.id, provider: 'stripe', providerResponse: intent, status: intent.status });
        await order.save();
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
