'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { IconCheckCircle, IconInfo, IconWarning, IconXCircle } from '@/components/icons';

const TOAST_ICON: Record<string, { icon: (p: { size?: number }) => React.JSX.Element; color: string }> = {
  success: { icon: IconCheckCircle, color: '#22c55e' },
  info: { icon: IconInfo, color: '#3b82f6' },
  warning: { icon: IconWarning, color: '#f59e0b' },
  error: { icon: IconXCircle, color: '#ef4444' },
};

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
      {toasts.map((toast) => {
        const variant = TOAST_ICON[toast.type || 'info'] || TOAST_ICON.info;
        const Icon = variant.icon;
        return (
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
              borderLeft: `4px solid ${variant.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: variant.color, display: 'inline-flex', flexShrink: 0 }}>
              <Icon size={18} />
            </span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
