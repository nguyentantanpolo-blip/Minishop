'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { Product, Order } from '@/types';

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    updateOrderStatus,
    formatPrice,
  } = useShop();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  // Product Filter State
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('all');

  // Product Modal State
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalCategory, setModalCategory] = useState('noithat');
  const [modalStock, setModalStock] = useState('Còn hàng');
  const [modalPrice, setModalPrice] = useState<number | ''>('');
  const [modalOldPrice, setModalOldPrice] = useState<number | ''>('');
  const [modalBadge, setModalBadge] = useState('Mới');
  const [modalImage, setModalImage] = useState('/assets/images/binh-gom-decor.jpg');
  const [modalDesc, setModalDesc] = useState('');

  // Order Filter & Detail State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Computed metrics
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = prodCategory === 'all' || p.category === prodCategory;
    const q = prodSearch.toLowerCase().trim();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchQ = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalName('');
    setModalCategory('noithat');
    setModalStock('Còn hàng');
    setModalPrice('');
    setModalOldPrice('');
    setModalBadge('Mới');
    setModalImage('/assets/images/binh-gom-decor.jpg');
    setModalDesc('');
    setIsProdModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalName(p.name);
    setModalCategory(p.category);
    setModalStock(p.stock || 'Còn hàng');
    setModalPrice(p.priceValue);
    setModalOldPrice(p.oldPrice ? parseInt(p.oldPrice.replace(/\D/g, '')) : '');
    setModalBadge(p.badge || '');
    setModalImage(p.image);
    setModalDesc(p.desc);
    setIsProdModalOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalPrice || !modalDesc.trim()) return;

    const catNameMap: Record<string, string> = {
      noithat: 'Nội thất',
      trangtri: 'Trang trí',
      den: 'Đèn',
      luutru: 'Lưu trữ',
      phongngu: 'Phòng ngủ',
    };

    const priceVal = Number(modalPrice);
    const oldPriceVal = modalOldPrice ? Number(modalOldPrice) : 0;
    const formattedPrice = formatPrice(priceVal);
    const formattedOldPrice = oldPriceVal > priceVal ? formatPrice(oldPriceVal) : undefined;
    const discount = oldPriceVal > priceVal ? `-${Math.round((1 - priceVal / oldPriceVal) * 100)}%` : undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: modalName.trim(),
        category: modalCategory,
        categoryName: catNameMap[modalCategory] || modalCategory,
        stock: modalStock,
        price: formattedPrice,
        priceValue: priceVal,
        oldPrice: formattedOldPrice,
        discount,
        badge: modalBadge.trim() || undefined,
        image: modalImage.trim(),
        desc: modalDesc.trim(),
      });
    } else {
      addProduct({
        name: modalName.trim(),
        category: modalCategory,
        categoryName: catNameMap[modalCategory] || modalCategory,
        stock: modalStock,
        price: formattedPrice,
        priceValue: priceVal,
        oldPrice: formattedOldPrice,
        discount,
        badge: modalBadge.trim() || 'Mới',
        image: modalImage.trim(),
        desc: modalDesc.trim(),
        specs: {
          material: 'Chất liệu cao cấp',
          origin: 'Việt Nam',
        },
      });
    }

    setIsProdModalOpen(false);
  };

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="separator">/</span>
        <span className="current">Bảng quản trị Admin</span>
      </nav>

      {/* Admin Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-area">
          <h1>Khu Vực Quản Trị Hệ Thống 🔑</h1>
          <p>Quản lý danh mục sản phẩm, theo dõi đơn hàng và xem thống kê doanh thu</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/" className="btn-header btn-login">
            ← Về trang khách
          </Link>
          <button
            onClick={() => logout()}
            className="btn-header"
            style={{ backgroundColor: '#ef4444', color: '#fff', borderColor: 'transparent' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span>📊 Tổng quan</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span>📦 Quản lý sản phẩm</span>
          <span className="admin-tab-badge">{products.length}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span>🛒 Quản lý đơn hàng</span>
          <span className="admin-tab-badge">{orders.length}</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Stat Cards */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Tổng doanh thu</div>
                <div className="stat-value">{formatPrice(totalRevenue)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Đơn hàng mới</div>
                <div className="stat-value">{orders.length} đơn</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Sản phẩm trong kho</div>
                <div className="stat-value">{products.length} món</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Tài khoản khách hàng</div>
                <div className="stat-value">156 người</div>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="admin-table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="cart-card-title" style={{ marginBottom: 0 }}>Đơn hàng mới nhận gần đây</h2>
              <button
                type="button"
                className="section-link"
                onClick={() => setActiveTab('orders')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span>Xem tất cả đơn hàng →</span>
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.phone}</td>
                    <td><strong style={{ color: 'var(--primary-hover)' }}>{formatPrice(order.total)}</strong></td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={
                        order.status === 'completed' ? 'badge-status-completed' :
                        order.status === 'shipping' ? 'badge-status-shipping' :
                        order.status === 'cancelled' ? 'badge-status-cancelled' : 'badge-status-pending'
                      }>
                        {order.statusText}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn-action-sm btn-action-view"
                        onClick={() => setViewingOrder(order)}
                        title="Xem chi tiết đơn"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PRODUCTS MANAGEMENT (CRUD) */}
      {/* ===================================================================== */}
      {activeTab === 'products' && (
        <div>
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              {/* Search */}
              <div className="admin-search-box">
                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              {/* Category Filter */}
              <select
                className="admin-select"
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="noithat">Nội thất</option>
                <option value="trangtri">Trang trí</option>
                <option value="den">Đèn</option>
                <option value="luutru">Lưu trữ</option>
                <option value="phongngu">Phòng ngủ</option>
              </select>
            </div>

            <div className="admin-toolbar-right">
              <button
                type="button"
                className="btn-admin-reset"
                onClick={() => {
                  if (confirm('Khôi phục 8 sản phẩm gốc ban đầu?')) {
                    resetProducts();
                  }
                }}
                title="Khôi phục 8 sản phẩm gốc"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>Khôi phục mẫu</span>
              </button>

              <button
                type="button"
                className="btn-admin-add"
                onClick={handleOpenAdd}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>+ Thêm sản phẩm</span>
              </button>
            </div>
          </div>

          <div className="admin-table-card">
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Mã SP</th>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Giá gốc / Giảm</th>
                    <th>Tồn kho</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td><code>{product.id}</code></td>
                      <td>
                        <div className="admin-prod-cell">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="admin-prod-thumb"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/binh-gom-decor.jpg'; }}
                          />
                          <div>
                            <div className="admin-prod-title">{product.name}</div>
                            <div className="admin-prod-desc">{product.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag-subtle">{product.categoryName}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary-hover)', fontSize: '0.95rem' }}>
                          {product.price}
                        </strong>
                      </td>
                      <td>
                        {product.oldPrice ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '6px' }}>
                              {product.oldPrice}
                            </span>
                            <span className="badge-discount" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                              {product.discount}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        {product.stock === 'Hết hàng' ? (
                          <span className="badge-stock-out">● Hết hàng</span>
                        ) : (
                          <span className="badge-stock-in">● Còn hàng</span>
                        )}
                      </td>
                      <td>
                        <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-action-sm btn-action-edit"
                            onClick={() => handleOpenEdit(product)}
                            title="Sửa sản phẩm"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn-action-sm btn-action-delete"
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            title="Xóa sản phẩm"
                          >
                            🗑️
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="btn-action-sm btn-action-view"
                            title="Xem trên shop"
                          >
                            👁️
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ORDERS MANAGEMENT */}
      {/* ===================================================================== */}
      {activeTab === 'orders' && (
        <div>
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <div className="admin-search-box">
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên, SĐT..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              <select
                className="admin-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Thành công</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="admin-table-card">
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Không tìm thấy đơn hàng nào phù hợp.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>SĐT / Địa chỉ</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái đơn</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.date}</td>
                      <td><strong>{order.customer}</strong></td>
                      <td>
                        <div>{order.phone}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.address}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary-hover)' }}>
                          {formatPrice(order.total)}
                        </strong>
                      </td>
                      <td>
                        <span className="category-tag-subtle">{order.paymentMethod}</span>
                      </td>
                      <td>
                        <select
                          className="status-dropdown-select"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        >
                          <option value="pending">⏳ Đang xử lý</option>
                          <option value="shipping">🚚 Đang giao</option>
                          <option value="completed">✅ Thành công</option>
                          <option value="cancelled">❌ Đã hủy</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-action-sm btn-action-view"
                          onClick={() => setViewingOrder(order)}
                          title="Xem chi tiết đơn"
                        >
                          📋
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ===================================================================== */}
      {isProdModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-admin-card">
            <div className="modal-admin-header">
              <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsProdModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProductForm}>
              <div className="modal-admin-body">
                <div className="form-group">
                  <label className="form-label">
                    Tên sản phẩm <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Đèn bàn gốm Vintage"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">
                      Danh mục <span className="required">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                    >
                      <option value="noithat">Nội thất</option>
                      <option value="trangtri">Trang trí</option>
                      <option value="den">Đèn</option>
                      <option value="luutru">Lưu trữ</option>
                      <option value="phongngu">Phòng ngủ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tình trạng kho</label>
                    <select
                      className="form-input"
                      value={modalStock}
                      onChange={(e) => setModalStock(e.target.value)}
                    >
                      <option value="Còn hàng">Còn hàng</option>
                      <option value="Hết hàng">Hết hàng</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">
                      Giá bán (VNĐ) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ví dụ: 450000"
                      min={1000}
                      step={1000}
                      value={modalPrice}
                      onChange={(e) => setModalPrice(e.target.value ? Number(e.target.value) : '')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giá gốc (nếu có)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ví dụ: 550000"
                      min={0}
                      step={1000}
                      value={modalOldPrice}
                      onChange={(e) => setModalOldPrice(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Huy hiệu (Badge)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ví dụ: Mới, Hot, -15%"
                      value={modalBadge}
                      onChange={(e) => setModalBadge(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chọn ảnh mẫu có sẵn</label>
                    <select
                      className="form-input"
                      onChange={(e) => {
                        if (e.target.value) setModalImage(e.target.value);
                      }}
                    >
                      <option value="">-- Chọn ảnh trong kho --</option>
                      <option value="/assets/images/sofa-nordic.jpg">Sofa Nordic</option>
                      <option value="/assets/images/ban-an-go-soi.jpg">Bàn ăn gỗ sồi</option>
                      <option value="/assets/images/den-tha-tran.jpg">Đèn thả trần</option>
                      <option value="/assets/images/binh-gom-decor.jpg">Bình gốm decor</option>
                      <option value="/assets/images/ke-go-da-nang.jpg">Kệ gỗ đa năng</option>
                      <option value="/assets/images/gio-may-luu-tru.jpg">Giỏ mây lưu trữ</option>
                      <option value="/assets/images/chau-cay-canh.jpg">Chậu cây cảnh</option>
                      <option value="/assets/images/bo-ga-goi-cotton.jpg">Bộ ga gối cotton</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Đường dẫn ảnh (URL hoặc /assets/images/...) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalImage}
                    onChange={(e) => setModalImage(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <img
                    src={modalImage}
                    alt="Preview"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/binh-gom-decor.jpg'; }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Xem trước ảnh đại diện</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Mô tả sản phẩm <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Mô tả chất liệu, thiết kế, công dụng của sản phẩm..."
                    value={modalDesc}
                    onChange={(e) => setModalDesc(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-admin-footer">
                <button
                  type="button"
                  className="btn-test"
                  onClick={() => setIsProdModalOpen(false)}
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-checkout-primary"
                  style={{ width: 'auto', padding: '10px 24px' }}
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ORDER DETAILS */}
      {/* ===================================================================== */}
      {viewingOrder && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '680px' }}>
            <div className="modal-admin-header">
              <h3>Chi tiết đơn hàng {viewingOrder.id}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingOrder(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-admin-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã đơn hàng:</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>{viewingOrder.id}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ngày đặt:</div>
                  <strong>{viewingOrder.date}</strong>
                </div>
              </div>

              <div className="modal-details-box">
                <div><strong>Người nhận:</strong> {viewingOrder.customer}</div>
                <div><strong>Số điện thoại:</strong> {viewingOrder.phone}</div>
                <div><strong>Địa chỉ giao:</strong> {viewingOrder.address}</div>
                <div><strong>Phương thức thanh toán:</strong> {viewingOrder.paymentMethod}</div>
                <div>
                  <strong>Trạng thái:</strong>{' '}
                  <span className={
                    viewingOrder.status === 'completed' ? 'badge-status-completed' :
                    viewingOrder.status === 'shipping' ? 'badge-status-shipping' :
                    viewingOrder.status === 'cancelled' ? 'badge-status-cancelled' : 'badge-status-pending'
                  }>
                    {viewingOrder.statusText}
                  </span>
                </div>
                {viewingOrder.notes && <div><strong>Ghi chú:</strong> {viewingOrder.notes}</div>}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '8px 0' }}>
                Danh sách sản phẩm ({viewingOrder.items.length} món)
              </h4>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table className="admin-table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th style={{ textAlign: 'right' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                              onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/binh-gom-decor.jpg'; }}
                            />
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                          </div>
                        </td>
                        <td>{item.price}</td>
                        <td>x{item.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-hover)' }}>
                          {formatPrice(item.priceValue * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                  <strong>{formatPrice(viewingOrder.subtotal || viewingOrder.total)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                  <strong className={viewingOrder.shippingFee === 0 ? 'text-green' : ''}>
                    {viewingOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(viewingOrder.shippingFee || 0)}
                  </strong>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <strong>Tổng thanh toán:</strong>
                  <strong style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                    {formatPrice(viewingOrder.total)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-admin-footer">
              <button
                type="button"
                className="btn-checkout-primary"
                onClick={() => setViewingOrder(null)}
                style={{ width: 'auto', padding: '8px 20px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
