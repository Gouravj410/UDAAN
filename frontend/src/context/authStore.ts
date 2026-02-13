import { create } from 'zustand';
import { User, AuthContext } from '../types';
import { authService } from '../services/authService';

export const useAuthStore = create<AuthContext>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token') && authService.isTokenValid(),

  login: async (username: string, password: string) => {
    try {
      const token = await authService.login(username, password);
      set({
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
