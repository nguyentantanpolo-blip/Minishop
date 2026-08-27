'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <div className="hero-content">
              <h1 className="hero-title">
                Đồ Da Thật Cao Cấp<br />Khẳng Định Bản Lĩnh
              </h1>
              <p className="hero-subtitle">
                Thương hiệu đồ da TANPOLO Since 1992s - Giày tây, giày lười, dép da, ví da & thắt lưng da bò thật 100%.
              </p>
              <Link href="/products" className="btn-primary">
                Khám phá bộ sưu tập
              </Link>

              {/* Feature Badges */}
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  <div>
                    <span className="feature-title">Giao hàng nhanh</span>
                    <span className="feature-desc">Freeship từ 500k</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="feature-title">Da bò thật 100%</span>
                    <span className="feature-desc">Bảo hành 12 tháng</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="feature-title">Đổi trả 7 ngày</span>
                    <span className="feature-desc">Kiểm tra trước khi nhận</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-image-wrapper">
              <img
                src="/assets/images/products/bo5-1.jpg"
                alt="Bộ sưu tập đồ da cao cấp Tanpolo"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-bar">
            <button
              className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Tất cả ({products.length})</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'giay-tay' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('giay-tay')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 18v3M20 18v3M3 14h18M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"></path>
              </svg>
              <span>Giày tây</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'giay-luoi' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('giay-luoi')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>Giày lười</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'dep-da' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('dep-da')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
              </svg>
              <span>Dép da & Sandal</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'vi-da' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('vi-da')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>Ví da nam</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'that-lung' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('that-lung')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              <span>Thắt lưng da</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container" id="products">
        <div className="section-header">
          <h2 className="section-title">Bộ Sưu Tập Sản Phẩm Đồ Da</h2>
          <Link href="/products" className="section-link">
            <span>Xem tất cả ({products.length} sản phẩm)</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="product-grid-4col">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
