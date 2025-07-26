import React, { createContext, useState, useContext } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // The login, signup, and logout functions now accept a 'navigation' object
  // so they can control the app's screens.

  const signup = async (name, email, password, navigation) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/auth/register', {
        name,
        email,
        password,
      });
      const { user: userData } = response.data;
      setUser(userData);

      // --- NEW NAVIGATION LOGIC ---
      // On success, navigate to the Success screen with a message
      navigation.navigate('Success', {
        message: 'Signup Successful!',
        nextScreen: 'MainTabs', // The screen to go to after the success message
      });

    } catch (error) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      alert('Signup Failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, navigation) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      const { user: userData } = response.data;
      setUser(userData);

      // --- NEW NAVIGATION LOGIC ---
      navigation.navigate('Success', {
        message: 'Login Successful!',
        nextScreen: 'MainTabs',
      });

    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login Failed: ' + (error.response?.data?.message || 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (navigation) => {
    setUser(null);
    
    // --- NEW NAVIGATION LOGIC ---
    navigation.navigate('Success', {
      message: 'Logout Successful!',
      nextScreen: 'MainTabs',
    });
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
