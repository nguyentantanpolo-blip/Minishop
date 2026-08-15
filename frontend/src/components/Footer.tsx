'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('⚠️ Vui lòng nhập địa chỉ email hợp lệ!', 'warning');
      return;
    }
    showToast('🎉 Cảm ơn bạn đã đăng ký nhận ưu đãi từ Mini Shop!', 'success');
    setEmail('');
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link href="/" className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Mini Shop</span>
            </Link>
            <p className="footer-desc">
              Sản phẩm đồ dùng & trang trí thủ công tinh tế, tối giản, mang lại sự ấm cúng cho ngôi nhà của bạn.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Youtube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Khám Phá</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Trang chủ</Link></li>
              <li><Link href="/products">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?cat=noithat">Nội thất phòng khách</Link></li>
              <li><Link href="/products?cat=trangtri">Đồ decor trang trí</Link></li>
              <li><Link href="/products?cat=den">Đèn chiếu sáng</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-col-title">Chính Sách</h4>
            <ul className="footer-links-list">
              <li><a href="#">Chính sách đổi trả 7 ngày</a></li>
              <li><a href="#">Giao hàng & thanh toán</a></li>
              <li><a href="#">Bảo hành sản phẩm 12T</a></li>
              <li><a href="#">Bảo mật thông tin</a></li>
              <li><Link href="/admin">Khu vực quản trị</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Đăng Ký Nhận Tin</h4>
            <p className="footer-desc" style={{ margin: '0 0 12px 0' }}>
              Nhận voucher giảm 10% cho đơn hàng đầu tiên cùng ưu đãi hấp dẫn mỗi tuần.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Nhập email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="newsletter-btn">
                Gửi
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>© {new Date().getFullYear()} Mini Shop. All rights reserved. Thiết kế hiện đại cho tổ ấm của bạn.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách riêng tư</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
