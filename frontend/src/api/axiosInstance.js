import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000/api'
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
