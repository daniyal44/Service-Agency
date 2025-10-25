const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('MongoDB URI is required');
  if (mongoose.connection.readyState === 1) {
    console.log('Mongoose already connected');
    return;
  }
  try {
    await mongoose.connect(uri, {
      // options are harmless with mongoose 7+
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = connectDB;