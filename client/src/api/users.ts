import type { User } from '../types/User';
import axiosInstance from '../utils/http';

export const getMyUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/api/user/me");
  return response.data;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get(`/api/user/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: string,
  data: { name?: string; profileImage?: string }
) => {
  return axiosInstance.put(`/api/user/${userId}`, data);
}
