'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {}
    setMounted(true);
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('minishop_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product: Product, quantity = 1) => {
    const qty = Math.max(1, quantity);
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += qty;
    } else {
      updated = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          priceValue: product.priceValue,
          image: product.image,
          categoryName: product.categoryName,
          quantity: qty,
        },
      ];
    }

    saveCartToStorage(updated);
    showToast(`✅ Đã thêm ${qty}x "${product.name}" vào giỏ hàng!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    const updated = cart.filter((i) => i.id !== productId);
    saveCartToStorage(updated);
    if (item) {
      showToast(`🗑️ Đã xóa "${item.name}" khỏi giỏ hàng.`, 'info');
    }
  };

  const updateCartItemQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const cartSubtotal = mounted
    ? cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0)
    : 0;
  const shippingFee = cartSubtotal >= 500000 || cartSubtotal === 0 ? 0 : 30000;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart: mounted ? cart : [],
        addToCart,
        removeFromCart,
        updateCartItemQty,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
