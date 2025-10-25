const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.handler');
const rateLimiter = require('./middleware/rateLimiter');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;