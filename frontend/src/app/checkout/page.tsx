'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, shippingFee, cartTotal, clearCart } = useCart();
  const { placeOrder, formatPrice } = useShop();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullname, setFullname] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !createdOrder) {
    return (
      <main className="container" style={{ paddingBottom: '60px' }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="separator">/</span>
          <Link href="/cart">Giỏ hàng</Link>
          <span className="separator">/</span>
          <span className="current">Thanh toán</span>
        </nav>

        <div className="empty-cart-card">
          <h2>Không có sản phẩm nào để thanh toán</h2>
          <p>Vui lòng chọn sản phẩm vào giỏ hàng trước khi tiến hành đặt hàng.</p>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            Mua sắm ngay
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      showToast('⚠️ Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!', 'warning');
      return;
    }

    const newOrder = placeOrder({
      customer: fullname.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      items: cart,
      paymentMethod,
    });

    clearCart();
    setCreatedOrder(newOrder);
  };

  return (
    <main className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <Link href="/cart">Giỏ hàng</Link>
        <span className="separator">/</span>
        <span className="current">Thanh toán</span>
      </nav>

      <div className="checkout-layout-grid">
        {/* Left Column: Form */}
        <div className="checkout-form-card">
          <h2 className="cart-card-title" style={{ marginBottom: '20px' }}>
            Thông tin nhận hàng
          </h2>

          <form onSubmit={handleSubmitOrder}>
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="chk-name">
                  Họ và tên người nhận <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="chk-name"
                  className="form-input"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chk-phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="chk-phone"
                  className="form-input"
                  placeholder="Ví dụ: 0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chk-email">
                Địa chỉ Email
              </label>
              <input
                type="email"
                id="chk-email"
                className="form-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chk-address">
                Địa chỉ giao hàng chi tiết <span className="required">*</span>
              </label>
              <input
                type="text"
                id="chk-address"
                className="form-input"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chk-notes">
                Ghi chú đơn hàng (tùy chọn)
              </label>
              <textarea
                id="chk-notes"
                className="form-input"
                rows={2}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '24px 0' }} />

            <h2 className="cart-card-title" style={{ marginBottom: '16px' }}>
              Phương thức thanh toán
            </h2>

            <div className="payment-methods-list">
              <label className="payment-radio-card">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                  <span className="payment-desc">
                    Thanh toán tiền mặt trực tiếp cho bưu tá khi nhận được hàng.
                  </span>
                </div>
              </label>

              <label className="payment-radio-card">
                <input
                  type="radio"
                  name="payment"
                  value="QR Banking"
                  checked={paymentMethod === 'QR Banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-name">Chuyển khoản VietQR / Banking</span>
                  <span className="payment-desc">
                    Quét mã QR qua ứng dụng ngân hàng đối soát thanh toán tức thì.
                  </span>
                </div>
              </label>

              <label className="payment-radio-card">
                <input
                  type="radio"
                  name="payment"
                  value="Thẻ ATM / Visa"
                  checked={paymentMethod === 'Thẻ ATM / Visa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-name">Thẻ ATM / Visa, Mastercard</span>
                  <span className="payment-desc">
                    Cổng thanh toán thẻ nội địa và quốc tế bảo mật 100%.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="btn-checkout-primary"
              style={{ height: '50px', fontSize: '1rem' }}
            >
              Xác nhận đặt hàng ({formatPrice(cartTotal)})
            </button>
          </form>
        </div>

        {/* Right Column: Review */}
        <div className="order-summary-card">
          <h2 className="cart-card-title">Đơn hàng của bạn ({cart.length} món)</h2>

          <div className="checkout-items-preview">
            {cart.map((item) => (
              <div key={item.id} className="checkout-item-preview-row">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-name-box">
                  <div className="checkout-item-name">{item.name}</div>
                  <div className="checkout-item-qty-tag">Số lượng: {item.quantity}</div>
                </div>
                <div className="checkout-item-price">
                  {formatPrice(item.priceValue * item.quantity)}
                </div>
              </div>
            ))}
          </div>

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

          <div className="summary-total-row">
            <span className="total-label">Tổng thanh toán</span>
            <span className="total-price">{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {createdOrder && (
        <div className="modal-overlay open">
          <div className="order-success-card">
            <div className="modal-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 className="modal-title">Đặt hàng thành công! 🎉</h2>
            <div className="modal-order-id-badge">{createdOrder.id}</div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Cảm ơn bạn đã mua sắm tại Mini Shop. Đơn hàng đã được lưu và gửi đến hệ thống quản trị!
            </p>

            <div className="modal-details-box">
              <div><strong>Người nhận:</strong> {createdOrder.customer}</div>
              <div><strong>Số điện thoại:</strong> {createdOrder.phone}</div>
              <div><strong>Địa chỉ giao:</strong> {createdOrder.address}</div>
              <div><strong>Phương thức:</strong> {createdOrder.paymentMethod}</div>
              <div><strong>Tổng tiền thanh toán:</strong> <span className="text-green">{createdOrder.totalFormatted}</span></div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => router.push('/')}
              style={{ width: '100%', justifyContent: 'center', height: '46px' }}
            >
              Quay về Trang chủ
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
