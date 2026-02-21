import axios from 'axios';
import type { Comment } from '../types/Comment';

const API_URL = '/api/comment';

export const createComment = async (postId: string, content: string, userId: string) => {
    const response = await axios.post(`${API_URL}`, { postId, content, userId });
    return response.data;
};

export const deleteComment = async (commentId: string) => {
    const response = await axios.delete(`${API_URL}/${commentId}`);
    return response.data;
};

export const getComments = async (postId: string): Promise<{ data: Comment[] }> => {
    const response = await axios.get(`${API_URL}?postId=${postId}`);
    return response.data;
};
