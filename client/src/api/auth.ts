import axios from 'axios';
import type { RegisterData } from '../types/Auth';
import { type CredentialResponse } from '@react-oauth/google';

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post('/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const loginWithGoogle = async (data: CredentialResponse) => {
  const response = await axios.post('/auth/google', data);
  return response.data;
}
