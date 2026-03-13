# IntelliHire Server

## Overview

The IntelliHire Server is the backend API for the AI-based interview assistance system. Built with Node.js and Express.js, it provides RESTful endpoints for user authentication, interview management, payment processing, and AI-powered analysis. The server integrates with Firebase for authentication and data storage, and leverages Google Gemini AI for intelligent interview feedback.

## Features

- **RESTful API**: Comprehensive API endpoints for all application functionality
- **User Authentication**: Secure authentication using Firebase Auth
- **Interview Management**: Create, manage, and analyze interview sessions
- **AI Integration**: Google Gemini AI for intelligent feedback and analysis
- **File Upload**: Handle document, image, and media uploads with Multer
- **Payment Processing**: Razorpay integration for subscription management
- **Achievement System**: Track and manage user achievements and milestones
- **Error Handling**: Comprehensive error middleware and logging
- **Security**: Authentication middleware and input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework for API development
- **Firebase Admin SDK** - Backend Firebase services
- **Google Gemini AI** - AI-powered analysis and feedback
- **Multer** - File upload handling
- **JWT** - JSON Web Token for authentication
- **bcrypt** - Password hashing
- **Razorpay** - Payment processing
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Firebase Project** with Admin SDK configured
- **Google Gemini API** key
- **Razorpay Account** (for payment features)

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Download your Firebase Admin SDK service account key
   - Save it as `firebase/serviceAccountKey.json`
   - Update `firebase/admin.js` with your Firebase configuration

4. Configure environment variables:
   - Create a `.env` file in the server directory
   - Add the required environment variables (see Environment Variables section)

5. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000` by default.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Database (if using external DB)
DATABASE_URL=your_database_url

# Other
CORS_ORIGIN=http://localhost:5173
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
server/
├── config/                # Database and application configuration
│   └── db.js             # Database connection setup
├── controllers/          # Route controllers
│   ├── authController.js    # Authentication logic
│   ├── interviewController.js # Interview management
│   ├── paymentController.js  # Payment processing
│   └── userController.js     # User management
├── firebase/             # Firebase configuration
│   ├── admin.js         # Firebase Admin SDK setup
│   └── serviceAccountKey.json # Firebase service account key
├── middleware/           # Express middleware
│   ├── authMiddleware.js    # Authentication middleware
│   ├── errorMiddleware.js   # Error handling middleware
│   └── multer.js            # File upload configuration
├── models/               # Data models
│   ├── interview.js      # Interview data model
│   └── User.js           # User data model
├── routes/               # API route definitions
│   ├── authRoutes.js     # Authentication routes
│   ├── interviewRoutes.js # Interview routes
│   ├── paymentRoutes.js  # Payment routes
│   └── userRoutes.js     # User routes
├── services/             # Business logic services
│   ├── achievement.service.js # Achievement system logic
│   └── gemini.service.js      # Gemini AI integration
├── uploads/              # File upload directories
│   ├── documents/        # Document uploads
│   ├── images/           # Image uploads
│   └── media/            # Media file uploads
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account

### Interview Routes (`/api/interviews`)
- `POST /start` - Start a new interview session
- `POST /submit` - Submit interview answers
- `GET /:id` - Get interview details by ID
- `GET /history` - Get user's interview history
- `PUT /:id/feedback` - Update interview feedback
- `DELETE /:id` - Delete an interview

### Payment Routes (`/api/payments`)
- `POST /create-order` - Create Razorpay order
- `POST /webhook` - Handle Razorpay webhooks
- `GET /subscription` - Get user subscription status

## Key Services

### Achievement Service
Handles user achievements, badges, and milestones:
- Track interview completion
- Award badges for performance milestones
- Calculate user progress and streaks

### Gemini AI Service
Integrates with Google Gemini AI for:
- Interview question generation
- Answer analysis and feedback
- Behavioral assessment
- Performance scoring

## Database Schema

### User Model
```javascript
{
  uid: String,           // Firebase UID
  email: String,
  displayName: String,
  photoURL: String,
  createdAt: Date,
  subscription: {
    plan: String,
    status: String,
    expiresAt: Date
  },
  achievements: [String], // Array of achievement IDs
  interviewStats: {
    totalInterviews: Number,
    averageScore: Number,
    bestScore: Number
  }
}
```

### Interview Model
```javascript
{
  userId: String,
  questions: [{
    question: String,
    answer: String,
    audioUrl: String,
    score: Number,
    feedback: String
  }],
  overallScore: Number,
  feedback: String,
  behavioralMetrics: Object,
  createdAt: Date,
  completedAt: Date,
  status: String // 'in-progress', 'completed', 'cancelled'
}
```

## Error Handling

The server includes comprehensive error handling:
- **Validation Errors**: Input validation with detailed messages
- **Authentication Errors**: JWT and Firebase auth errors
- **Database Errors**: Connection and query errors
- **External API Errors**: Gemini AI and Razorpay API errors
- **File Upload Errors**: Multer upload validation

## Security

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Route-level middleware protection
- **Input Validation**: Request body and parameter validation
- **CORS**: Configured for allowed origins
- **Rate Limiting**: Basic rate limiting on sensitive endpoints
- **File Upload Security**: File type and size restrictions

## Testing

Run tests with:
```bash
npm test
```

Tests include:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Authentication middleware tests

## Deployment

### Environment Setup
1. Set up production environment variables
2. Configure Firebase for production
3. Set up Razorpay webhooks for production
4. Configure file storage (AWS S3, Google Cloud Storage, etc.)

### Deployment Options
- **Heroku**: Easy deployment with git push
- **AWS**: EC2 or Elastic Beanstalk
- **Google Cloud**: App Engine or Cloud Run
- **Docker**: Containerized deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Firebase service account key secured
- [ ] Database connections optimized
- [ ] Logging configured
- [ ] SSL certificates installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled

## Monitoring

The server includes basic monitoring:
- Request logging with Morgan
- Error tracking and reporting
- Performance metrics
- Health check endpoints

## Contributing

Please refer to the main project [README.md](../README.md) for contribution guidelines.

## Related

- [IntelliHire Client](../client/README.md) - Frontend application documentation
- [Main Project README](../README.md) - Overall project documentation</content>
<parameter name="filePath">c:\Users\keshav\OneDrive\Desktop\IntilliHire - AI Based Interview Assistance System\server\README.md