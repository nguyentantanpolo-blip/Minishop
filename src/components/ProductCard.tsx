'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const stockQty = product.stockQuantity !== undefined ? product.stockQuantity : 50;
  const isOutOfStock = stockQty === 0 || product.stock === 'Hết hàng';
  const isLowStock = !isOutOfStock && stockQty <= 5;

  return (
    <div className={`product-card ${isOutOfStock ? 'card-out-of-stock' : ''}`}>
      <div className="product-img-wrapper">
        {/* Wishlist Heart Button */}
        <button
          className={`card-heart-btn ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Badge */}
        {isOutOfStock ? (
          <span className="product-badge" style={{ background: '#ef4444', color: '#fff' }}>
            Hết hàng
          </span>
        ) : isLowStock ? (
          <span className="product-badge" style={{ background: '#f59e0b', color: '#fff' }}>
            Chỉ còn {stockQty} SP
          </span>
        ) : product.badge ? (
          <span className={`product-badge ${product.badge.includes('%') ? 'badge-discount' : 'badge-new'}`}>
            {product.badge}
          </span>
        ) : null}

        <Link href={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
      </div>

      <div className="product-info">
        <Link href={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-price">{product.price}</div>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer-meta">
          <span
            className="stock-tag"
            style={{
              background: isOutOfStock ? '#fee2e2' : isLowStock ? '#fef3c7' : '#dcfce7',
              color: isOutOfStock ? '#dc2626' : isLowStock ? '#b45309' : '#15803d',
              fontWeight: 700,
            }}
          >
            {isOutOfStock
              ? '🔴 Hết hàng'
              : isLowStock
              ? `⚡ Chỉ còn ${stockQty} cái`
              : `🟢 Còn ${stockQty} SP`}
          </span>
        </div>
        <div className="card-btn-group">
          <button
            type="button"
            disabled={isOutOfStock}
            className="btn-card-action btn-add-cart-quick"
            style={{
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) addToCart(product, 1);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>{isOutOfStock ? 'Tạm hết' : '+ Giỏ hàng'}</span>
          </button>
          <Link href={`/products/${product.id}`} className="btn-card-action">
            <span>Chi tiết →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
