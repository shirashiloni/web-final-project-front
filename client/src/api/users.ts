import axios from 'axios';
import type { User } from '../types/User';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyUser = async (): Promise<User> => {
  const response = await axios.get('/auth/me');
  return response.data;
};
