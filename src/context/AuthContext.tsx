'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserSession | null>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUserSession(
  email: string | undefined,
  fullName: string | undefined,
  role: 'user' | 'admin'
): UserSession {
  return {
    name: fullName || (email ? email.split('@')[0] : 'Khách Hàng'),
    email: email || '',
    role,
  };
}

async function resolveRole(email: string | undefined): Promise<'user' | 'admin'> {
  if (!email) return 'user';
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('role')
      .eq('email', email)
      .maybeSingle();
    if (!error && data && (data.role === 'admin' || data.role === 'staff')) {
      return 'admin';
    }
  } catch {
    /* ignore lookup failure, fall through to 'user' */
  }
  return 'user';
}

async function buildSession(
  email: string | undefined,
  fullName: string | undefined
): Promise<UserSession> {
  const role = await resolveRole(email);
  return toUserSession(email, fullName, role);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session) {
        const u = data.session.user;
        const session = await buildSession(u.email, u.user_metadata?.full_name);
        if (active) setUser(session);
      }
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const u = session.user;
        const next = await buildSession(u.email, u.user_metadata?.full_name);
        if (active) setUser(next);
      } else {
        if (active) setUser(null);
      }
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<UserSession | null> => {
    if (!email.trim() || !password.trim()) {
      showToast('Vui lòng nhập đầy đủ email và mật khẩu!', 'warning');
      return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      showToast(error.message || 'Đăng nhập thất bại!', 'error');
      return null;
    }

    const session = await buildSession(data.user?.email, data.user?.user_metadata?.full_name);
    setUser(session);
    showToast(`Đăng nhập thành công! Chào mừng ${session.name}`, 'success');
    return session;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'warning');
      return false;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) {
      showToast(error.message || 'Đăng ký thất bại!', 'error');
      return false;
    }

    if (data.session) {
      const session = await buildSession(data.user?.email, name.trim());
      setUser(session);
      showToast('Đăng ký tài khoản thành công!', 'success');
    } else {
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.', 'success');
    }

    return true;
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(error.message || 'Đăng xuất thất bại!', 'error');
      return;
    }
    setUser(null);
    showToast('Đã đăng xuất khỏi tài khoản.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
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
