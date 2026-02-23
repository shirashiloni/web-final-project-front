import axios from 'axios';
import type { User } from '../types/User';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyUser = async (): Promise<User> => {
  const response = await axios.get('/api/user/me');
  return response.data;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axios.get(`/api/user/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: string,
  data: { name?: string; profileImage?: string }
) => {
  return axios.put(`/api/user/${userId}`, data);
};
