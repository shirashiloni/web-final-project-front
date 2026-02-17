import axios from 'axios';
import type { Post } from '../types/Post';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (data: Partial<Post>) => {
  const response = await axios.post('/api/post/', data);
  return response.data;
};
