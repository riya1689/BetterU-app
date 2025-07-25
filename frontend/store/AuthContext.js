import React, { createContext, useState, useContext } from 'react';
import apiClient from '../services/apiClient'; // Import our API client

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially

  // --- REAL API FUNCTIONS ---
  
  const signup = async (name, email, password) => {
    setIsLoading(true);
    try {
      // Make a POST request to our backend's /register endpoint
      const response = await apiClient.post('/api/auth/register', {
        name,
        email,
        password,
      });
      // The backend sends back a token and user info
      const { token, user: userData } = response.data;
      
      // Store the token securely (we'll add this later)
      console.log('Received token:', token);

      // Set the user in our app's state
      setUser(userData);

    } catch (error) {
      // Handle errors (e.g., user already exists)
      console.error('Signup failed:', error.response?.data?.message || error.message);
      alert('Signup Failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Make a POST request to our backend's /login endpoint
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      console.log('Received token:', token);
      setUser(userData);

    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login Failed: ' + (error.response?.data?.message || 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // We would also clear the stored token here
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
