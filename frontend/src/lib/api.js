import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

// Returns API
export const returnsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/returns', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/returns/${id}`);
    return response.data;
  },

  create: async (returnData) => {
    const response = await api.post('/returns', returnData);
    return response.data;
  },

  update: async (id, returnData) => {
    const response = await api.put(`/returns/${id}`, returnData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/returns/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/returns/stats');
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  update: async (id, inventoryData) => {
    const response = await api.put(`/inventory/${id}`, inventoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  getLocations: async () => {
    const response = await api.get('/inventory/locations');
    return response.data;
  },
};

// Shipments API
export const shipmentsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  create: async (shipmentData) => {
    const response = await api.post('/shipments', shipmentData);
    return response.data;
  },

  update: async (id, shipmentData) => {
    const response = await api.put(`/shipments/${id}`, shipmentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/shipments/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/shipments/stats');
    return response.data;
  },
};

export default api;
