const express = require('express');
const Service = require('../models/Service.js');
const User = require('../models/User.js');

const router = express.Router();

// Simple auth/protect for dev: accepts a header Authorization: Bearer dev-token
function protect(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    if (auth === 'Bearer dev-token') return next();
    return res.status(401).json({ error: 'Not authorized' });
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized' });
  }
}

// List & search
// Query params: q, category, minPrice, maxPrice, minRating, sort
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minRating, sort, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') } ];
    if (category && category !== 'all') filter.category = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    let cursor = Service.find(filter).skip(Number(offset)).limit(Number(limit));
    if (sort === 'price-asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price-desc') cursor = cursor.sort({ price: -1 });
    else if (sort === 'rating') cursor = cursor.sort({ rating: -1 });
    else cursor = cursor.sort({ createdAt: -1 });

    const [items, total] = await Promise.all([cursor.exec(), Service.countDocuments(filter)]);
    return res.json({ ok: true, total, items });
  } catch (err) {
    console.error('Error listing services', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true, item });
  } catch (err) {
    console.error('Error getting service', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, price, currency = 'USD', category = 'general', img } = req.body;
    if (!title || price == null) return res.status(400).json({ error: 'Title and price are required' });
    const item = new Service({ title, description, price: Number(price), currency, category, img });
    await item.save();
    return res.status(201).json({ ok: true, item });
  } catch (err) {
    console.error('Error creating service', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const updates = req.body;
    const item = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true, item });
  } catch (err) {
    console.error('Error updating service', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting service', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed endpoint (protected) - populates the DB with sample items
router.post('/seed', protect, async (req, res) => {
  try {
    const sample = req.body.items || [
      { title: 'Logo Design', description: 'Professional logo design', price: 30, category: 'design', img: 'https://source.unsplash.com/featured/?logo,design', rating: 4.8, reviews: 88 },
      { title: 'Website Design', description: 'Responsive website', price: 400, category: 'digital', img: 'https://source.unsplash.com/featured/?website,design', rating: 4.9, reviews: 14 },
      { title: 'SEO Optimization', description: 'Improve search ranking', price: 120, category: 'marketing', img: 'https://source.unsplash.com/featured/?seo,optimization', rating: 4.5, reviews: 18 }
    ];

    await Service.deleteMany({});
    const inserted = await Service.insertMany(sample);
    return res.json({ ok: true, insertedCount: inserted.length, items: inserted });
  } catch (err) {
    console.error('Error seeding services', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Return distinct categories and a small curated categories list
router.get('/categories/list', async (_req, res) => {
  try {
    const categories = await Service.distinct('category');
    // Basic curated labels
    const curated = categories.map((c) => ({ id: c, name: c.charAt(0).toUpperCase() + c.slice(1) }));
    return res.json({ ok: true, categories: curated });
  } catch (err) {
    console.error('Error getting categories', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
