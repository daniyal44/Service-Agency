const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// TTL index: documents expire 15 minutes after createdAt
verificationTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', verificationTokenSchema);
module.exports = VerificationToken;