const express = require('express');
const { generateCaptcha } = require('../middleware/captcha');

const router = express.Router();

router.get('/captcha', generateCaptcha);

module.exports = router;