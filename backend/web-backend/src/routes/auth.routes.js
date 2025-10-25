const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const { validateLogin, validateRegister } = require('../validators/auth.validator');

const router = express.Router();

// Login route
router.post('/login', validateLogin, login);

// Registration route
router.post('/register', validateRegister, register);

module.exports = router;