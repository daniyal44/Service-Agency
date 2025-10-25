const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', adminCtrl.login);
router.get('/users', adminAuth, adminCtrl.getAllUsers);

module.exports = router;