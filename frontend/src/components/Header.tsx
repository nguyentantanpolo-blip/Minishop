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
            <Link href="/" className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Mini Shop</span>
            </Link>

            {/* Navigation Menu */}
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

            {/* Search Bar */}
            <form className="header-search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </form>

            {/* Header Actions */}
            <div className="header-actions">
              <Link href="/wishlist" className="btn-header" aria-label="Yêu thích">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Yêu thích</span>
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
              </Link>

              <Link href="/cart" className="btn-header" aria-label="Giỏ hàng">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Giỏ hàng</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>

              {user ? (
                <>
                  <Link
                    href={isAdmin ? '/admin' : '#'}
                    className="btn-header btn-login"
                  >
                    {isAdmin ? `🔑 ${user.name}` : `👤 ${user.name}`}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="btn-header btn-admin">
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="btn-header"
                    style={{ backgroundColor: '#ef4444', color: '#fff', borderColor: 'transparent' }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-header btn-login">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="btn-header btn-register">
                    Đăng ký
                  </Link>
                  <Link href="/admin" className="btn-header btn-admin">
                    Quản trị
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link href="/" onClick={() => setMobileOpen(false)}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link href="/products" onClick={() => setMobileOpen(false)}>
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
              Yêu thích ({wishlistCount})
            </Link>
          </li>
          <li>
            <Link href="/cart" onClick={() => setMobileOpen(false)}>
              Giỏ hàng ({cartCount})
            </Link>
          </li>
          <li>
            <Link href="/admin" onClick={() => setMobileOpen(false)}>
              Bảng quản trị Admin
            </Link>
          </li>
        </ul>
        <div className="mobile-actions">
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="btn-header"
              style={{ backgroundColor: '#ef4444', color: '#fff' }}
            >
              Đăng xuất ({user.name})
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-header btn-login" onClick={() => setMobileOpen(false)}>
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-header btn-register" onClick={() => setMobileOpen(false)}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
