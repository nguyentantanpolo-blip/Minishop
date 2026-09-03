'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { IconGmail, IconFacebook, IconZalo } from '@/components/icons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ!', 'warning');
      return;
    }
    showToast('Cảm ơn bạn đã đăng ký nhận thông tin từ TANPOLO!', 'success');
    setEmail('');
  };

  return (
    <footer className="site-footer" id="footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Column 1: Brand & Company Details */}
          <div className="footer-company-col">
            <div className="tanpolo-logo-wrap">
              <Link href="/" className="tanpolo-logo-link" aria-label="Tanpolo Homepage">
                {/* Tanpolo Crest Logo */}
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tanpolo-crest-svg"
                >
                  {/* 5-point Crown */}
                  <g stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <circle cx="18" cy="11" r="1.3" fill="#1a1a1a" />
                    <circle cx="29" cy="6.5" r="1.3" fill="#1a1a1a" />
                    <circle cx="40" cy="5" r="1.6" fill="#1a1a1a" />
                    <circle cx="51" cy="6.5" r="1.3" fill="#1a1a1a" />
                    <circle cx="62" cy="11" r="1.3" fill="#1a1a1a" />
                    <path
                      d="M17 15 L18 12 L29 7.8 L33 14.5 L40 6.2 L47 14.5 L51 7.8 L62 12 L63 15 Z"
                      fill="#1a1a1a"
                    />
                    <line x1="16" y1="16.5" x2="64" y2="16.5" strokeWidth="2" />
                  </g>

                  {/* Shield Crest */}
                  <rect
                    x="15"
                    y="20"
                    width="50"
                    height="50"
                    rx="4"
                    stroke="#1a1a1a"
                    strokeWidth="2.2"
                    fill="none"
                  />

                  {/* Horse Profile & Dynamic Diagonal Stripes */}
                  <g stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    {/* Horse Head */}
                    <path d="M26 40 C26 31 31 25 42 25 C47 25 54 28 54 32 C54 35 48 37 44 38 C40 39 36 43 36 48" />
                    <circle cx="46" cy="30" r="1" fill="#1a1a1a" />
                    <path d="M44 28 C47 27 50 27 52 29" strokeWidth="1.5" />
                    {/* Dynamic Parallel Stripes */}
                    <line x1="22" y1="52" x2="43" y2="52" strokeWidth="2.2" />
                    <line x1="22" y1="57" x2="48" y2="57" strokeWidth="2.2" />
                    <line x1="22" y1="62" x2="52" y2="62" strokeWidth="2.2" />
                  </g>
                </svg>

                <div className="tanpolo-logo-text">
                  <span className="tanpolo-brand-title">TANPOLO</span>
                  <div className="tanpolo-brand-since">
                    <span className="since-line"></span>
                    <span className="since-text">SINCE 1992s</span>
                    <span className="since-line"></span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="company-info-block">
              <h3 className="company-title">CÔNG TY TNHH GIÀY NHẬT HUY</h3>
              <p className="company-text">MST: 0319013067</p>
              <p className="company-text">
                985/71/5 Hương Lộ 2, Phường Bình Trị Đông, TP Hồ Chí Minh, Việt Nam
              </p>
              <p className="company-text company-phone">
                <a href="tel:0988444806">098 844 48 06</a>
              </p>
            </div>

            {/* Social & Contact Channels */}
            <div className="footer-social-channels">
              {/* Gmail */}
              <a
                href="mailto:tanpolo.shoes@gmail.com"
                className="social-channel-item"
                title="Gửi Gmail cho Tanpolo (tanpolo.shoes@gmail.com)"
                aria-label="Gmail Tanpolo"
              >
                <div className="social-icon-box email-box">
                  <IconGmail size={24} />
                </div>
                <span className="social-channel-label">Gmail</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/tanpolovietnam"
                target="_blank"
                rel="noopener noreferrer"
                className="social-channel-item"
                title="Facebook Tanpolo Vietnam"
                aria-label="Facebook Tanpolo"
              >
                <div className="social-icon-box facebook-box">
                  <IconFacebook size={22} color="#ffffff" />
                </div>
                <span className="social-channel-label">Facebook</span>
              </a>

              {/* Zalo */}
              <a
                href="https://zalo.me/0988444806"
                target="_blank"
                rel="noopener noreferrer"
                className="social-channel-item"
                title="Zalo Chat: 098 844 48 06"
                aria-label="Zalo Tanpolo"
              >
                <div className="social-icon-box zalo-box">
                  <IconZalo size={44} />
                </div>
                <span className="social-channel-label">Zalo</span>
              </a>
            </div>
          </div>

          {/* Column 2: HƯỚNG DẪN */}
          <div className="footer-links-col">
            <h4 className="footer-heading">HƯỚNG DẪN</h4>
            <ul className="footer-links-group">
              <li>
                <Link href="/products">Hướng dẫn mua hàng</Link>
              </li>
              <li>
                <Link href="/checkout">Giao nhận và thanh toán</Link>
              </li>
              <li>
                <Link href="/cart">Tra cứu đơn hàng</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CHÍNH SÁCH */}
          <div className="footer-links-col">
            <h4 className="footer-heading">CHÍNH SÁCH</h4>
            <ul className="footer-links-group">
              <li>
                <Link href="/chinh-sach/cham-soc-khach-hang">Chăm sóc khách hàng</Link>
              </li>
              <li>
                <Link href="/chinh-sach/bao-hanh">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link href="/chinh-sach/doi-tra-hang">Chính sách đổi hàng</Link>
              </li>
              <li>
                <Link href="/chinh-sach/thanh-toan">Chính sách thanh toán</Link>
              </li>
              <li>
                <Link href="/chinh-sach/van-chuyen">Chính sách vận chuyển</Link>
              </li>
              <li>
                <Link href="/chinh-sach/bao-mat">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ĐĂNG KÝ NHẬN THÔNG TIN */}
          <div className="footer-newsletter-col">
            <h4 className="footer-heading">ĐĂNG KÝ NHẬN THÔNG TIN</h4>
            <p className="newsletter-description">
              Nhận thông tin sản phẩm mới nhất, tin khuyến mãi và nhiều hơn nữa.
            </p>

            <form className="tanpolo-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="tanpolo-newsletter-input"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email của bạn"
              />
              <button type="submit" className="tanpolo-newsletter-submit-btn">
                ĐĂNG KÝ
              </button>
            </form>

            {/* Bộ Công Thương Badge */}
            <div className="bo-cong-thuong-wrapper">
              <a
                href="http://online.gov.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="bo-cong-thuong-link"
                title="Đã thông báo Bộ Công Thương"
              >
                <svg
                  width="180"
                  height="54"
                  viewBox="0 0 180 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="bct-badge-svg"
                >
                  {/* Left Circle Seal */}
                  <circle cx="27" cy="27" r="23" fill="#0088cc" />
                  <circle cx="27" cy="27" r="25" stroke="#0088cc" strokeWidth="2" fill="none" />
                  <circle cx="27" cy="27" r="20" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
                  {/* Checkmark in circle */}
                  <path
                    d="M17 26.5 L24 33.5 L37 18.5"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Text around circle */}
                  <text
                    x="27"
                    y="12"
                    fill="#ffffff"
                    fontSize="5"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    letterSpacing="0.8"
                  >
                    ONLINE.GOV.VN
                  </text>

                  {/* Right Blue Badge Box */}
                  <rect x="52" y="10" width="124" height="34" rx="4" fill="#0088cc" />
                  <text
                    x="114"
                    y="23"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                    letterSpacing="0.4"
                  >
                    ĐÃ THÔNG BÁO
                  </text>
                  <text
                    x="114"
                    y="36"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                    letterSpacing="0.6"
                  >
                    BỘ CÔNG THƯƠNG
                  </text>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Divider */}
        <div className="footer-bottom-bar">
          <div suppressHydrationWarning>© {new Date().getFullYear()} TANPOLO - Công ty TNHH Giày Nhật Huy. All rights reserved.</div>
          <div className="footer-bottom-links">
            <Link href="/admin">Quản trị viên</Link>
            <span>•</span>
            <a href="#footer">Điều khoản</a>
            <span>•</span>
            <a href="#footer">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
