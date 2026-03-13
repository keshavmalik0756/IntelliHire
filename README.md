# IntelliHire - AI Based Interview Assistance System

## Overview

IntelliHire is an innovative AI-powered interview assistance platform designed to help candidates prepare for job interviews through simulated interviews, real-time feedback, and comprehensive analytics. The system leverages advanced AI technologies including speech recognition, behavioral analysis, and natural language processing to provide personalized interview experiences.

## Features

- **AI-Powered Interview Simulation**: Conduct mock interviews with AI interviewers
- **Real-Time Feedback**: Get instant feedback on answers, behavior, and communication skills
- **Behavioral Analytics**: Track facial expressions, voice tone, and body language using MediaPipe
- **Voice Recording & Analysis**: Record and analyze speech patterns and clarity
- **Comprehensive Reports**: Detailed post-interview reports with scores and improvement suggestions
- **Dashboard & Analytics**: Track progress, view interview history, and analyze performance metrics
- **Achievement System**: Gamified learning experience with badges and milestones
- **Multi-Step Interview Process**: Structured interview flow with setup, interview, and reporting phases
- **Firebase Integration**: Secure authentication and data storage
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Admin SDK** - Backend services
- **Multer** - File upload handling

### AI & Analytics
- **Google Gemini AI** - AI-powered interview analysis
- **MediaPipe** - Computer vision for behavioral analysis
- **Web Speech API** - Speech recognition and synthesis

### Database & Storage
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Authentication** - User authentication

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/intellihire.git
cd intellihire
```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Place your `serviceAccountKey.json` in the `server/firebase/` directory
   - Update `server/firebase/admin.js` with your Firebase configuration

4. Configure environment variables:
   - Create a `.env` file in the server directory
   - Add necessary environment variables (API keys, database URLs, etc.)

5. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` by default. For production, the API is deployed at `https://intellihire-xezg.onrender.com`.

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `client/src/firebase/firebaseConfig.js` with your Firebase configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

   The client will run on `http://localhost:5173` by default. Ensure `VITE_API_URL` in `client/.env` points to the deployed backend for production use.

## Usage

1. **Frontend Status**: [Deployed on Vercel](https://intellihire-silk.vercel.app/)
2. Sign up or log in using Firebase Authentication
3. Complete your profile setup
4. Start a new interview from the dashboard
5. Follow the interview steps: Setup → Interview → Report
6. Review your performance and get AI-powered feedback

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Interview Routes
- `POST /api/interviews/start` - Start a new interview
- `POST /api/interviews/submit` - Submit interview answers
- `GET /api/interviews/:id` - Get interview details
- `GET /api/interviews/history` - Get user's interview history

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Payment Routes
- `POST /api/payments/create-session` - Create payment session
- `POST /api/payments/webhook` - Handle payment webhooks

## Project Structure

```
intellihire/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── package.json
└── README.md
```

## Contributing

We welcome contributions to IntelliHire! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

Please ensure your code follows our coding standards and includes appropriate tests.

## Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## Deployment

### Backend Deployment
- Deploy to services like Heroku, AWS, or DigitalOcean
- Ensure environment variables are set
- Configure Firebase Admin SDK for production

### Frontend Deployment
- Build the production bundle: `npm run build`
- Deploy to services like Vercel, Netlify, or AWS S3
- Configure Firebase for production environment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:
- Email: support@intellihire.com
- GitHub Issues: [Create an issue](https://github.com/your-username/intellihire/issues)

## Acknowledgments

- Google MediaPipe for computer vision capabilities
- Google Gemini AI for natural language processing
- Firebase for backend services
- React and Vite communities for excellent documentation and support