'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <span className="current">Danh sách yêu thích</span>
      </nav>

      <div className="products-toolbar">
        <div>
          <h1 className="products-page-title">Sản phẩm yêu thích ❤️</h1>
          <p className="products-count">Hiển thị {wishlistedProducts.length} sản phẩm đã lưu</p>
        </div>
        <Link href="/products" className="section-link">
          <span>← Khám phá thêm sản phẩm</span>
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="empty-cart-card">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2>Danh sách yêu thích đang trống</h2>
          <p>Hãy thả tim các sản phẩm yêu thích của bạn để dễ dàng xem lại bất cứ lúc nào!</p>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            Khám phá sản phẩm ngay
          </Link>
        </div>
      ) : (
        <div className="product-grid-4col">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
