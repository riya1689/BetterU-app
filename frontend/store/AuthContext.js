import React, { createContext, useState, useContext } from 'react';
import apiClient from '../services/apiClient';
// --- FIX: Import AsyncStorage ---
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (name, email, password, navigation) => {
    setIsLoading(true);
    try {
      // Signup logic remains the same...
      const response = await apiClient.post('/api/auth/register', { name, email, password });
      const { user: userData } = response.data;
      setUser(userData);
      navigation.navigate('Success', { message: 'Signup Successful!', nextScreen: 'Login' });
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
      const response = await apiClient.post('/api/auth/login', { email, password });
      
      // --- FIX: Destructure both the user AND the token from the response ---
      const { user: userData, token } = response.data;
      
      // --- FIX: Save the token to AsyncStorage ---
      await AsyncStorage.setItem('userToken', token);
      
      setUser(userData);

      navigation.navigate('Success', { message: 'Login Successful!', nextScreen: 'MainTabs' });
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login Failed: ' + (error.response?.data?.message || 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (navigation) => { // --- FIX: Make logout async ---
    setIsLoading(true);
    // --- FIX: Remove the token from storage on logout ---
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    setIsLoading(false);
    
    navigation.navigate('Login'); // Navigate directly to Login after logout
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