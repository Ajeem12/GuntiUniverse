// src/utils/axiosInstance.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORT_URL;

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Automatically attach token before each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
