import type { User } from '@/types';

// Auth utility functions

export interface AuthDataReturn {
  token: string | null;
  user: User | null;
}

export const setAuthData = (token: string, user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getAuthData = (): AuthDataReturn => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Check if userStr is valid before parsing
    let user = null;
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        user = JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    return { token, user };
  }
  return { token: null, user: null };
};

export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = (): boolean => {
  const { token } = getAuthData();
  return !!token;
};

export const isAdmin = (): boolean => {
  const { user } = getAuthData();
  return user?.role === 'admin';
};

export const isSeller = (): boolean => {
  const { user } = getAuthData();
  return user?.role === 'seller';
};
