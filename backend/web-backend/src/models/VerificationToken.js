const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Token expires in 1 hour
  }
});

// Method to generate a new verification token
verificationTokenSchema.statics.generateToken = function(userId) {
  const token = require('crypto').randomBytes(32).toString('hex');
  return this.create({ userId, token });
};

// Method to find a token by its value
verificationTokenSchema.statics.findToken = function(token) {
  return this.findOne({ token });
};

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;