'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, CartItem } from '@/types';
import { useToast } from './ToastContext';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sofa 2 chỗ Nordic',
    price: '2.990.000đ',
    oldPrice: '3.500.000đ',
    discount: '-15%',
    priceValue: 2990000,
    desc: 'Thiết kế tối giản phong cách Bắc Âu, chất liệu vải đệm êm ái, khung gỗ tự nhiên chắc chắn.',
    category: 'noithat',
    categoryName: 'Nội thất',
    image: '/assets/images/sofa-nordic.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    specs: {
      material: 'Vải Linen cao cấp & Gỗ sồi',
      color: 'Ghi xám nhã nhặn',
      dimensions: 'Dài: 160cm, Rộng: 80cm, Cao: 75cm',
      weight: '28.5 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p2',
    name: 'Bàn ăn gỗ Sồi',
    price: '3.490.000đ',
    oldPrice: '4.200.000đ',
    discount: '-17%',
    priceValue: 3490000,
    desc: 'Gỗ sồi tự nhiên tinh tế, bề mặt phủ sơn mờ chống nước, chịu lực tốt và độ bền cao.',
    category: 'noithat',
    categoryName: 'Nội thất',
    image: '/assets/images/ban-an-go-soi.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    specs: {
      material: 'Gỗ sồi Mỹ tự nhiên 100%',
      color: 'Vàng gỗ tự nhiên',
      dimensions: 'Dài: 140cm, Rộng: 80cm, Cao: 75cm',
      weight: '32 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p3',
    name: 'Đèn thả trần Minimal',
    price: '599.000đ',
    oldPrice: '700.000đ',
    discount: '-15%',
    priceValue: 599000,
    desc: 'Thiết kế chao đèn hình nón tối giản, tạo ánh sáng dịu nhẹ ấm cúng cho không gian ăn uống và phòng khách.',
    category: 'den',
    categoryName: 'Đèn',
    image: '/assets/images/den-tha-tran.jpg',
    badge: '-15%',
    stock: 'Còn hàng',
    specs: {
      material: 'Nhôm sơn tĩnh điện & Đui gỗ',
      color: 'Xám đen nhám',
      dimensions: 'Đường kính: 30cm, Cao: 25cm',
      weight: '1.2 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p4',
    name: 'Bình gốm Decor',
    price: '290.000đ',
    oldPrice: '350.000đ',
    discount: '-17%',
    priceValue: 290000,
    desc: 'Gốm sứ cao cấp tráng mờ thủ công, đường nét trang nhã hoàn hảo để cắm hoa tươi hoặc cành lá decor.',
    category: 'trangtri',
    categoryName: 'Trang trí',
    image: '/assets/images/binh-gom-decor.jpg',
    badge: 'Hot',
    stock: 'Còn hàng',
    specs: {
      material: 'Gốm sứ thủ công',
      color: 'Trắng mờ & Xanh olive',
      dimensions: 'Đường kính: 14cm, Cao: 22cm',
      weight: '0.9 kg',
      origin: 'Bát Tràng, Việt Nam',
    },
  },
  {
    id: 'p5',
    name: 'Kệ gỗ đa năng',
    price: '1.293.000đ',
    oldPrice: '1.500.000đ',
    discount: '-14%',
    priceValue: 1293000,
    desc: 'Thiết kế nhiều tầng tiện dụng, giúp tối ưu hóa không gian lưu trữ đồ dùng, sách vở và cây cảnh nhỏ.',
    category: 'luutru',
    categoryName: 'Lưu trữ',
    image: '/assets/images/ke-go-da-nang.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    specs: {
      material: 'Gỗ cao su ghép thanh cao cấp',
      color: 'Gỗ tự nhiên',
      dimensions: 'Chiều rộng: 80cm, Sâu: 30cm, Cao: 140cm',
      weight: '14.5 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p6',
    name: 'Giỏ mây lưu trữ',
    price: '199.000đ',
    oldPrice: '250.000đ',
    discount: '-20%',
    priceValue: 199000,
    desc: 'Giỏ đan bằng mây tre tự nhiên thân thiện với môi trường, thiết kế có nắp đậy gọn gàng.',
    category: 'luutru',
    categoryName: 'Lưu trữ',
    image: '/assets/images/gio-may-luu-tru.jpg',
    stock: 'Còn hàng',
    specs: {
      material: 'Mây đan tự nhiên 100%',
      color: 'Nâu mây tự nhiên',
      dimensions: 'Dài: 38cm, Rộng: 26cm, Cao: 20cm',
      weight: '0.7 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p7',
    name: 'Chậu cây cảnh trong nhà',
    price: '490.000đ',
    oldPrice: '580.000đ',
    discount: '-15%',
    priceValue: 490000,
    desc: 'Chậu gốm sứ trắng tối giản kèm đĩa lót, phù hợp trồng các loại cây cảnh lọc không khí trong nhà.',
    category: 'trangtri',
    categoryName: 'Trang trí',
    image: '/assets/images/chau-cay-canh.jpg',
    stock: 'Còn hàng',
    specs: {
      material: 'Gốm nung nhiệt độ cao',
      color: 'Trắng tinh khôi',
      dimensions: 'Đường kính: 20cm, Cao: 25cm',
      weight: '2.1 kg',
      origin: 'Việt Nam',
    },
  },
  {
    id: 'p8',
    name: 'Bộ ga gối Cotton',
    price: '1.590.000đ',
    oldPrice: '1.900.000đ',
    discount: '-16%',
    priceValue: 1590000,
    desc: 'Chất liệu Cotton 100% thoáng mát, thấm hút mồ hôi tốt, đem lại giấc ngủ êm ái sâu giấc.',
    category: 'phongngu',
    categoryName: 'Phòng ngủ',
    image: '/assets/images/bo-ga-goi-cotton.jpg',
    badge: 'Mới',
    stock: 'Còn hàng',
    specs: {
      material: 'Cotton Hàn Quốc 100%',
      color: 'Kem nhã nhặn',
      dimensions: 'Ga 180x200cm, 2 vỏ gối 50x70cm',
      weight: '2.4 kg',
      origin: 'Việt Nam',
    },
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#MS-84920',
    date: '2026-08-15 14:30',
    customer: 'Nguyễn Văn A',
    phone: '0912 345 678',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    items: [
      { id: 'p1', name: 'Sofa 2 chỗ Nordic', price: '2.990.000đ', priceValue: 2990000, quantity: 1, image: '/assets/images/sofa-nordic.jpg' },
    ],
    subtotal: 2990000,
    shippingFee: 0,
    total: 2990000,
    totalFormatted: '2.990.000đ',
    paymentMethod: 'COD',
    status: 'completed',
    statusText: 'Thành công',
    notes: 'Giao giờ hành chính',
  },
  {
    id: '#MS-73194',
    date: '2026-08-15 11:20',
    customer: 'Trần Thị B',
    phone: '0988 765 432',
    address: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
    items: [
      { id: 'p3', name: 'Đèn thả trần Minimal', price: '599.000đ', priceValue: 599000, quantity: 1, image: '/assets/images/den-tha-tran.jpg' },
    ],
    subtotal: 599000,
    shippingFee: 0,
    total: 599000,
    totalFormatted: '599.000đ',
    paymentMethod: 'QR Banking',
    status: 'pending',
    statusText: 'Đang xử lý',
    notes: '',
  },
  {
    id: '#MS-65821',
    date: '2026-08-14 16:45',
    customer: 'Lê Hoàng C',
    phone: '0903 111 222',
    address: '78 Cầu Giấy, Hà Nội',
    items: [
      { id: 'p8', name: 'Bộ ga gối Cotton', price: '1.590.000đ', priceValue: 1590000, quantity: 1, image: '/assets/images/bo-ga-goi-cotton.jpg' },
    ],
    subtotal: 1590000,
    shippingFee: 0,
    total: 1590000,
    totalFormatted: '1.590.000đ',
    paymentMethod: 'COD',
    status: 'completed',
    statusText: 'Thành công',
    notes: 'Gọi trước khi giao',
  },
  {
    id: '#MS-51204',
    date: '2026-08-14 09:15',
    customer: 'Phạm Minh D',
    phone: '0977 444 555',
    address: '12 Trần Phú, Nha Trang, Khánh Hòa',
    items: [
      { id: 'p4', name: 'Bình gốm Decor', price: '290.000đ', priceValue: 290000, quantity: 1, image: '/assets/images/binh-gom-decor.jpg' },
    ],
    subtotal: 290000,
    shippingFee: 30000,
    total: 320000,
    totalFormatted: '320.000đ',
    paymentMethod: 'QR Banking',
    status: 'completed',
    statusText: 'Thành công',
    notes: '',
  },
];

interface ShopContextType {
  products: Product[];
  orders: Order[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  placeOrder: (orderData: {
    customer: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    paymentMethod: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  formatPrice: (value: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const storedProds = localStorage.getItem('minishop_products');
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      } else {
        localStorage.setItem('minishop_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      const storedOrders = localStorage.getItem('minishop_orders');
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      } else {
        localStorage.setItem('minishop_orders', JSON.stringify(INITIAL_ORDERS));
      }
    } catch (e) {}
    setMounted(true);
  }, []);

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + 'đ';
  };

  const saveProductsToStorage = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('minishop_products', JSON.stringify(newProducts));
    } catch (e) {}
  };

  const saveOrdersToStorage = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('minishop_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = 'p_' + Date.now().toString(36);
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
    showToast(`🎉 Đã thêm sản phẩm "${newProduct.name}" vào hệ thống!`, 'success');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...productData } : p));
    saveProductsToStorage(updated);
    showToast(`✅ Đã cập nhật thông tin sản phẩm thành công!`, 'success');
  };

  const deleteProduct = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    const updated = products.filter((prod) => prod.id !== id);
    saveProductsToStorage(updated);
    showToast(`🗑️ Đã xóa sản phẩm "${p ? p.name : id}" khỏi hệ thống.`, 'info');
  };

  const resetProducts = () => {
    saveProductsToStorage(INITIAL_PRODUCTS);
    showToast('🔄 Đã khôi phục 8 sản phẩm mẫu ban đầu!', 'success');
  };

  const placeOrder = ({
    customer,
    phone,
    address,
    notes,
    items,
    paymentMethod,
  }: {
    customer: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    paymentMethod: string;
  }): Order => {
    const orderId = '#MS-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      date,
      customer,
      phone,
      address,
      notes,
      items: [...items],
      subtotal,
      shippingFee,
      total,
      totalFormatted: formatPrice(total),
      paymentMethod,
      status: 'pending',
      statusText: 'Đang xử lý',
    };

    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const statusTextMap: Record<Order['status'], string> = {
      pending: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Thành công',
      cancelled: 'Đã hủy',
    };

    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, statusText: statusTextMap[status] } : o
    );
    saveOrdersToStorage(updated);
    showToast(`✅ Đã cập nhật đơn ${orderId} sang: ${statusTextMap[status]}`, 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products: mounted ? products : INITIAL_PRODUCTS,
        orders: mounted ? orders : INITIAL_ORDERS,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        placeOrder,
        updateOrderStatus,
        formatPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
