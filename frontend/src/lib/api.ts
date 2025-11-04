import axios, { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  AuthData,
  LoginFormData,
  RegisterFormData,
  ProfileUpdateData,
  PasswordChangeData,
  Product,
  ProductCreateData,
  ProductQueryParams,
  Return,
  ReturnQueryParams,
  ReturnStats,
  Inventory,
  InventoryQueryParams,
  InventoryStats,
  Shipment,
  ShipmentQueryParams,
  ShipmentStats,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
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
  login: async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterFormData): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: ProfileUpdateData): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (data: PasswordChangeData): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>('/auth/change-password', data);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  create: async (productData: ProductCreateData): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data;
  },

  update: async (id: number, productData: Partial<ProductCreateData>): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/products/categories');
    return response.data;
  },
};

// Returns API
export const returnsAPI = {
  getAll: async (params: ReturnQueryParams = {}): Promise<PaginatedResponse<Return>> => {
    const response = await api.get<PaginatedResponse<Return>>('/returns', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Return>> => {
    const response = await api.get<ApiResponse<Return>>(`/returns/${id}`);
    return response.data;
  },

  create: async (returnData: Partial<Return>): Promise<ApiResponse<Return>> => {
    const response = await api.post<ApiResponse<Return>>('/returns', returnData);
    return response.data;
  },

  update: async (id: number, returnData: Partial<Return>): Promise<ApiResponse<Return>> => {
    const response = await api.put<ApiResponse<Return>>(`/returns/${id}`, returnData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/returns/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<ReturnStats>> => {
    const response = await api.get<ApiResponse<ReturnStats>>('/returns/stats');
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (params: InventoryQueryParams = {}): Promise<PaginatedResponse<Inventory>> => {
    const response = await api.get<PaginatedResponse<Inventory>>('/inventory', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Inventory>> => {
    const response = await api.get<ApiResponse<Inventory>>(`/inventory/${id}`);
    return response.data;
  },

  update: async (id: number, inventoryData: Partial<Inventory>): Promise<ApiResponse<Inventory>> => {
    const response = await api.put<ApiResponse<Inventory>>(`/inventory/${id}`, inventoryData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/inventory/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<InventoryStats>> => {
    const response = await api.get<ApiResponse<InventoryStats>>('/inventory/stats');
    return response.data;
  },

  getLocations: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/inventory/locations');
    return response.data;
  },
};

// Shipments API
export const shipmentsAPI = {
  getAll: async (params: ShipmentQueryParams = {}): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get<PaginatedResponse<Shipment>>('/shipments', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Shipment>> => {
    const response = await api.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return response.data;
  },

  create: async (shipmentData: Partial<Shipment>): Promise<ApiResponse<Shipment>> => {
    const response = await api.post<ApiResponse<Shipment>>('/shipments', shipmentData);
    return response.data;
  },

  update: async (id: number, shipmentData: Partial<Shipment>): Promise<ApiResponse<Shipment>> => {
    const response = await api.put<ApiResponse<Shipment>>(`/shipments/${id}`, shipmentData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/shipments/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<ShipmentStats>> => {
    const response = await api.get<ApiResponse<ShipmentStats>>('/shipments/stats');
    return response.data;
  },
};

export default api;
