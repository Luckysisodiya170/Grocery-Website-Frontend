import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://13.203.29.79:9000/api/v1',
});

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

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken'); 
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('http://13.203.29.79:9000/api/v1/customers/refresh-token', {
          token: refreshToken
        });

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        
        // Update local storage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        toast.error("Your session has completely expired. Please login again.");
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user'); 
        
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);

export default api;