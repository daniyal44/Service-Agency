const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  sku: String,
  title: String,
  price: Number,
  qty: { type: Number, default: 1 }
}, { _id: false });

const paymentAttemptSchema = new mongoose.Schema({
  attemptId: String,
  provider: String,
  providerResponse: Object,
  status: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestToken: { type: String },
  lineItems: { type: [lineItemSchema], default: [] },
  total: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['created','awaiting_payment','paid','failed','cancelled','expired'], default: 'created' },
  payment: {
    method: { id: String, provider: String, label: String },
    payment_session_id: String,
    attempts: { type: [paymentAttemptSchema], default: [] },
    verified: { type: Boolean, default: false },
    paidAt: Date
  },
  reservedUntil: Date,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;
