import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    resetEmail: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: ''
  });
  const [validating, setValidating] = useState({
    name: false,
    email: false
  });

  const navigate = useNavigate();
  const { signup, login, resetPassword } = useAuth();

  // Function to check username availability with debounce
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;
    
    setValidating(prev => ({ ...prev, name: true }));
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();
      
      if (data) {
        setValidationErrors(prev => ({ 
          ...prev, 
          name: 'Username already taken' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, name: '' }));
      }
    } catch (error) {
      // No user found, which is good
      setValidationErrors(prev => ({ ...prev, name: '' }));
    } finally {
      setValidating(prev => ({ ...prev, name: false }));
    }
  };

  // Function to check email availability with debounce
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setValidating(prev => ({ ...prev, email: true }));
    
    try {
      // This is an approximation as we can't directly query auth.users
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (data) {
        setValidationErrors(prev => ({ 
          ...prev, 
          email: 'Email already used' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      // No user found, which is good
      setValidationErrors(prev => ({ ...prev, email: '' }));
    } finally {
      setValidating(prev => ({ ...prev, email: false }));
    }
  };

  // Debounce validation checks
  useEffect(() => {
    if (!isLogin && formData.name) {
      const timer = setTimeout(() => {
        checkUsernameAvailability(formData.name);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.name, isLogin]);

  useEffect(() => {
    if (!isLogin && formData.email) {
      const timer = setTimeout(() => {
        checkEmailAvailability(formData.email);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.email, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for validation errors before proceeding
    if (!isLogin && (validationErrors.name || validationErrors.email)) {
      toast.error('Please fix the validation errors before continuing');
      return;
    }
    
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(formData.resetEmail);
        toast.success('Password reset link sent to your email');
        setIsForgotPassword(false);
        setIsLogin(true);
        setFormData({
          ...formData,
          resetEmail: ''
        });
        setLoading(false);
        return;
      }
      
      if (isLogin) {
        const isEmail = formData.emailOrUsername.includes('@');
        await login({
          email: isEmail ? formData.emailOrUsername : undefined,
          username: !isEmail ? formData.emailOrUsername : undefined,
          password: formData.password
        });
        toast.success('Welcome back!');
      } else {
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        
        // Validate password strength
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        
        try {
          await signup({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                username: formData.name
              }
            }
          });
          toast.success('Account created! Please check your email for confirmation link.');
          setIsLogin(true);
          setFormData({
            emailOrUsername: formData.email,
            password: '',
            confirmPassword: '',
            name: '',
            email: ''
          });
        } catch (error) {
          if (error.message.includes('already')) {
            toast.error('Email already used or username already taken.');
          } else {
            throw error;
          }
        }
        setLoading(false);
        return;
      }
      navigate('/meditation');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email address. Check your inbox for the confirmation link.');
      } else {
        toast.error(error.message);
      }
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetFormState = () => {
    setFormData({
      emailOrUsername: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
      resetEmail: ''
    });
    setValidationErrors({
      name: '',
      email: ''
    });
  };

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
              {isForgotPassword 
                ? 'Reset Password'
                : isLogin 
                  ? 'Welcome Back' 
                  : 'Start Your Journey'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isForgotPassword
                ? 'Enter your email to receive a reset link'
                : isLogin
                  ? 'Enter your email/username and password to continue'
                  : 'Create your account to begin'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isForgotPassword ? (
              <div>
                <input
                  type="email"
                  name="resetEmail"
                  placeholder="Email Address"
                  value={formData.resetEmail}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>
            ) : (
              <>
                {!isLogin && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Username"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-3 bg-dark-200 border rounded-full text-white placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300
                                 ${validationErrors.name ? 'border-red-500' : 'border-primary/10'}`}
                        required
                      />
                      {validating.name && (
                        <div className="mt-2 text-sm flex items-center text-yellow-500">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking availability...
                        </div>
                      )}
                      {!validating.name && validationErrors.name && (
                        <p className="mt-2 text-sm text-red-500">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-3 bg-dark-200 border rounded-full text-white placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300
                                 ${validationErrors.email ? 'border-red-500' : 'border-primary/10'}`}
                        required
                      />
                      {validating.email && (
                        <div className="mt-2 text-sm flex items-center text-yellow-500">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking availability...
                        </div>
                      )}
                      {!validating.email && validationErrors.email && (
                        <p className="mt-2 text-sm text-red-500">{validationErrors.email}</p>
                      )}
                    </div>
                  </>
                )}
                
                {isLogin && (
                  <div>
                    <input
                      type="text"
                      name="emailOrUsername"
                      placeholder="Email or Username"
                      value={formData.emailOrUsername}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>

                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 bg-dark-200 border border-primary/10 rounded-full text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                  </div>
                )}
              </>
            )}

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
                isForgotPassword 
                  ? 'Send Reset Link' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Create Account'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            {isLogin && !isForgotPassword && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsForgotPassword(true);
                    resetFormState();
                  }}
                  className="text-primary hover:text-accent transition-colors text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            {isForgotPassword ? (
              <p className="text-gray-400">
                Remember your password?
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    resetFormState();
                  }}
                  className="ml-2 text-primary hover:text-accent transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    resetFormState();
                  }}
                  className="ml-2 text-primary hover:text-accent transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}
          </div>

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

export default Auth; 