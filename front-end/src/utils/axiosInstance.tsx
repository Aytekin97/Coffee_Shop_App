// axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (storedUser?.access_token) {
    config.headers['Authorization'] = `Bearer ${storedUser.access_token}`;
  }
  return config;
}, Promise.reject);

export default axiosInstance;
