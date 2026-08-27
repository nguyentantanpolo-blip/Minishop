'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            {/* Brand Logo */}
            <Link href="/" className="brand-logo" aria-label="Mini Shop Homepage">
              <div className="brand-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="brand-name">
                Mini<span className="logo-highlight">Shop</span>
              </span>
            </Link>

            {/* Navigation Menu (Capsule Pill Design) */}
            <nav className="nav-wrapper" aria-label="Main Navigation">
              <ul className="nav-links">
                <li>
                  <Link href="/" className={pathname === '/' ? 'active' : ''}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/products" className={pathname.startsWith('/products') ? 'active' : ''}>
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="/#about">Giới thiệu</Link>
                </li>
                <li>
                  <Link href="/#contact">Liên hệ</Link>
                </li>
              </ul>
            </nav>

            {/* Search Bar */}
            <form className="header-search" onSubmit={handleSearchSubmit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchVal('')}
                  aria-label="Xóa tìm kiếm"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </form>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Wishlist Button */}
              <Link href="/wishlist" className="btn-icon-header wishlist-btn" title="Danh sách yêu thích" aria-label="Yêu thích">
                <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#e11d48' : 'none'} stroke={wishlistCount > 0 ? '#e11d48' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
              </Link>

              {/* Cart Button */}
              <Link href="/cart" className="btn-cart-header" title="Giỏ hàng" aria-label="Giỏ hàng">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-text">Giỏ hàng</span>
                <span className="cart-badge">{cartCount}</span>
              </Link>

              {/* User / Auth */}
              <div className="auth-actions">
                {user ? (
                  <div className="user-logged-in-group">
                    <Link
                      href={isAdmin ? '/admin' : '#'}
                      className="user-chip"
                      title={user.email}
                    >
                      <span className="user-chip-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="user-chip-name">{user.name}</span>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin" className="btn-auth-admin" title="Vào trang quản trị">
                        Quản trị
                      </Link>
                    )}

                    <button
                      onClick={() => logout()}
                      className="btn-auth-logout"
                      title="Đăng xuất"
                    >
                      Thoát
                    </button>
                  </div>
                ) : (
                  <div className="guest-actions-group">
                    <Link href="/login" className="btn-auth-login">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="btn-auth-register">
                      Đăng ký
                    </Link>
                    <Link href="/admin" className="btn-auth-admin" title="Bảng quản trị Admin">
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <form className="mobile-search-form" onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>

        <ul className="mobile-nav-links">
          <li>
            <Link href="/" onClick={() => setMobileOpen(false)} className={pathname === '/' ? 'active' : ''}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link href="/products" onClick={() => setMobileOpen(false)} className={pathname.startsWith('/products') ? 'active' : ''}>
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
              Yêu thích
              {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
            </Link>
          </li>
          <li>
            <Link href="/cart" onClick={() => setMobileOpen(false)}>
              Giỏ hàng
              <span className="cart-badge">{cartCount}</span>
            </Link>
          </li>
          <li>
            <Link href="/admin" onClick={() => setMobileOpen(false)}>
              Quản trị hệ thống
            </Link>
          </li>
        </ul>

        <div className="mobile-actions">
          {user ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <span className="user-chip-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <div>
                  <div className="mobile-user-name">{user.name}</div>
                  <div className="mobile-user-email">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="btn-auth-logout"
                style={{ width: '100%', justifyContent: 'center', height: '38px', borderRadius: '10px' }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="mobile-guest-btns">
              <Link href="/login" className="btn-auth-login" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: 'center', height: '40px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-auth-register" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: 'center', height: '40px', borderRadius: '10px' }}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

