import axios from 'axios';
import type { IPostCreate, IPostUpdate, Post } from '../types/Post';

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

export const getUsersPosts = async (userId: string): Promise<Post[]> => {
  const response = await axios.get(`/api/post/user/${userId}`);
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await axios.delete(`/api/post/${postId}`);
};

export const updatePost = async (postId: string, data: IPostUpdate): Promise<Post> => {
  const response = await axios.put(`/api/post/${postId}`, data);
  return response.data;
};

export const likePost = async (postId: string, userId: string): Promise<{ likeCount: number }> => {
  const response = await axios.post(`/api/post/${postId}/like`, { userId });
  return response.data;
};

export const unlikePost = async (postId: string, userId: string): Promise<{ likeCount: number }> => {
  const response = await axios.post(`/api/post/${postId}/unlike`, { userId });
  return response.data;
};

