export interface ProductSpecs {
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  origin?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  priceValue: number;
  desc: string;
  category: 'noithat' | 'trangtri' | 'den' | 'luutru' | 'phongngu' | string;
  categoryName: string;
  image: string;
  badge?: string;
  stock: string;
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

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
