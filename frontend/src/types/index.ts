// User Types
export type UserRole = 'admin' | 'seller';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// Product Types
export interface Product {
  id: number;
  seller_id: number;
  product_name: string;
  sku?: string;
  barcode?: string;
  category: string;
  original_price?: number;
  notes?: string;
  created_at: string;
  seller_name?: string;
  seller_email?: string;
}

export interface ProductCreateData {
  product_name: string;
  sku?: string;
  barcode?: string;
  category: string;
  original_price?: number;
  notes?: string;
}

// Return Types
export type ReturnStatus = 'pending' | 'received' | 'shipped' | 'completed' | 'rejected';
export type ReturnCondition = 'good' | 'damaged' | 'missing_parts';

export interface Return {
  id: number;
  product_id: number;
  seller_id: number;
  return_date: string;
  reason?: string;
  status: ReturnStatus;
  tracking_number?: string;
  photos?: string;
  condition: ReturnCondition;
  notes?: string;
  created_at: string;
  product_name?: string;
  sku?: string;
  seller_name?: string;
  seller_email?: string;
}

export interface ReturnStats {
  total: number;
  pending: number;
  received: number;
  shipped: number;
  good_condition?: number;
  damaged?: number;
}

// Inventory Types
export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  condition: ReturnCondition;
  location?: string;
  notes?: string;
  last_updated: string;
  product_name?: string;
  sku?: string;
  seller_name?: string;
  seller_email?: string;
}

export interface InventoryStats {
  total_items: number;
  total_quantity: number;
  good_condition: number;
  damaged: number;
  missing_parts: number;
  locations: number;
}

// Shipment Types
export type ShipmentStatus = 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';

export interface Shipment {
  id: number;
  return_id: number;
  shipping_date: string;
  tracking_number?: string;
  carrier?: string;
  status: ShipmentStatus;
  recipient_name?: string;
  recipient_address?: string;
  recipient_phone?: string;
  notes?: string;
  created_at: string;
  product_name?: string;
  seller_name?: string;
}

export interface ShipmentStats {
  total: number;
  preparing: number;
  shipped: number;
  delivered: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  company?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Query Parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface ReturnQueryParams {
  page?: number;
  limit?: number;
  status?: ReturnStatus;
  search?: string;
}

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  location?: string;
  condition?: ReturnCondition;
}

export interface ShipmentQueryParams {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
}
