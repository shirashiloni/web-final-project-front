import axios from 'axios';

const API_URL = '/api/comment';

export const createComment = async (postId: string, content: string) => {
  const response = await axios.post(`${API_URL}/create`, { postId, content });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await axios.delete(`${API_URL}/delete/${commentId}`);
  return response.data;
};

export const getComments = async (postId: string) => {
  const response = await axios.get(`${API_URL}?postId=${postId}`);
  return response.data;
};
