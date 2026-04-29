import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://shipzyy.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.data?.is_logged_in === false && localStorage.getItem('accessToken')) {
      console.warn("Session expired based on response data. Cleaning up...");
      handleAuthCleanup();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status >= 500) {
      window.dispatchEvent(new CustomEvent("server-error"));
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const rt = localStorage.getItem('refreshToken');

      if (!rt) {
        handleAuthCleanup();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/customers/refresh-token`, { token: rt });
        
        if (res.data.success) {
          const { accessToken, refreshToken: newRefresh } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefresh);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        handleAuthCleanup();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

const handleAuthCleanup = () => {
 
  if (!localStorage.getItem('accessToken')) return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
    window.location.href = '/login';
  }
};

const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default apiService;