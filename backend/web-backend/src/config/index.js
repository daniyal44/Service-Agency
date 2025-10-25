const dotenv = require('dotenv');

dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

module.exports = config;