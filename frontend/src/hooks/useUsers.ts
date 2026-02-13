import { useCallback } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';

export const useUsers = () => {
  const getUser = useCallback(async (id: string): Promise<User> => {
    return await userService.getUser(id);
  }, []);

  const getUsers = useCallback(
    async (page: number = 1, limit: number = 10) => {
      return await userService.getUsers(page, limit);
    },
    []
  );

  const createUser = useCallback(async (userData: Partial<User>): Promise<User> => {
    return await userService.createUser(userData);
  }, []);

  const updateUser = useCallback(async (id: string, userData: Partial<User>): Promise<User> => {
    return await userService.updateUser(id, userData);
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    return await userService.deleteUser(id);
  }, []);

  return {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
