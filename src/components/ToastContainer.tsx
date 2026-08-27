'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            animation: 'slideUpToast 0.25s ease',
            borderLeft: toast.type === 'success'
              ? '4px solid #22c55e'
              : toast.type === 'warning'
              ? '4px solid #f59e0b'
              : toast.type === 'error'
              ? '4px solid #ef4444'
              : '4px solid #3b82f6',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
