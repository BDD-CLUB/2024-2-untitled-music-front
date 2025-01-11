import axios from 'axios';
import { checkAuth } from './auth';

const checkToken = async () => {
  const { accessToken } = await checkAuth();
  return accessToken;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${checkToken()}`,
  },
});