import axios from 'axios';
import type { RegisterData } from '../types/Auth';

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post('/api/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post('/api/auth/refresh', { refreshToken });
  return response.data;
};
