import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Contact from './pages/Contact'
import DivineChat from './pages/DivineChat'
import Meditation from './pages/Meditation'
import SoundHealing from './pages/SoundHealing'
import Profile from './pages/Profile'
import Auth from './components/Auth'
import ResetPassword from './pages/ResetPassword'

import PersonalizedTherapy from './pages/PersonalizedTherapy'
import Media from './pages/Media'
import Blogs from './pages/Blogs'
import Videos from './pages/Videos'


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Public Route Component (redirects to meditation if logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/meditation" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/auth" 
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/reset-password" 
                element={<ResetPassword />} 
              />
              <Route 
                path="/divine-chat" 
                element={
                  <ProtectedRoute>
                    <DivineChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meditation" 
                element={
                  <ProtectedRoute>
                    <Meditation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sound-healing" 
                element={
                  <ProtectedRoute>
                    <SoundHealing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/personalized-therapy"
                element={
                  <ProtectedRoute>
                    <PersonalizedTherapy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/media"
                element={
                  <ProtectedRoute>
                    <Media />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
