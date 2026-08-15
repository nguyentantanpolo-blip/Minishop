'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products } = useShop();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(product?.image || '/assets/images/binh-gom-decor.jpg');

  if (!product) {
    return notFound();
  }

  const wishlisted = isWishlisted(product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated = relatedProducts.length > 0
    ? relatedProducts
    : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <Link href="/products">Sản phẩm</Link>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </nav>

      {/* Main Detail Layout */}
      <div className="detail-main-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="detail-thumbs">
            <div
              className={`thumb-item ${activeImg === product.image ? 'active' : ''}`}
              onClick={() => setActiveImg(product.image)}
            >
              <img src={product.image} alt={product.name} />
            </div>
            <div
              className="thumb-item"
              onClick={() => setActiveImg(product.image)}
            >
              <img src={product.image} alt={`${product.name} Góc 2`} />
            </div>
          </div>

          <div className="detail-main-img-wrapper">
            <img src={activeImg || product.image} alt={product.name} />
          </div>
        </div>

        {/* Summary Info */}
        <div className="detail-summary">
          <div className="detail-tags">
            <span className="stock-badge-green">● {product.stock || 'Còn hàng'}</span>
            <span className="category-tag-subtle">{product.categoryName || 'Sản phẩm'}</span>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          <div className="detail-rating-row">
            <div className="stars-gold">★★★★★</div>
            <span className="rating-number">4.9 / 5</span>
            <span className="rating-divider">•</span>
            <span className="reviews-link">28 đánh giá từ khách hàng</span>
          </div>

          <div className="detail-price-box">
            <span className="detail-current-price">{product.price}</span>
            {product.oldPrice && (
              <span className="detail-old-price">{product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="detail-discount-tag">{product.discount}</span>
            )}
          </div>

          <p className="detail-short-desc">{product.desc}</p>

          {/* Specs if available */}
          {product.specs && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {product.specs.material && <div><strong>Chất liệu:</strong> {product.specs.material}</div>}
              {product.specs.dimensions && <div><strong>Kích thước:</strong> {product.specs.dimensions}</div>}
              {product.specs.origin && <div><strong>Xuất xứ:</strong> {product.specs.origin}</div>}
            </div>
          )}

          {/* Actions */}
          <div className="detail-actions-group">
            <div className="detail-qty-control">
              <span className="qty-label">Số lượng:</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input type="number" value={quantity} readOnly />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-btns-row">
              <button
                type="button"
                className="btn-detail-add-cart"
                onClick={() => addToCart(product, quantity)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Thêm vào giỏ hàng</span>
              </button>

              <button
                type="button"
                className={`btn-detail-wishlist ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                title={wishlisted ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Policies */}
          <div className="detail-policies-list">
            <div className="policy-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Miễn phí giao hàng toàn quốc cho đơn từ 500.000đ</span>
            </div>

            <div className="policy-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
              <span>Đổi trả miễn phí trong vòng 7 ngày nếu lỗi sản xuất</span>
            </div>

            <div className="policy-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              <span>Bảo hành chính hãng 12 tháng tại hệ thống Mini Shop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section style={{ paddingBottom: '60px' }}>
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Tương Tự</h2>
          <Link href="/products" className="section-link">
            <span>Xem tất cả</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="product-grid-4col">
          {fallbackRelated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
