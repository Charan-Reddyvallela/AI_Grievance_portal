import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API (prompt: POST /api/register, POST /api/login, GET /api/user/profile)
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.put('/change-password', passwordData),
};

// Complaints API
export const complaintsAPI = {
  submit: (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    return api.post('/complaints/submit', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: (params) => api.get('/complaints', { params }),
  getUserComplaints: (userId, params) => api.get(`/complaints/user/${userId}`, { params }),
  getByStatus: (complaintId) => api.get(`/complaints/status/${complaintId}`),
  getByLocation: (pincode, params) => api.get(`/complaints/location/${pincode}`, { params }),
  updateStatus: (statusData) => api.put('/complaints/update-status', statusData),
  upvote: (complaintData) => api.post('/complaints/upvote', complaintData),
  getAnalytics: () => api.get('/complaints/analytics'),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (userId) => api.get(`/users/${userId}`),
  updateRole: (userId, roleData) => api.put(`/users/${userId}/role`, roleData),
  updateStatus: (userId, statusData) => api.put(`/users/${userId}/status`, statusData),
  getLeaderboard: (params) => api.get('/users/leaderboard/top', { params }),
};

// Chatbot API (Groq AI)
export const chatbotAPI = {
  chat: (message, messages = []) => api.post('/chatbot', { message, messages }),
  getInfo: () => api.get('/chatbot/info'),
};

export default api;
