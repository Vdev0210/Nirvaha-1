import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async ({ email, password, options }) => {
    try {
      // First, check if the username already exists
      const username = options?.data?.username;
      if (username) {
        const { data: existingUser, error: usernameCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();
        
        if (existingUser) {
          throw new Error('Email already used or username already taken.');
        }
      }
      
      // Then attempt to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          throw new Error('Email already used or username already taken.');
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const login = async ({ email, username, password }) => {
    try {
      if (email) {
        // Login with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        return data;
      } else if (username) {
        // First, find the user's email by username
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', username)
          .single();

        if (profileError) {
          throw new Error('Username not found');
        }

        // Then login with the found email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: profiles.email,
          password
        });
        if (error) throw error;
        return data;
      }
      throw new Error('Either email or username is required');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Add resetPassword function
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) throw error;
  };

  // Add updatePassword function
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 