'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const { products } = useShop();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) setSearchQuery(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Filter calculations
  const filtered = products.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    let matchPrice = true;
    if (priceRange === 'under-400') matchPrice = p.priceValue < 400000;
    else if (priceRange === '400-600') matchPrice = p.priceValue >= 400000 && p.priceValue <= 600000;
    else if (priceRange === '600-1000') matchPrice = p.priceValue > 600000 && p.priceValue <= 1000000;
    else if (priceRange === 'above-1000') matchPrice = p.priceValue > 1000000;

    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query ||
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(query));

    return matchCat && matchPrice && matchQuery;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'price-low') return a.priceValue - b.priceValue;
    if (sortOrder === 'price-high') return b.priceValue - a.priceValue;
    if (sortOrder === 'name') return a.name.localeCompare(b.name, 'vi');
    return 0;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === 'all') return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  return (
    <main className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <span className="current">Tất cả sản phẩm đồ da</span>
      </nav>

      <div className="page-layout">
        {/* Left Sidebar Filter */}
        <aside className="sidebar">
          <div className="sidebar-card">
            {/* Category Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Danh mục sản phẩm</h3>
              <ul className="sidebar-cat-list">
                {[
                  { id: 'all', label: 'Tất cả sản phẩm' },
                  { id: 'giay-tay', label: 'Giày Tây & Công Sở' },
                  { id: 'giay-luoi', label: 'Giày Lười Da' },
                  { id: 'dep-da', label: 'Dép Da & Sandal' },
                  { id: 'vi-da', label: 'Ví Da Bò Nam' },
                  { id: 'that-lung', label: 'Thắt Lưng Da' },
                ].map((item) => (
                  <li key={item.id}>
                    <div
                      className={`sidebar-cat-item ${category === item.id ? 'active' : ''}`}
                      onClick={() => setCategory(item.id)}
                    >
                      <span>{item.label}</span>
                      <span className="count-badge">{getCategoryCount(item.id)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="filter-divider" />

            {/* Price Range Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Khoảng giá</h3>
              <div className="price-filter-list">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under-400', label: 'Dưới 400.000đ' },
                  { id: '400-600', label: '400.000đ - 600.000đ' },
                  { id: '600-1000', label: '600.000đ - 1.000.000đ' },
                  { id: 'above-1000', label: 'Trên 1.000.000đ' },
                ].map((item) => (
                  <label key={item.id} className="radio-label">
                    <input
                      type="radio"
                      name="price-range"
                      value={item.id}
                      checked={priceRange === item.id}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="filter-divider" />

            {/* Availability */}
            <div className="filter-group">
              <h3 className="filter-title">Tình trạng</h3>
              <div className="price-filter-list">
                <label className="radio-label">
                  <input type="checkbox" checked disabled />
                  <span>Còn hàng ({products.filter((p) => p.stock !== 'Hết hàng').length})</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="main-content">
          <div className="products-toolbar">
            <div>
              <h1 className="products-page-title">Sản Phẩm Đồ Da Cao Cấp</h1>
              <p className="products-count">
                Hiển thị {sorted.length} trên {products.length} sản phẩm
              </p>
            </div>

            <div className="products-toolbar-right">
              {/* Search input */}
              <div className="toolbar-search">
                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm, chất liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              {/* Sort Select */}
              <div className="sort-wrapper">
                <label htmlFor="sort-select" className="sort-label">
                  Sắp xếp:
                </label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">Mới nhất</option>
                  <option value="price-low">Giá: Thấp đến cao</option>
                  <option value="price-high">Giá: Cao đến thấp</option>
                  <option value="name">Tên: A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {sorted.length === 0 ? (
            <div className="empty-cart-card" style={{ maxWidth: '100%', margin: '20px 0' }}>
              <h2>Không tìm thấy sản phẩm phù hợp</h2>
              <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setCategory('all');
                  setPriceRange('all');
                  setSearchQuery('');
                  setSortOrder('default');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="product-grid-4col" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Đang tải danh mục sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
