const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'USD' },
  category: { type: String, default: 'general' },
  img: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
module.exports = Service;
