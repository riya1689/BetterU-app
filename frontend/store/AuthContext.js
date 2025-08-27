import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          setRole(userData.role || 'user'); 
        }
      } catch (e) {
        console.error("Failed to load user data from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password, role = 'user', navigation) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;

      if (userData.role !== role) {
        throw new Error(`You are not registered as a(n) ${role}.`);
      }

      setUser(userData);
      setToken(userToken);
      setRole(userData.role);

      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      let nextScreen;
      if (userData.role === 'admin') {
        nextScreen = 'AdminPanel';
      } else if (userData.role === 'doctor') {
        nextScreen = 'ExpertPanel';
      } else {
        nextScreen = 'MainTabs';
      }

      navigation.navigate('Success', { message: 'Login Successful!', nextScreen: nextScreen });

    } catch (error) {
      console.error('Login Error:', JSON.stringify(error.response || error, null, 2));
      
      let errorMessage = error.message || 'Login Failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response && !error.message) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UPDATED: The signup function now navigates to the OTP screen ---
  const signup = async (fullName, email, password, role = 'user', navigation) => {
    setIsLoading(true);
    try {
      // This API call now returns the user's email on success
      const response = await apiClient.post('/auth/register', { name: fullName, email, password, role });
      
      // Navigate to the OTP screen, passing the email as a parameter
      navigation.navigate('OtpVerification', { email: response.data.user.email });

    } catch (error) {
      console.error('Signup Error:', JSON.stringify(error.response || error, null, 2));
      let errorMessage = 'Signup Failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (navigation) => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    setRole(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoading(false);
    
    navigation.navigate('Login');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
