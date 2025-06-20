// src/api/axios.js
import axios from 'axios';

// In Create React App, all env vars must start with REACT_APP_
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // set to true if you're using cookies/JWT auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
