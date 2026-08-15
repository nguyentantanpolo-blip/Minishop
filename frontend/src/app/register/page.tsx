'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('❌ Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!', 'error');
      return;
    }

    const success = register(fullname, email, password);
    if (success) {
      router.push('/');
    }
  };

  return (
    <main className="container">
      <div className="auth-page-layout">
        <div className="auth-card" style={{ maxWidth: '480px' }}>
          <div className="auth-header">
            <Link href="/" className="auth-header-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary-color)' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Mini Shop</span>
            </Link>
            <h1 className="auth-title">Tạo tài khoản mới</h1>
            <p className="auth-subtitle">Đăng ký thành viên để nhận ngay nhiều ưu đãi đặc biệt</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                id="reg-name"
                className="form-input"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-mail">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="reg-mail"
                  className="form-input"
                  placeholder="nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-tel">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="reg-tel"
                  className="form-input"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-pwd">
                  Mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="reg-pwd"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-cpwd">
                  Xác nhận <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="reg-cpwd"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-checkout-primary"
              style={{ height: '46px', fontSize: '0.95rem', marginTop: '10px' }}
            >
              Đăng ký tài khoản
            </button>
          </form>

          <div className="auth-footer-link">
            Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
