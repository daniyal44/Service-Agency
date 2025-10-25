const nodemailer = require('nodemailer');

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return { transporter, isTest: false };
  }

  // Fallback to Ethereal (local dev)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return { transporter, isTest: true };
}

async function sendEmail({ to, subject, text, html, from }) {
  const fromAddr = from || process.env.EMAIL_SOURCE || '"No Reply" <no-reply@example.com>';
  try {
    const { transporter, isTest } = await createTransporter();
    const info = await transporter.sendMail({ from: fromAddr, to, subject, text, html });
    const previewUrl = isTest ? nodemailer.getTestMessageUrl(info) : null;
    console.log('Email sent:', info.messageId, previewUrl ? `preview: ${previewUrl}` : '');
    return { success: true, info, previewUrl };
  } catch (err) {
    console.error('sendEmail error:', err);
    return { success: false, error: err };
  }
}

module.exports = sendEmail;
