import axios from 'axios';
import type { Post } from '../types/Post';

export const createPost = async (data: Partial<Post>) => {
  const response = await axios.post('/api/post/', data);
  return response.data;
};
