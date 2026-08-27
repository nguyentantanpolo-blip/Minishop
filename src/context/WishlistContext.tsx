'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {}
    setMounted(true);
  }, []);

  const saveWishlistToStorage = (newList: string[]) => {
    setWishlist(newList);
    try {
      localStorage.setItem('minishop_wishlist', JSON.stringify(newList));
    } catch (e) {}
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (product: Product) => {
    let updated: string[];
    if (isWishlisted(product.id)) {
      updated = wishlist.filter((id) => id !== product.id);
      showToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích.`, 'info');
    } else {
      updated = [...wishlist, product.id];
      showToast(`Đã lưu "${product.name}" vào danh sách yêu thích!`, 'success');
    }
    saveWishlistToStorage(updated);
  };

  const wishlistCount = mounted ? wishlist.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlist: mounted ? wishlist : [],
        toggleWishlist,
        isWishlisted,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
