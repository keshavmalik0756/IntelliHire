# IntelliHire Client

## Overview

The IntelliHire Client is the frontend application for the AI-based interview assistance system. Built with React and Vite, it provides a modern, responsive user interface for conducting AI-powered mock interviews, receiving real-time feedback, and analyzing performance through comprehensive dashboards and reports.

This client application communicates with the IntelliHire backend API to deliver a seamless interview preparation experience.

## Features

- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS
- **Real-time Interview Simulation**: Interactive interview interface with AI-powered questions
- **Voice Recording**: Integrated voice recording capabilities for speech analysis
- **Behavioral Analytics**: Real-time facial expression and gesture analysis using MediaPipe
- **Dashboard & Analytics**: Comprehensive performance tracking and visualization
- **Authentication**: Secure user authentication via Firebase
- **Progress Tracking**: Achievement system with badges and milestones
- **Interview Reports**: Detailed post-interview analysis and feedback

## Tech Stack

- **React 18** - UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **PostCSS** - CSS processing and optimization
- **ESLint** - Code linting and formatting
- **Firebase** - Authentication and real-time database
- **MediaPipe** - Computer vision for behavioral analysis
- **Web Speech API** - Speech recognition and synthesis

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `src/firebase/firebaseConfig.js` with your Firebase project configuration
   - Ensure the configuration matches your Firebase project settings

4. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
client/
├── public/                 # Static assets (favicon, images, etc.)
├── src/
│   ├── assets/            # Imported assets (images, icons)
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (buttons, etc.)
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── interview/     # Interview interface components
│   │   ├── LandingPage/   # Landing page components
│   │   └── popups/        # Modal and popup components
│   ├── constants/         # Application constants and data
│   ├── context/           # React context providers
│   ├── firebase/          # Firebase configuration
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page-level components
│   ├── services/          # API service functions
│   ├── store/             # State management (Redux/Zustand)
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
└── package.json           # Dependencies and scripts
```

## Key Components

### Core Components
- **App.jsx** - Main application router and layout
- **Layout.jsx** - Main layout wrapper with navigation
- **PrivateRoute.jsx** - Route protection for authenticated users

### Interview Components
- **InterviewPage.jsx** - Main interview interface
- **QuestionCard.jsx** - Individual question display
- **AnswerSection.jsx** - Answer input and recording
- **VoiceRecorderButton.jsx** - Voice recording controls
- **Timer.jsx** - Interview timer component

### Dashboard Components
- **Dashboard.jsx** - Main dashboard page
- **InterviewStats.jsx** - Performance statistics
- **HistoryTable.jsx** - Interview history display
- **AchievementSystem.jsx** - Achievement tracking

### Analytics Components
- **AdvancedCharts.jsx** - Data visualization components
- **BehaviorMetrics.jsx** - Behavioral analysis display

## Environment Variables

Create a `.env.local` file in the client directory for local development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent naming conventions

### Component Structure
- Keep components small and focused
- Use custom hooks for shared logic
- Implement proper error boundaries
- Use React Context for global state when appropriate

### Performance
- Optimize images and assets
- Use React.memo for expensive components
- Implement lazy loading for routes
- Minimize bundle size

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The build artifacts will be stored in the `dist/` directory.

3. Deploy the `dist/` directory to your hosting service (Vercel, Netlify, etc.).

## Testing

Run the linter to check code quality:
```bash
npm run lint
```

## Contributing

Please refer to the main project [README.md](../README.md) for contribution guidelines.

## Related

- [IntelliHire Server](../server/README.md) - Backend API documentation
- [Main Project README](../README.md) - Overall project documentation
