import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

// Lazy load page components
const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Home = lazy(() => import('./pages/Home'))
const InterviewPage = lazy(() => import('./pages/InterviewPage'))
const History = lazy(() => import('./pages/History'))
const Analytics = lazy(() => import('./pages/Analytics'))
const InterviewReport = lazy(() => import('./pages/InterviewReport'))
const Tips = lazy(() => import('./pages/Tips'))
const LandingPage = lazy(() => import('./components/LandingPage.jsx'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Pricing = lazy(() => import('./pages/Pricing'))

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading IntelliHire...</p>
    </div>
  </div>
)

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/login' element={<Auth />} />
            <Route path='/signup' element={<Auth />} />
            <Route path='/dashboard' element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/home' element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            } /> 
            <Route path='/interview' element={
              <PrivateRoute>
                <Layout>
                  <InterviewPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/history' element={
              <PrivateRoute>
                <Layout>
                  <History />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/analytics' element={
              <PrivateRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/interview/results/:sessionId' element={
              <PrivateRoute>
                <Layout>
                  <InterviewReport />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/tips' element={
              <PrivateRoute>
                <Layout>
                  <Tips />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/achievements' element={
              <PrivateRoute>
                <Layout>
                  <Achievements />
                </Layout>
              </PrivateRoute>
            } />
            <Route path='/pricing' element={
              <PrivateRoute>
                <Layout>
                  <Pricing />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App