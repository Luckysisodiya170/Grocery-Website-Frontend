// src/utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// 1. Apna base URL set karo
const api = axios.create({
  baseURL: 'http://13.203.29.79:9000/api/v1',
});

// 2. Request Interceptor: Har API call se pehle Access Token attach karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: 401 Error aane par Refresh Token use karega
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // Agar error 401 (Unauthorized) hai aur humne pehle retry nahi kiya hai
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken'); 
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Backend se naya token mango
        const response = await axios.post('http://13.203.29.79:9000/api/v1/customers/refresh-token', {
          token: refreshToken
        });

        // Naya token save karo
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Fail hui request ko naye token ke sath wapas hit karo
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 🔥 YAHAN TOAST USE KIYA HAI
        toast.error("Session expired. Please login again.");
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user'); // Agar aap user data bhi LocalStorage me rakhte ho
        
        // Force redirect to login
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;