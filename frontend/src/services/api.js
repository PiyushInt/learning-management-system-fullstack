import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Redirect to login
        window.location.href = '/login';
      }
      
      const apiError = error.response.data?.error?.message 
        || error.response.data?.message 
        || 'An unexpected error occurred';
      error.message = apiError;
    } else {
      error.message = 'Network error or server unreachable';
    }
    return Promise.reject(error);
  }
);

export default api;
