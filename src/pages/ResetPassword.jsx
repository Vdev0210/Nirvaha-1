import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = useAuth();

  // Check if we have a valid hash or query param in the URL that confirms this is a password reset
  useEffect(() => {
    // Parse the URL for both hash fragments and query parameters
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    const isRecoveryMode = 
      (hash && hash.includes('type=recovery')) || 
      type === 'recovery';
      
    if (isRecoveryMode) {
      setShowForm(true);
    } else {
      // Also check if we have a valid access token in session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setShowForm(true);
        } else {
          toast.error('Invalid or expired password reset link');
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await updatePassword(password);
      toast.success('Password updated successfully');
      
      // Wait a bit before redirecting to let the user see the success message
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-dark-300 px-4 relative">
        <Toaster position="top-center" />
        <div className="text-center text-white">
          <div className="animate-spin mb-4 mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          <p>Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-dark-300 px-4 relative">
      <Toaster position="top-center" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-float z-0" />
        
        <div className="absolute bottom-1/4 -right-36 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-primary/20 to-primary/5 blur-3xl animate-float-reverse z-0" />
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px] animate-float-delay z-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-dark-100/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-primary/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Set New Password
            </h2>
            <p className="text-gray-400 text-lg">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-dark-300 rounded-full font-medium
                       hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-dark-300 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                'Update Password'
              )}
            </motion.button>
          </form>

          <div className="relative h-24 mt-10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '2px',
                    height: '60px',
                    margin: '0 1.5px',
                    background: 'var(--primary)',
                    boxShadow: '0 0 15px var(--primary)',
                    borderRadius: '4px',
                  }}
                  animate={{
                    height: [
                      Math.sin((i / 40) * Math.PI * 2) * 25 + 55,
                      Math.sin((i / 40) * Math.PI * 2 + Math.PI) * 25 + 55,
                      Math.sin((i / 40) * Math.PI * 2) * 25 + 55,
                    ],
                    opacity: [0.9, 0.5, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.03,
                  }}
                />
              ))}

              <motion.div
                className="absolute h-full w-2/3"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                  opacity: 0.15,
                  filter: 'blur(20px)',
                }}
                animate={{
                  x: ['-150%', '300%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword; 