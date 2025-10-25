require('dotenv').config();
const express = require('express');
const app = express();

// add near other middleware imports
const cors = require('cors');

const connectDB = require('./config/database.js');
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const PORT = Number(process.env.PORT) || 4000;

// enable CORS for local development (adjust origin in production)
app.use(cors({
  origin: true, // reflect request origin
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/admin', adminRoutes);

// Serve uploaded files (profile photos, etc.)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure a health endpoint exists
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myapp';
    console.log('Connecting to MongoDB at', mongoUri);
    await connectDB(mongoUri);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;