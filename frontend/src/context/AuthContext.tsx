'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession } from '@/types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserSession | null;
  login: (account: string, pass: string) => boolean;
  quickLogin: (role: 'user' | 'admin') => void;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}
    setMounted(true);
  }, []);

  const saveUser = (u: UserSession | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem('minishop_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('minishop_user');
      }
    } catch (e) {}
  };

  const login = (account: string, pass: string): boolean => {
    if (!account.trim() || !pass.trim()) {
      showToast('⚠️ Vui lòng nhập đầy đủ thông tin đăng nhập!', 'warning');
      return false;
    }

    const isAdminRole = account.toLowerCase().includes('admin');
    const newUser: UserSession = {
      name: isAdminRole ? 'Quản Trị Viên' : (account.split('@')[0] || 'Khách Hàng'),
      email: account.includes('@') ? account : 'admin@minishop.vn',
      role: isAdminRole ? 'admin' : 'user',
    };

    saveUser(newUser);
    showToast(`🎉 Đăng nhập thành công! Chào mừng ${newUser.name}`, 'success');
    return true;
  };

  const quickLogin = (role: 'user' | 'admin') => {
    const newUser: UserSession = role === 'admin'
      ? { name: 'Quản Trị Viên', email: 'admin@minishop.vn', role: 'admin' }
      : { name: 'Nguyễn Văn A', email: 'user@minishop.vn', role: 'user' };

    saveUser(newUser);
    showToast(`⚡ Đăng nhập nhanh với vai trò: ${role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Khách Hàng'}`, 'success');
  };

  const register = (name: string, email: string, pass: string): boolean => {
    if (!name.trim() || !email.trim() || !pass.trim()) {
      showToast('⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc!', 'warning');
      return false;
    }

    const newUser: UserSession = {
      name: name.trim(),
      email: email.trim(),
      role: 'user',
    };

    saveUser(newUser);
    showToast('🎉 Đăng ký tài khoản thành công!', 'success');
    return true;
  };

  const logout = () => {
    saveUser(null);
    showToast('👋 Đã đăng xuất khỏi tài khoản.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        login,
        quickLogin,
        register,
        logout,
        isAdmin: mounted ? user?.role === 'admin' : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
