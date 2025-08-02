import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your live backend URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://betteru-backend.onrender.com';

const apiClient = axios.create({
  baseURL: API_URL,
});

// This interceptor adds the auth token to every API request
apiClient.interceptors.request.use(
  async (config) => {
    // Get the token from storage
    const token = await AsyncStorage.getItem('userToken'); // Make sure 'userToken' is the key you use when saving the token at login
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log('API client configured with auth interceptor for URL:', API_URL);

export default apiClient;