# MDK Agency - Setup Guide

## Project Overview
This is a full-stack web application for MDK Agency, featuring user authentication, service listings, and a dashboard. The project consists of a React frontend and Node.js/Express backend.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your configuration:
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/mdk-agency

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (optional - uses Ethereal for development if not set)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Source
EMAIL_SOURCE=your-email@gmail.com

# Frontend URL for email verification links
FRONTEND_VERIFY_URL=http://localhost:5173/verify

# Verification token expiration (in minutes)
VERIFICATION_TOKEN_EXPIRES_MIN=15

# CORS Origin (optional - defaults to http://localhost:5173)
CORS_ORIGIN=http://localhost:5173

# Server Port (optional - defaults to 5000)
PORT=5000

# Environment
NODE_ENV=development
```

### 3. Start the Application

#### Option 1: Using the provided scripts
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

#### Option 2: Manual start
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Features

### Frontend
- **Home Page**: Welcome page with navigation
- **About Page**: Company information and team details
- **Services Page**: Service listings with descriptions
- **Contact Page**: Contact form and company information
- **Authentication**: Login/Signup with email verification
- **Dashboard**: User dashboard (requires authentication)

### Backend
- **User Authentication**: JWT-based authentication
- **Email Verification**: Code-based email verification
- **MongoDB Integration**: User and verification token storage
- **CORS Support**: Configured for frontend communication
- **Error Handling**: Comprehensive error handling and logging

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend` - Resend verification code

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  verified: Boolean (default: false)
}
```

### VerificationToken Model
```javascript
{
  userId: ObjectId (ref: User),
  code: String,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Project Structure
```
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── src/
│   ├── pages/           # React pages
│   ├── components/      # React components
│   └── App.jsx          # Main app component
└── public/              # Static assets
```

### Testing
```bash
# Test backend connectivity
node test-backend.js
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database permissions

2. **Email Not Sending**
   - Check SMTP configuration in .env
   - In development, check console for Ethereal preview URLs
   - Verify email credentials

3. **CORS Errors**
   - Ensure CORS_ORIGIN is set correctly
   - Check that frontend is running on the correct port

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure proper token storage in localStorage

### Environment Variables
All required environment variables are documented in `backend/env.example`. Copy this file to `backend/.env` and configure according to your setup.

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper SMTP settings
4. Use a strong JWT_SECRET
5. Set up proper CORS origins

### Frontend
1. Build the application: `npm run build`
2. Serve the built files from a web server
3. Update API URLs for production

## Security Notes
- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Implement rate limiting for production use
- Use HTTPS in production
- Validate all user inputs
- Implement proper error handling

## Support
For issues or questions, please check the troubleshooting section or create an issue in the project repository.
