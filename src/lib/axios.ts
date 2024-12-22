import axios, { AxiosInstance } from "axios";

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config) => {
      try {
        const response = await fetch('/api/token')
        const data = await response.json()
        
        if (data.token) {
          config.headers.Authorization = `Bearer ${data.token}`;
        }
      } catch (error) {
        console.error('토큰 가져오기 실패:', error);
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
