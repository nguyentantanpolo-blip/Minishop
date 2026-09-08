'use client';

import React, { useState, useMemo } from 'react';
import { Customer, Order } from '@/types';
import {
  IconUser,
  IconUsers,
  IconPencil,
  IconSave,
  IconPhone,
  IconMail,
  IconMapPin,
  IconKey,
  IconBriefcase,
  IconShoppingBag,
  IconClock,
  IconCheckCircle,
  IconTruck,
  IconXCircle,
  IconEye,
  IconCopy,
  IconCheck,
  IconX,
  IconFileText,
  IconCreditCard,
} from './icons';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  orders?: Order[];
  onSave: (payload: Partial<Customer>) => Promise<void> | void;
  onViewOrder?: (order: Order) => void;
}

const CustomerModalContent: React.FC<CustomerModalProps> = ({
  onClose,
  customer,
  orders = [],
  onSave,
  onViewOrder,
}) => {
  const isEdit = !!customer;

  // Form states initialized directly from props
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [role, setRole] = useState<'customer' | 'staff' | 'admin'>(customer?.role || 'customer');
  const [notes, setNotes] = useState(customer?.notes || '');
  const [activeTab, setActiveTab] = useState<'info' | 'role_notes' | 'orders'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Find customer's orders
  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders.filter((o) => {
      if (customer.phone && o.phone && o.phone.trim() === customer.phone.trim()) return true;
      if (customer.email && o.customer && o.customer.toLowerCase() === customer.email.toLowerCase()) return true;
      if (o.customer && customer.name && o.customer.trim().toLowerCase() === customer.name.trim().toLowerCase()) return true;
      return false;
    });
  }, [customer, orders]);

  // Calculate actual total spent & count
  const calculatedSpent = useMemo(() => {
    if (customer && customer.totalSpent && customer.totalSpent > 0) {
      return customer.totalSpent;
    }
    return customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [customer, customerOrders]);

  const calculatedOrdersCount = useMemo(() => {
    if (customer && customer.totalOrders && customer.totalOrders > 0) {
      return customer.totalOrders;
    }
    return customerOrders.length;
  }, [customer, customerOrders]);

  // Determine Customer Tier Badge
  const tierInfo = useMemo(() => {
    if (role === 'admin') {
      return { name: 'Quản Trị Viên', color: '#7c3aed', bg: '#f3e8ff', border: '#ddd6fe' };
    }
    if (role === 'staff') {
      return { name: 'Nhân Viên Tanpolo', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' };
    }
    if (calculatedSpent >= 5000000) {
      return { name: 'Khách Hàng VIP (Gold)', color: '#b45309', bg: '#fef3c7', border: '#fde68a' };
    }
    if (calculatedSpent >= 1000000) {
      return { name: 'Khách Thân Thiết (Silver)', color: '#059669', bg: '#d1fae5', border: '#a7f3d0' };
    }
    return { name: 'Thành Viên Mới', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' };
  }, [role, calculatedSpent]);

  const handleCopy = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        role,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-admin-card customer-modal-card">
      {/* HEADER */}
      <div className="customer-modal-header">
        <div className="customer-modal-header-title">
          <div className="customer-modal-icon-badge">
            {isEdit ? <IconPencil size={20} /> : <IconUsers size={20} />}
          </div>
          <div>
            <h2 className="customer-modal-title-text">
              {isEdit ? 'Chỉnh Sửa Hồ Sơ Khách Hàng' : 'Thêm Khách Hàng Mới Vào Hệ Thống'}
            </h2>
            <p className="customer-modal-subtitle-text">
              {isEdit
                ? `Mã hồ sơ: #${customer?.id} • Cập nhật thông tin & phân quyền thành viên`
                : 'Điền đầy đủ thông tin để lưu trữ khách hàng vào CRM Tanpolo Leather Goods'}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="customer-modal-close-btn"
          onClick={onClose}
          title="Đóng modal"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* EDIT PROFILE BANNER (Only in edit mode) */}
      {isEdit && customer && (
        <div className="customer-profile-banner">
          <div className="customer-profile-left">
            <div
              className="customer-avatar-large"
              style={{
                background:
                  role === 'admin'
                    ? 'linear-gradient(135deg, #7c3aed, #4c1d95)'
                    : role === 'staff'
                    ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                    : calculatedSpent >= 5000000
                    ? 'linear-gradient(135deg, #d97706, #92400e)'
                    : 'linear-gradient(135deg, #059669, #065f46)',
              }}
            >
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'K'}
            </div>
            <div className="customer-profile-details">
              <div className="customer-name-row">
                <span className="customer-main-name">{customer.name}</span>
                <span
                  className="customer-tier-badge"
                  style={{
                    color: tierInfo.color,
                    backgroundColor: tierInfo.bg,
                    borderColor: tierInfo.border,
                  }}
                >
                  {tierInfo.name}
                </span>
              </div>
              <div className="customer-contact-quick-links">
                {customer.phone ? (
                  <div className="customer-quick-link">
                    <IconPhone size={13} />
                    <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                    <button
                      type="button"
                      className="btn-quick-copy"
                      title="Sao chép số điện thoại"
                      onClick={() => handleCopy('phone', customer.phone || '')}
                    >
                      {copiedKey === 'phone' ? <IconCheck size={11} /> : <IconCopy size={11} />}
                    </button>
                  </div>
                ) : (
                  <span className="text-muted-xs">Chưa có số điện thoại</span>
                )}

                <span className="dot-divider">•</span>

                {customer.email ? (
                  <div className="customer-quick-link">
                    <IconMail size={13} />
                    <a href={`mailto:${customer.email}`}>{customer.email}</a>
                    <button
                      type="button"
                      className="btn-quick-copy"
                      title="Sao chép email"
                      onClick={() => handleCopy('email', customer.email || '')}
                    >
                      {copiedKey === 'email' ? <IconCheck size={11} /> : <IconCopy size={11} />}
                    </button>
                  </div>
                ) : (
                  <span className="text-muted-xs">Chưa có email</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="customer-metrics-strip">
            <div className="metric-box">
              <div className="metric-label">
                <IconCreditCard size={13} /> Tổng chi tiêu
              </div>
              <div className="metric-value spent">{formatPrice(calculatedSpent)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">
                <IconShoppingBag size={13} /> Đơn hàng
              </div>
              <div className="metric-value orders">{calculatedOrdersCount} đơn</div>
            </div>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION (in edit mode) */}
      {isEdit && (
        <div className="customer-tab-nav">
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <IconUser size={15} />
            <span>Thông tin cá nhân &amp; Liên hệ</span>
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === 'role_notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('role_notes')}
          >
            <IconKey size={15} />
            <span>Phân quyền &amp; Ghi chú CRM</span>
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <IconShoppingBag size={15} />
            <span>Lịch sử mua hàng ({customerOrders.length})</span>
          </button>
        </div>
      )}

      {/* FORM CONTENT */}
      <form onSubmit={handleSubmit} className="customer-form-body">
        {(!isEdit || activeTab === 'info') && (
          <div className="customer-tab-content fade-in">
            <div className="customer-form-grid">
              {/* Họ tên */}
              <div className="form-group span-2">
                <label className="customer-form-label">
                  <IconUser size={15} />
                  <span>Họ và tên khách hàng <strong className="text-required">(*)</strong></span>
                </label>
                <div className="customer-input-wrapper">
                  <input
                    type="text"
                    className="customer-form-input"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <span className="customer-input-hint">Tên dùng để hiển thị trên hóa đơn và đơn đặt hàng.</span>
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label className="customer-form-label">
                  <IconPhone size={15} />
                  <span>Số điện thoại liên hệ</span>
                </label>
                <div className="customer-input-wrapper">
                  <input
                    type="tel"
                    className="customer-form-input"
                    placeholder="VD: 0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <span className="customer-input-hint">Dùng để tra cứu lịch sử mua hàng và liên hệ giao hàng.</span>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="customer-form-label">
                  <IconMail size={15} />
                  <span>Địa chỉ Email</span>
                </label>
                <div className="customer-input-wrapper">
                  <input
                    type="email"
                    className="customer-form-input"
                    placeholder="VD: an.nguyen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <span className="customer-input-hint">Gửi thông báo trạng thái đơn hàng và ưu đãi Tanpolo.</span>
              </div>

              {/* Địa chỉ */}
              <div className="form-group span-2">
                <label className="customer-form-label">
                  <IconMapPin size={15} />
                  <span>Địa chỉ nhận hàng mặc định</span>
                </label>
                <div className="customer-input-wrapper">
                  <textarea
                    rows={2}
                    className="customer-form-textarea"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <span className="customer-input-hint">Địa chỉ sẽ tự động điền khi tạo đơn hàng mới cho khách này.</span>
              </div>
            </div>

            {!isEdit && (
              <div className="add-mode-additional-section">
                <div className="customer-divider" />
                {/* Phân quyền thẻ trong mode thêm */}
                <label className="customer-form-label" style={{ marginBottom: '10px' }}>
                  <IconKey size={15} />
                  <span>Phân quyền tài khoản trong hệ thống</span>
                </label>
                <div className="role-cards-grid">
                  <div
                    className={`role-card-item ${role === 'customer' ? 'selected' : ''}`}
                    onClick={() => setRole('customer')}
                  >
                    <div className="role-icon-box role-customer">
                      <IconUser size={18} />
                    </div>
                    <div className="role-card-info">
                      <div className="role-name">Khách Hàng (Customer)</div>
                      <div className="role-desc">Tài khoản thành viên mua sắm, theo dõi đơn hàng và tích lũy ưu đãi.</div>
                    </div>
                    <div className="role-radio-check">
                      {role === 'customer' && <IconCheck size={12} />}
                    </div>
                  </div>

                  <div
                    className={`role-card-item ${role === 'staff' ? 'selected' : ''}`}
                    onClick={() => setRole('staff')}
                  >
                    <div className="role-icon-box role-staff">
                      <IconBriefcase size={18} />
                    </div>
                    <div className="role-card-info">
                      <div className="role-name">Nhân Viên (Staff)</div>
                      <div className="role-desc">Quyền xem đơn hàng, hỗ trợ tư vấn khách hàng và kiểm tra kho.</div>
                    </div>
                    <div className="role-radio-check">
                      {role === 'staff' && <IconCheck size={12} />}
                    </div>
                  </div>

                  <div
                    className={`role-card-item ${role === 'admin' ? 'selected' : ''}`}
                    onClick={() => setRole('admin')}
                  >
                    <div className="role-icon-box role-admin">
                      <IconKey size={18} />
                    </div>
                    <div className="role-card-info">
                      <div className="role-name">Quản Trị Viên (Admin)</div>
                      <div className="role-desc">Toàn quyền truy cập Dashboard, chỉnh sửa sản phẩm, tài chính và cấu hình.</div>
                    </div>
                    <div className="role-radio-check">
                      {role === 'admin' && <IconCheck size={12} />}
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="customer-form-label">
                    <IconFileText size={15} />
                    <span>Ghi chú nội bộ CRM</span>
                  </label>
                  <div className="customer-input-wrapper">
                    <input
                      type="text"
                      className="customer-form-input"
                      placeholder="VD: Khách sỉ, thích đồ da bò Veg-tan mộc, liên hệ trước 18h..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isEdit && activeTab === 'role_notes' && (
          <div className="customer-tab-content fade-in">
            <div className="role-section-wrapper">
              <label className="customer-form-label" style={{ marginBottom: '12px' }}>
                <IconKey size={15} />
                <span>Vai trò &amp; Phân quyền tài khoản</span>
              </label>

              <div className="role-cards-grid">
                <div
                  className={`role-card-item ${role === 'customer' ? 'selected' : ''}`}
                  onClick={() => setRole('customer')}
                >
                  <div className="role-icon-box role-customer">
                    <IconUser size={18} />
                  </div>
                  <div className="role-card-info">
                    <div className="role-name">Khách Hàng (Customer)</div>
                    <div className="role-desc">Tài khoản thành viên mua sắm, theo dõi đơn hàng và tích lũy ưu đãi.</div>
                  </div>
                  <div className="role-radio-check">
                    {role === 'customer' && <IconCheck size={12} />}
                  </div>
                </div>

                <div
                  className={`role-card-item ${role === 'staff' ? 'selected' : ''}`}
                  onClick={() => setRole('staff')}
                >
                  <div className="role-icon-box role-staff">
                    <IconBriefcase size={18} />
                  </div>
                  <div className="role-card-info">
                    <div className="role-name">Nhân Viên (Staff)</div>
                    <div className="role-desc">Quyền xem đơn hàng, hỗ trợ tư vấn khách hàng và kiểm tra kho.</div>
                  </div>
                  <div className="role-radio-check">
                    {role === 'staff' && <IconCheck size={12} />}
                  </div>
                </div>

                <div
                  className={`role-card-item ${role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  <div className="role-icon-box role-admin">
                    <IconKey size={18} />
                  </div>
                  <div className="role-card-info">
                    <div className="role-name">Quản Trị Viên (Admin)</div>
                    <div className="role-desc">Toàn quyền truy cập Dashboard, chỉnh sửa sản phẩm, tài chính và cấu hình.</div>
                  </div>
                  <div className="role-radio-check">
                    {role === 'admin' && <IconCheck size={12} />}
                  </div>
                </div>
              </div>

              <div className="customer-divider" style={{ margin: '20px 0' }} />

              <div className="form-group">
                <label className="customer-form-label">
                  <IconFileText size={15} />
                  <span>Ghi chú chăm sóc khách hàng (CRM Notes)</span>
                </label>
                <div className="customer-input-wrapper">
                  <textarea
                    rows={3}
                    className="customer-form-textarea"
                    placeholder="Ghi lại sở thích chất liệu da, thói quen mua sắm, lưu ý đặc biệt khi đóng gói quà..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <span className="customer-input-hint">Ghi chú này chỉ hiển thị với Quản trị viên và Nhân viên nội bộ Tanpolo.</span>
              </div>
            </div>
          </div>
        )}

        {isEdit && activeTab === 'orders' && (
          <div className="customer-tab-content fade-in">
            {customerOrders.length > 0 ? (
              <div className="customer-orders-table-wrapper">
                <table className="customer-orders-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Thời gian</th>
                      <th>Sản phẩm</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <strong className="order-id-code">#{ord.id}</strong>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {ord.date}
                        </td>
                        <td>
                          <div className="order-items-snippet">
                            {ord.items && ord.items.length > 0 ? (
                              <span>
                                {ord.items[0].name}
                                {ord.items.length > 1 && ` (+${ord.items.length - 1} khác)`}
                              </span>
                            ) : (
                              'Đơn hàng'
                            )}
                          </div>
                        </td>
                        <td>
                          <strong className="order-total-price">{ord.totalFormatted}</strong>
                        </td>
                        <td>
                          <span className={`badge-status-${ord.status}`}>
                            {ord.status === 'pending' && <IconClock size={12} />}
                            {ord.status === 'shipping' && <IconTruck size={12} />}
                            {ord.status === 'completed' && <IconCheckCircle size={12} />}
                            {ord.status === 'cancelled' && <IconXCircle size={12} />}
                            <span>{ord.statusText}</span>
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {onViewOrder && (
                            <button
                              type="button"
                              className="btn-customer-view-order"
                              onClick={() => {
                                onClose();
                                onViewOrder(ord);
                              }}
                              title="Xem chi tiết đơn hàng này"
                            >
                              <IconEye size={13} /> Xem đơn
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="customer-no-orders-box">
                <div className="empty-icon-circle">
                  <IconShoppingBag size={28} />
                </div>
                <h4>Khách hàng chưa có đơn hàng nào</h4>
                <p>Các đơn hàng được đặt bằng số điện thoại hoặc tài khoản này sẽ tự động xuất hiện tại đây.</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="customer-modal-footer">
          <div className="footer-tip">
            {isEdit ? 'Mọi thay đổi sẽ được đồng bộ ngay lập tức vào cơ sở dữ liệu.' : 'Trường đánh dấu (*) là bắt buộc.'}
          </div>
          <div className="footer-btn-group">
            <button
              type="button"
              className="btn-customer-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-customer-submit"
              disabled={isSubmitting}
            >
              <IconSave size={15} />
              <span>
                {isSubmitting
                  ? 'Đang xử lý...'
                  : isEdit
                  ? 'Cập nhật thông tin khách'
                  : 'Lưu & Tạo khách hàng mới'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const CustomerModal: React.FC<CustomerModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <CustomerModalContent key={props.customer?.id || 'new_customer'} {...props} />
    </div>
  );
};
