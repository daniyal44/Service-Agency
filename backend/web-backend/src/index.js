const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = require('./app');

const PORT = config.PORT || 5000;

// Connect to the database
mongoose.connect(config.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected successfully');
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('Database connection error:', err);
});