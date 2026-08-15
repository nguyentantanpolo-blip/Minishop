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
                Sống đẹp mỗi ngày<br />cùng Mini Shop
              </h1>
              <p className="hero-subtitle">Sản phẩm chất lượng cho tổ ấm của bạn.</p>
              <Link href="/products" className="btn-primary">
                Mua sắm ngay
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
                    <span className="feature-desc">Toàn quốc</span>
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
                    <span className="feature-title">Bảo hành chính hãng</span>
                    <span className="feature-desc">7 ngày đổi trả</span>
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
                    <span className="feature-title">Hỗ trợ 24/7</span>
                    <span className="feature-desc">Tư vấn tận tâm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-image-wrapper">
              <img src="/assets/images/hero-banner.jpg" alt="Banner trang trí nhà cửa Mini Shop" />
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
              <span>Tất cả</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'noithat' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('noithat')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 18v3M20 18v3M3 14h18M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"></path>
              </svg>
              <span>Nội thất</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'trangtri' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('trangtri')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>Trang trí</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'den' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('den')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <path d="M12 6a7 7 0 0 1 7 7v3H5v-3a7 7 0 0 1 7-7z"></path>
              </svg>
              <span>Đèn</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'luutru' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('luutru')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span>Lưu trữ</span>
            </button>

            <button
              className={`category-pill ${selectedCategory === 'phongngu' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('phongngu')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
              </svg>
              <span>Phòng ngủ</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container" id="products">
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <Link href="/products" className="section-link">
            <span>Xem tất cả ({products.length})</span>
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
