import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('coconut_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear stale session and redirect to login
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      const msg  = error.response?.data?.message || '';

      // Clear stale token
      localStorage.removeItem('coconut_token');
      localStorage.removeItem('coconut_user');
      localStorage.removeItem('coconut_cart');

      // If not already on login page, redirect
      if (!window.location.pathname.includes('/login')) {
        const reason = code === 'USER_NOT_FOUND'
          ? 'Your session has expired. Please login again.'
          : 'Please login to continue.';
        window.location.href = `/login?msg=${encodeURIComponent(reason)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default API;
