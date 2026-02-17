import axios from 'axios';
import type { IPostCreate } from '../types/Post';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (data: IPostCreate) => {
  const response = await axios.post('/api/post/', data);
  return response.data;
};
