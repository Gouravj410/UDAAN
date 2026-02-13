import { apiClient } from './api';
import { CitizenProfile, ApiResponse, PaginatedResponse } from '../types';

export const profileService = {
  createProfile: async (profileData: Partial<CitizenProfile>): Promise<CitizenProfile> => {
    const response = await apiClient.post<ApiResponse<CitizenProfile>>('/profiles', profileData);
    return response.data.data!;
  },

  getProfile: async (id: string): Promise<CitizenProfile> => {
    const response = await apiClient.get<ApiResponse<CitizenProfile>>(`/profiles/${id}`);
    return response.data.data!;
  },

  getProfileByUserId: async (userId: string): Promise<CitizenProfile> => {
    const response = await apiClient.get<ApiResponse<CitizenProfile>>(`/profiles/user/${userId}`);
    return response.data.data!;
  },

  getProfiles: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<CitizenProfile>> => {
    const response = await apiClient.get<PaginatedResponse<CitizenProfile>>('/profiles', {
      params: { page, limit },
    });
    return response.data;
  },

  updateProfile: async (id: string, profileData: Partial<CitizenProfile>): Promise<CitizenProfile> => {
    const response = await apiClient.put<ApiResponse<CitizenProfile>>(`/profiles/${id}`, profileData);
    return response.data.data!;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`/profiles/${id}`);
  },
};
