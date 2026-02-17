import axios from 'axios';
import type { IPostCreate, Post } from '../types/Post';

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

export const getPosts = async (): Promise<{ data: Post[] }> => {
  const response = await axios.get('/api/post/');
  return response.data;
};