// Auth utility functions

export const setAuthData = (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  }
  return { token: null, user: null };
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = () => {
  const { token } = getAuthData();
  return !!token;
};

export const isAdmin = () => {
  const { user } = getAuthData();
  return user?.role === 'admin';
};

export const isSeller = () => {
  const { user } = getAuthData();
  return user?.role === 'seller';
};
