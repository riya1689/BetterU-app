// import axios from 'axios';

// // Create an axios instance with the base URL of your live backend
// const apiClient = axios.create({
//   baseURL: 'https://betteru-backend.onrender.com', // Your live backend URL
// });

// export default apiClient;
import axios from 'axios';

// Get the backend URL from an environment variable.
// This is the standard way to configure URLs in Expo web builds.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
});

console.log('API client configured for URL:', API_URL); // This helps with debugging

export default apiClient;
