import * as jwtDecodeLib from 'jwt-decode';
import { JwtPayload } from 'jsonwebtoken';

// jwt-decode may be shipped as CommonJS; ensure we have a callable default export
const jwtDecode: <T = unknown>(token: string) => T = ((jwtDecodeLib as any).default || jwtDecodeLib) as any;

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const token = 'mock-jwt-token';
    localStorage.setItem('auth_token', token);
    return token;
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  isTokenValid: (): boolean => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return false;
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};
