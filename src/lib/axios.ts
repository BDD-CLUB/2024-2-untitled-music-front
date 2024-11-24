import axios, { AxiosInstance } from 'axios';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const cookies = document.cookie;
      const access_token = cookies
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith('access_token='))
        ?.split('=')[1];
      
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createAxiosInstance();