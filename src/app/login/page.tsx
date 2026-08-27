'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin } = useAuth();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(account, password);
    if (success) {
      if (account.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  const handleQuick = (role: 'user' | 'admin') => {
    quickLogin(role);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <main className="container">
      <div className="auth-page-layout">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-header-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary-color)' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Mini Shop</span>
            </Link>
            <h1 className="auth-title">Chào mừng trở lại!</h1>
            <p className="auth-subtitle">Đăng nhập để trải nghiệm mua sắm & quản lý</p>
          </div>

          {/* Quick 1-Click Test Box */}
          <div className="quick-test-box">
            <div className="quick-test-title">💡 Đăng nhập thử nhanh (1 Click)</div>
            <div className="quick-test-btns">
              <button
                type="button"
                className="btn-test btn-test-user"
                onClick={() => handleQuick('user')}
              >
                👤 Khách hàng
              </button>
              <button
                type="button"
                className="btn-test btn-test-admin"
                onClick={() => handleQuick('admin')}
              >
                🔑 Quản trị viên
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-acc">
                Email hoặc Tên đăng nhập
              </label>
              <input
                type="text"
                id="login-acc"
                className="form-input"
                placeholder="user@minishop.vn hoặc admin"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="login-pwd" style={{ marginBottom: 0 }}>
                  Mật khẩu
                </label>
                <a href="#" style={{ fontSize: '0.775rem', color: 'var(--accent-blue)' }}>
                  Quên mật khẩu?
                </a>
              </div>
              <input
                type="password"
                id="login-pwd"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-checkout-primary"
              style={{ height: '46px', fontSize: '0.95rem', marginTop: '10px' }}
            >
              Đăng nhập ngay
            </button>
          </form>

          <div className="auth-footer-link">
            Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
