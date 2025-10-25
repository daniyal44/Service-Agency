const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    marketing: {
      type: Boolean,
      default: true
    },
    security: {
      type: Boolean,
      default: true
    }
  },
  profileVisibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  shareAnalytics: {
    type: Boolean,
    default: true
  },
  shareThirdParty: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  connectedAccounts: [{
    type: String
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;