export interface ProductSpecs {
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  origin?: string;
  gallery?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  priceValue: number;
  desc: string;
  category: 'giay-tay' | 'giay-luoi' | 'dep-da' | 'vi-da' | 'that-lung' | string;
  categoryName: string;
  image: string;
  badge?: string;
  stock: string;
  stockQuantity: number;
  specs?: ProductSpecs;
}

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  categoryName?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  totalFormatted: string;
  paymentMethod: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  statusText: string;
}

export interface UserSession {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin' | 'staff';
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  completedRevenue: number;
  totalOrders: number;
  completedOrdersCount: number;
  pendingOrdersCount: number;
  shippingOrdersCount: number;
  cancelledOrdersCount: number;
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryUnits: number;
  totalInventoryValue: number;
  totalCategories: number;
  totalCustomers: number;
  categoryStats: { id: string; name: string; productCount: number }[];
  topSelling: { name: string; quantity: number; revenue: number; image?: string }[];
  recentOrders: Order[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
