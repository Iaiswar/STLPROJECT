// src/utils/axios.ts

import axios from 'axios';
// import { refreshAccessToken } from './refreshToken';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('jwt-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh-token');
    //   if (refreshToken) {
    //     const newAccessToken = await refreshAccessToken(refreshToken);
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return api(originalRequest);
    //   }
     }
    return Promise.reject(error);
  }
);

export default api;
