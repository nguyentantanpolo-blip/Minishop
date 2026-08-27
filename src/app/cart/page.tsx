'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useShop } from '@/context/ShopContext';
import { IconSparkles } from '@/components/icons';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    cartSubtotal,
    shippingFee,
    cartTotal,
  } = useCart();
  const { formatPrice } = useShop();

  if (cart.length === 0) {
    return (
      <main className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="separator">/</span>
          <span className="current">Giỏ hàng</span>
        </nav>

        <div className="empty-cart-card">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy khám phá các sản phẩm tuyệt vời của Mini Shop và thêm vào giỏ hàng ngay!</p>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            Khám phá sản phẩm ngay
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <span className="current">Giỏ hàng</span>
      </nav>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-card">
          <div className="cart-header-row">
            <h2 className="cart-card-title">Sản phẩm trong giỏ ({cart.length})</h2>
            <button
              type="button"
              className="btn-clear-cart"
              onClick={() => clearCart()}
            >
              Xóa tất cả
            </button>
          </div>

          <div className="cart-items-table">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <Link href={`/products/${item.id}`} className="cart-item-img-wrapper">
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="cart-item-info">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="cart-item-title">{item.name}</h3>
                  </Link>
                  <span className="cart-item-category">{item.categoryName || 'Sản phẩm'}</span>
                  <div className="cart-item-unit-price">{item.price}</div>
                </div>

                {/* Stepper */}
                <div className="cart-item-qty">
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal for Item */}
                <div className="cart-item-total">
                  {formatPrice(item.priceValue * item.quantity)}
                </div>

                {/* Remove button */}
                <div className="cart-item-actions">
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id)}
                    title="Xóa khỏi giỏ"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link href="/products" className="section-link">
              <span>← Tiếp tục mua hàng</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="order-summary-card">
          <h2 className="cart-card-title">Tóm tắt đơn hàng</h2>

          <div className="summary-row" style={{ marginTop: '16px' }}>
            <span className="summary-label">Tạm tính</span>
            <span className="summary-value">{formatPrice(cartSubtotal)}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Phí vận chuyển</span>
            <span className={`summary-value ${shippingFee === 0 ? 'text-green' : ''}`}>
              {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
            </span>
          </div>

          {shippingFee > 0 ? (
            <div className="shipping-hint-box">
              Mua thêm <strong>{formatPrice(500000 - cartSubtotal)}</strong> để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>!
            </div>
          ) : (
            <div className="shipping-hint-box text-green" style={{ backgroundColor: 'var(--primary-light)' }}>
              <IconSparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Đơn hàng của bạn đủ điều kiện <strong>Freeship toàn quốc</strong>!
            </div>
          )}

          <div className="summary-total-row">
            <span className="total-label">Tổng cộng</span>
            <span className="total-price">{formatPrice(cartTotal)}</span>
          </div>

          <button
            type="button"
            className="btn-checkout-primary"
            onClick={() => router.push('/checkout')}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </main>
  );
}
