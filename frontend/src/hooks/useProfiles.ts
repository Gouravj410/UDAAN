import { useCallback } from 'react';
import { profileService } from '../services/profileService';
import { CitizenProfile } from '../types';

export const useProfiles = () => {
  const getProfile = useCallback(async (id: string): Promise<CitizenProfile> => {
    return await profileService.getProfile(id);
  }, []);

  const getProfileByUserId = useCallback(async (userId: string): Promise<CitizenProfile> => {
    return await profileService.getProfileByUserId(userId);
  }, []);

  const getProfiles = useCallback(
    async (page: number = 1, limit: number = 10) => {
      return await profileService.getProfiles(page, limit);
    },
    []
  );

  const createProfile = useCallback(async (profileData: Partial<CitizenProfile>): Promise<CitizenProfile> => {
    return await profileService.createProfile(profileData);
  }, []);

  const updateProfile = useCallback(
    async (id: string, profileData: Partial<CitizenProfile>): Promise<CitizenProfile> => {
      return await profileService.updateProfile(id, profileData);
    },
    []
  );

  const deleteProfile = useCallback(async (id: string): Promise<void> => {
    return await profileService.deleteProfile(id);
  }, []);

  return {
    getProfile,
    getProfileByUserId,
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
  };
};
