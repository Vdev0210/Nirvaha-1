import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import DivineChat from './pages/DivineChat'
import Meditation from './pages/Meditation'
import SoundHealing from './pages/SoundHealing'
import Profile from './pages/Profile'
import Auth from './components/Auth'
import ResetPassword from './pages/ResetPassword'

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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App