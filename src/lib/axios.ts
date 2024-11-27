import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie"; // 쿠키 처리를 위해 js-cookie 라이브러리 추천

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get("access_token");

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;
