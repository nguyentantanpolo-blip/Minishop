'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import HomeBannerSlider from '@/components/HomeBannerSlider';

export default function HomePage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <main>
      {/* Dynamic Animated Hero Banner Slider */}
      <HomeBannerSlider />

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
