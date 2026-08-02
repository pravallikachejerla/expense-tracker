import axios from 'axios';
import { API_BASE } from '../constants';

/**
 * Centralized API service for the Expense Tracker.
 * - Uses axios instance with base URL and auth token interceptor.
 * - Automatic logout on 401 (unauthorized).
 * - Reduces duplication across components and hooks.
 * - Improves maintainability (single place for API config, headers, error handling).
 */
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for common errors (e.g. auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and trigger logout (components using useAuth will handle redirect)
      localStorage.removeItem('token');
      window.location.href = '/login'; // Simple redirect; could dispatch event for context
      console.error('Unauthorized - redirected to login');
    }
    return Promise.reject(error);
  }
);

export default api;

// Convenience exports for common endpoints (optional, for readability)
export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  getRecurring: () => api.get('/expenses/recurring'),
  getCategories: () => api.get('/expenses/categories'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.patch(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  export: () => api.get('/expenses/export', { responseType: 'blob' }),
};

export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  createOrUpdate: (data) => api.post('/budgets', data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getCategories: () => api.get('/budgets/categories'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};
