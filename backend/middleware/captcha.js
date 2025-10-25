const svgCaptcha = require('svg-captcha');

const generateCaptcha = (req, res, next) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#f0f0f0',
  });
  
  req.session.captcha = captcha.text.toLowerCase();
  res.type('svg');
  res.status(200).send(captcha.data);
};

const verifyCaptcha = (req, res, next) => {
  const { captcha } = req.body;
  
  if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
    return res.status(400).json({
      success: false,
      message: 'Invalid captcha',
    });
  }
  
  delete req.session.captcha;
  next();
};

module.exports = { generateCaptcha, verifyCaptcha };