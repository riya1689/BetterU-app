import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient'; // Ensure this path is correct
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load user token from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password, navigation) => {
    setIsLoading(true);
    try {
      // --- FIX: Removed the extra '/api' prefix ---
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);
      await AsyncStorage.setItem('userToken', userToken);

      navigation.navigate('Success', { message: 'Login Successful!', nextScreen: 'MainTabs' });

    } catch (error) {
      console.error('Login Error:', JSON.stringify(error.response || error, null, 2));
      
      let errorMessage = 'Login Failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName, email, password, navigation) => {
    setIsLoading(true);
    try {
      // --- FIX: Changed parameter to 'fullName' and sending it as 'name' to the API ---
      await apiClient.post('/auth/register', { name: fullName, email, password });

      navigation.navigate('Success', { message: 'Signup Successful!', nextScreen: 'Login' });

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
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
    
    navigation.navigate('Login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
