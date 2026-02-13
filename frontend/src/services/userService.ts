import { apiClient } from './api';
import { User, ApiResponse, PaginatedResponse } from '../types';

export const userService = {
  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', userData);
    return response.data.data!;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  getUsers: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: { page, limit },
    });
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
