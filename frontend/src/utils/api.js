import axios from 'axios';

// Create axios instance with base URL
// Use environment variable in production, fallback to localhost for development
// Automatically append /api if not present
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  if (!envURL) {
    return 'http://localhost:5000/api';
  }
  
  // Remove trailing slash
  let baseURL = envURL.trim().replace(/\/+$/, '');
  
  // Ensure /api is at the end
  if (!baseURL.endsWith('/api')) {
    baseURL = `${baseURL}/api`;
  }
  
  return baseURL;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Task API methods
export const taskAPI = {
  getTasks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/tasks?${queryString}`);
  },
  getTask: (id) => api.get(`/tasks/${id}`),
  getTaskStats: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/tasks/stats?${queryString}`);
  },
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  updatePriority: (id, priority) => api.patch(`/tasks/${id}/priority`, { priority }),
};

// User API methods (admin only)
export const userAPI = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;

