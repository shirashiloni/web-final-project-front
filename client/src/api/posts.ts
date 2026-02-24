import type { IPostCreate, IPostUpdate, Post, PostQuery } from '../types/Post';
import axiosInstance from '../utils/http';


export const createPost = async (data: IPostCreate) => {
  const response = await axiosInstance.post('/post', data);
  return response.data;
};

export const getPosts = async (query: PostQuery): Promise<{ data: Post[] }> => {
  const response = await axiosInstance.get('/post', { params: query });
  return response.data;
};

export const getPostsBySmartSearch = async (searchText: string): Promise<{ data: Post[] }> => {
  const response = await axiosInstance.get('/post/search', { params: { q: searchText } });
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await axiosInstance.delete(`/post/${postId}`);
};

export const updatePost = async (postId: string, data: IPostUpdate): Promise<Post> => {
  const response = await axiosInstance.put(`/api/post/${postId}`, data);
  return response.data;
};

export const likePost = async (postId: string, userId: string): Promise<{ likeCount: number }> => {
  const response = await axiosInstance.post(`/api/post/${postId}/like`, { userId });
  return response.data;
};

export const unlikePost = async (postId: string, userId: string): Promise<{ likeCount: number }> => {
  const response = await axiosInstance.post(`/api/post/${postId}/unlike`, { userId });
  return response.data;
};

export const getUserLikeStatus = async (postId: string, userId: string): Promise<{ liked: boolean }> => {
  const response = await axiosInstance.get(`/api/like/status?postId=${postId}&userId=${userId}`);
  return response.data;
};

