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
                  <div>
                    <span className="feature-title">Giao hàng nhanh</span>
                    <span className="feature-desc">Freeship từ 500k</span>
                  </div>
                </div>

                <div className="feature-item">
                  <div>
                    <span className="feature-title">Da bò thật 100%</span>
                    <span className="feature-desc">Bảo hành 12 tháng</span>
                  </div>
                </div>

                <div className="feature-item">
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
              Tất cả ({products.length})
            </button>

            <button
              className={`category-pill ${selectedCategory === 'giay-tay' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('giay-tay')}
            >
              Giày tây
            </button>

            <button
              className={`category-pill ${selectedCategory === 'giay-luoi' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('giay-luoi')}
            >
              Giày lười
            </button>

            <button
              className={`category-pill ${selectedCategory === 'dep-da' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('dep-da')}
            >
              Dép da & Sandal
            </button>

            <button
              className={`category-pill ${selectedCategory === 'vi-da' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('vi-da')}
            >
              Ví da nam
            </button>

            <button
              className={`category-pill ${selectedCategory === 'that-lung' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('that-lung')}
            >
              Thắt lưng da
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container" id="products">
        <div className="section-header">
          <h2 className="section-title">Bộ Sưu Tập Sản Phẩm Đồ Da</h2>
          <Link href="/products" className="section-link">
            Xem tất cả ({products.length} sản phẩm) →
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
