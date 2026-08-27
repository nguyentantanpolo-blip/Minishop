import { Product, Order, CartItem, Category, Customer, DashboardStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface DbCheckResponse {
  status: string;
  database: string;
  latency?: string;
  stats?: {
    categories: number;
    products: number;
    orders: number;
    orderItems: number;
    customers?: number;
  };
  error?: string;
}

export const api = {
  // Health & DB status
  async checkHealth(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async checkDb(): Promise<DbCheckResponse> {
    const res = await fetch(`${API_BASE_URL}/db-check`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Database check failed');
    }
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data || [];
  },

  async createCategory(cat: Category): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data.data;
  },

  async updateCategory(id: string, catData: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete category');
  },

  // Products
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data || [];
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch product details');
    const data = await res.json();
    return data.data;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Inventory
  async adjustStock(
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ): Promise<{ id: string; name: string; previousQuantity: number; stockQuantity: number; stock: string; reason: string }> {
    const res = await fetch(`${API_BASE_URL}/inventory/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to adjust stock');
    return data.data;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE_URL}/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data || [];
  },

  async createOrder(orderData: {
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
  }): Promise<{ success: boolean; orderId: string }> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
  },

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order');
    return data.data;
  },

  async deleteOrder(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete order');
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${API_BASE_URL}/customers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch customers');
    const data = await res.json();
    return data.data || [];
  },

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create customer');
    return data.data;
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${API_BASE_URL}/customers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update customer');
    return data.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/customers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete customer');
  },

  // Stats
  async getStatsOverview(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/stats/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats overview');
    const data = await res.json();
    return data.data;
  },
};
