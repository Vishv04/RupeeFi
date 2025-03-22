import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (tokenId) => api.post('/auth/google-login', { tokenId }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  deleteProfile: () => api.delete('/user/profile'),
};

export default api; 