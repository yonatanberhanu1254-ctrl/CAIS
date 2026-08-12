import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Centralized Axios instance.
 * Automatically handles JWT injection, baseURL mapping, and 401/403 forced logouts.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1', // Proxied via Vite in dev, mapped directly in Prod
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token securely
api.interceptors.request.use(
  (config) => {
    // Note: In an extreme security environment, cookies are preferred.
    // However, adhering strictly to the prompt "Never store JWT in localStorage if backend supports secure cookies. Otherwise: Store securely."
    // Assuming backend returns token in JSON body based on Swagger, we use sessionStorage/localStorage.
    const token = localStorage.getItem('cais_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach active language
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    const cleanLang = ['en', 'am', 'om'].includes(currentLang.substring(0, 2)) ? currentLang.substring(0, 2) : 'en';
    config.params = { ...config.params, lang: cleanLang };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Mapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || 'A network error occurred. Please try again.';

    // Handle Network Errors (Backend down, CORS, etc.)
    if (!error.response) {
      toast.error('Database is currently unavailable. Please try again later.');
      return Promise.reject(error);
    }

    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('cais_token');
      localStorage.removeItem('cais_user');
      // Force redirect to login bypassing React Router cleanly if deeply nested
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('Forbidden: You do not have permission to perform this action.');
    } else if (status === 429) {
      toast.error('Rate limit exceeded. Please wait a moment.');
    } else if (status >= 500) {
      // Only show toast for mutation requests (POST, PUT, PATCH, DELETE).
      // GET requests are handled by TanStack Query's isError/error states in the UI.
      const method = error.config?.method?.toUpperCase();
      if (method && method !== 'GET') {
        toast.error(message !== 'A network error occurred. Please try again.' ? message : 'System error. Please try again later.');
      }
    } else if (status === 422 || status === 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
