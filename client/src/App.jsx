import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/PrivateRoute'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Layout from './components/Layout'
import InterviewPage from './pages/InterviewPage'
import History from './pages/History'
import Analytics from './pages/Analytics'
import InterviewReport from './pages/InterviewReport'
import Tips from './pages/Tips'
import LandingPage from './components/LandingPage.jsx'
import Achievements from './pages/Achievements'
import Pricing from './pages/Pricing'

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
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
      </BrowserRouter>
    </>
  )
}

export default App