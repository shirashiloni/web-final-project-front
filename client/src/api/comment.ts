import type { Comment } from '../types/Comment';
import axiosInstance from '../utils/http';

const API_URL = '/api/comment';

export const createComment = async (postId: string, content: string, userId: string) => {
    const response = await axiosInstance.post(`${API_URL}`, { postId, content, userId });
    return response.data;
};

export const deleteComment = async (commentId: string) => {
    const response = await axiosInstance.delete(`${API_URL}/${commentId}`);
    return response.data;
};

export const getComments = async (postId: string): Promise<{ data: Comment[] }> => {
    const response = await axiosInstance.get(`${API_URL}?postId=${postId}`);
    return response.data;
};
