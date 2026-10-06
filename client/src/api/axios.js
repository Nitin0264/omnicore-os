import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Automatically attach JWT token to headers if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('omnicore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;