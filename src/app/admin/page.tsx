'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { Product, Category, Order, Customer, CartItem } from '@/types';

// Helper to convert selected file from user device to Base64 Data URL
const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, JPEG, WEBP, GIF)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh từ thiết bị'));
    reader.readAsDataURL(file);
  });
};

// Inline SVG icons (no emoji), inherit color via currentColor
type IconProps = { size?: number };

const IconRefresh = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

const IconTrash = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconUpload = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 9l5-5 5 5" />
    <line x1="12" y1="4" x2="12" y2="15" />
  </svg>
);

const IconPlus = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconSave = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

const IconImage = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const IconEdit = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
  </svg>
);

export default function AdminPage() {
  const {
    products,
    categories,
    orders,
    customers,
    stats,
    isLoading,
    isBackendConnected,
    refreshData,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    placeOrder,
    adjustStock,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    formatPrice,
  } = useShop();

  const { user, isAdmin, quickLogin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'inventory' | 'orders' | 'customers'>('overview');

  // =========================================================================
  // Product Filter & Modal State
  // =========================================================================
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('all');
  const [prodStockFilter, setProdStockFilter] = useState('all');

  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [modalName, setModalName] = useState('');
  const [modalCategory, setModalCategory] = useState('giay-tay');
  const [modalStock, setModalStock] = useState('Còn hàng');
  const [modalStockQuantity, setModalStockQuantity] = useState<number | ''>(50);
  const [modalPrice, setModalPrice] = useState<number | ''>('');
  const [modalOldPrice, setModalOldPrice] = useState<number | ''>('');
  const [modalBadge, setModalBadge] = useState('Mới');
  const [modalImage, setModalImage] = useState('/assets/images/products/bo5-1.jpg');
  const [modalImageFileName, setModalImageFileName] = useState('');
  const [isDraggingMainImage, setIsDraggingMainImage] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [modalDesc, setModalDesc] = useState('');
  const [modalMaterial, setModalMaterial] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalDimensions, setModalDimensions] = useState('');
  const [modalOrigin, setModalOrigin] = useState('Việt Nam - Tanpolo');
  const [modalGallery, setModalGallery] = useState<string[]>([]);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // =========================================================================
  // Category Filter & Modal State
  // =========================================================================
  const [catSearch, setCatSearch] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalCatId, setModalCatId] = useState('');
  const [modalCatName, setModalCatName] = useState('');
  const [modalCatDesc, setModalCatDesc] = useState('');
  const [modalCatImage, setModalCatImage] = useState('/assets/images/products/bo5-1.jpg');
  const [modalCatImageFileName, setModalCatImageFileName] = useState('');
  const [isDraggingCatImage, setIsDraggingCatImage] = useState(false);
  const catImageInputRef = useRef<HTMLInputElement>(null);

  // =========================================================================
  // Order Filter & Detail State
  // =========================================================================
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isOrderEditModalOpen, setIsOrderEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editOrderCustomer, setEditOrderCustomer] = useState('');
  const [editOrderPhone, setEditOrderPhone] = useState('');
  const [editOrderAddress, setEditOrderAddress] = useState('');
  const [editOrderNotes, setEditOrderNotes] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState<Order['status']>('pending');

  // Manual Order Creation State
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState('COD');
  const [manualSelectedProdId, setManualSelectedProdId] = useState('');
  const [manualProdQty, setManualProdQty] = useState(1);
  const [manualCartItems, setManualCartItems] = useState<CartItem[]>([]);

  // =========================================================================
  // Inventory Filter & Stock Adjustment State
  // =========================================================================
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('all');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [inventorySort, setInventorySort] = useState<'default' | 'qty_asc' | 'qty_desc' | 'val_desc' | 'name_asc'>('default');

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract' | 'set'>('add');
  const [adjustQtyValue, setAdjustQtyValue] = useState<number | ''>(10);
  const [adjustReason, setAdjustReason] = useState('Nhập hàng từ xưởng sản xuất');
  const [customReason, setCustomReason] = useState('');


  // =========================================================================
  // Customer Filter & Modal State
  // =========================================================================
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custRole, setCustRole] = useState<'customer' | 'admin' | 'staff'>('customer');
  const [custNotes, setCustNotes] = useState('');

  // =========================================================================
  // Image File Upload Handlers (No typing URLs)
  // =========================================================================
  const handleMainImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const file = files[0];
      const dataUrl = await readFileAsDataUrl(file);
      setModalImage(dataUrl);
      setModalImageFileName(file.name);
    } catch (err: any) {
      alert(err.message || 'Lỗi đọc file ảnh');
    }
  };

  const handleGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await readFileAsDataUrl(file);
        newUrls.push(dataUrl);
      }
      setModalGallery((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      alert(err.message || 'Lỗi tải ảnh thư viện');
    }
  };

  const handleCatImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const file = files[0];
      const dataUrl = await readFileAsDataUrl(file);
      setModalCatImage(dataUrl);
      setModalCatImageFileName(file.name);
    } catch (err: any) {
      alert(err.message || 'Lỗi đọc file ảnh');
    }
  };

  // =========================================================================
  // AUTH GUARD: User is not admin
  // =========================================================================
  if (!user || !isAdmin) {
    return (
      <main className="container" style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '540px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-dark)' }}>
            Khu Vực Quản Trị Hệ Thống (Admin Only)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Tài khoản khách hàng thông thường không có quyền truy cập hoặc quản lý.
            Vui lòng đăng nhập với tài khoản <strong>Quản trị viên (Admin)</strong> để sử dụng bảng điều khiển.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="btn-auth-register"
              onClick={() => quickLogin('admin')}
              style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '0.9rem' }}
            >
              ⚡ Đăng nhập nhanh quyền Quản Trị Viên
            </button>

            <Link
              href="/"
              style={{ textAlign: 'center', border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.875rem' }}
            >
              ← Quay về Trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // Metrics & Calculations
  // =========================================================================
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const shippingOrders = orders.filter((o) => o.status === 'shipping');

  const totalInventoryUnits = products.reduce((sum, p) => sum + (p.stockQuantity !== undefined ? p.stockQuantity : 50), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.priceValue * (p.stockQuantity !== undefined ? p.stockQuantity : 50)), 0);
  const lowStockProducts = products.filter((p) => {
    const qty = p.stockQuantity !== undefined ? p.stockQuantity : 50;
    return qty > 0 && qty <= 5;
  });
  const outOfStockProducts = products.filter((p) => {
    const qty = p.stockQuantity !== undefined ? p.stockQuantity : 50;
    return qty === 0 || p.stock === 'Hết hàng';
  });

  const filteredProducts = products.filter((p) => {
    const matchCat = prodCategory === 'all' || p.category === prodCategory;
    const matchStock = prodStockFilter === 'all' ||
      (prodStockFilter === 'in_stock' && p.stock !== 'Hết hàng') ||
      (prodStockFilter === 'out_of_stock' && p.stock === 'Hết hàng');

    const q = prodSearch.toLowerCase().trim();
    const matchQ = !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.specs?.material && p.specs.material.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q));

    return matchCat && matchStock && matchQ;
  });

  const filteredCategories = categories.filter((c) => {
    const q = catSearch.toLowerCase().trim();
    return !q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
  });

  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    return matchStatus && (!q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q));
  });


  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.toLowerCase().trim();
    return !q ||
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q));
  });

  const filteredInventory = products.filter((p) => {
    const q = inventorySearch.toLowerCase().trim();
    const matchQ = !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q));
    const matchCat = inventoryCatFilter === 'all' || p.category === inventoryCatFilter;
    const qty = p.stockQuantity !== undefined ? p.stockQuantity : 50;
    let matchStatus = true;
    if (inventoryStatusFilter === 'in_stock') matchStatus = qty > 5;
    else if (inventoryStatusFilter === 'low_stock') matchStatus = qty > 0 && qty <= 5;
    else if (inventoryStatusFilter === 'out_of_stock') matchStatus = qty === 0;

    return matchQ && matchCat && matchStatus;
  }).sort((a, b) => {
    const qtyA = a.stockQuantity !== undefined ? a.stockQuantity : 50;
    const qtyB = b.stockQuantity !== undefined ? b.stockQuantity : 50;
    if (inventorySort === 'qty_asc') return qtyA - qtyB;
    if (inventorySort === 'qty_desc') return qtyB - qtyA;
    if (inventorySort === 'val_desc') return (b.priceValue * qtyB) - (a.priceValue * qtyA);
    if (inventorySort === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  // =========================================================================
  // Product Handlers
  // =========================================================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setModalName('');
    setModalCategory(categories[0]?.id || 'giay-tay');
    setModalStock('Còn hàng');
    setModalStockQuantity(50);
    setModalPrice('');
    setModalOldPrice('');
    setModalBadge('Mới');
    setModalImage('/assets/images/products/bo5-1.jpg');
    setModalImageFileName('bo5-1.jpg (Mặc định)');
    setModalDesc('');
    setModalMaterial('Da bò thật 100% nguyên tấm');
    setModalColor('Đen / Nâu');
    setModalDimensions('Size 38 - 44');
    setModalOrigin('Việt Nam - Tanpolo');
    setModalGallery(['/assets/images/products/bo5-1.jpg', '/assets/images/products/bo5-2.jpg']);
    setIsProdModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setModalName(p.name);
    setModalCategory(p.category);
    setModalStock(p.stock || 'Còn hàng');
    setModalStockQuantity(p.stockQuantity !== undefined ? p.stockQuantity : 50);
    setModalPrice(p.priceValue);
    setModalOldPrice(p.oldPrice ? parseInt(p.oldPrice.replace(/\D/g, '')) : '');
    setModalBadge(p.badge || '');
    setModalImage(p.image);
    setModalImageFileName(p.name);
    setModalDesc(p.desc);
    setModalMaterial(p.specs?.material || '');
    setModalColor(p.specs?.color || '');
    setModalDimensions(p.specs?.dimensions || '');
    setModalOrigin(p.specs?.origin || 'Việt Nam - Tanpolo');
    setModalGallery(p.specs?.gallery && p.specs.gallery.length > 0 ? p.specs.gallery : [p.image]);
    setIsProdModalOpen(true);
  };

  const handleCloneProduct = (p: Product) => {
    const clonedName = `${p.name} (Bản sao)`;
    addProduct({
      name: clonedName,
      category: p.category,
      categoryName: p.categoryName,
      stock: p.stock,
      stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 50,
      price: p.price,
      priceValue: p.priceValue,
      oldPrice: p.oldPrice,
      discount: p.discount,
      badge: 'Bản sao',
      image: p.image,
      desc: p.desc,
      specs: p.specs,
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    setModalGallery(modalGallery.filter((_, i) => i !== index));
  };

  const handleToggleStockQuick = (p: Product) => {
    const nextStock = p.stock === 'Còn hàng' ? 'Hết hàng' : 'Còn hàng';
    updateProduct(p.id, { stock: nextStock });
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalPrice || !modalDesc.trim()) return;

    const matchedCat = categories.find((c) => c.id === modalCategory);
    const categoryName = matchedCat ? matchedCat.name : modalCategory;

    const priceVal = Number(modalPrice);
    const oldPriceVal = modalOldPrice ? Number(modalOldPrice) : 0;
    const formattedPrice = formatPrice(priceVal);
    const formattedOldPrice = oldPriceVal > priceVal ? formatPrice(oldPriceVal) : undefined;
    const discount = oldPriceVal > priceVal ? `-${Math.round((1 - priceVal / oldPriceVal) * 100)}%` : undefined;

    const finalMainImage = modalImage.trim() || '/assets/images/products/bo5-1.jpg';
    const finalGallery = modalGallery.length > 0 ? modalGallery : [finalMainImage];
    const qty = modalStockQuantity !== '' ? Math.max(0, Number(modalStockQuantity)) : 50;

    let derivedStock = modalStock;
    if (qty === 0) derivedStock = 'Hết hàng';
    else if (qty <= 5) derivedStock = 'Sắp hết hàng';
    else if (!derivedStock || derivedStock === 'Hết hàng') derivedStock = 'Còn hàng';

    const productPayload = {
      name: modalName.trim(),
      category: modalCategory,
      categoryName,
      stock: derivedStock,
      stockQuantity: qty,
      price: formattedPrice,
      priceValue: priceVal,
      oldPrice: formattedOldPrice,
      discount,
      badge: modalBadge.trim() || undefined,
      image: finalMainImage,
      desc: modalDesc.trim(),
      specs: {
        material: modalMaterial.trim() || 'Da bò cao cấp',
        color: modalColor.trim() || undefined,
        dimensions: modalDimensions.trim() || undefined,
        origin: modalOrigin.trim() || 'Việt Nam - Tanpolo',
        gallery: finalGallery,
      },
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProdModalOpen(false);
  };

  // =========================================================================
  // Inventory Handlers
  // =========================================================================
  const handleOpenAdjustModal = (product: Product, type: 'add' | 'subtract' | 'set' = 'add') => {
    setAdjustingProduct(product);
    setAdjustType(type);
    setAdjustQtyValue(type === 'set' ? (product.stockQuantity !== undefined ? product.stockQuantity : 50) : 10);
    setAdjustReason(
      type === 'add'
        ? 'Nhập hàng từ xưởng sản xuất'
        : type === 'subtract'
        ? 'Xuất hàng hỏng / lỗi tiêu hủy'
        : 'Kiểm kê kho định kỳ'
    );
    setCustomReason('');
    setIsAdjustModalOpen(true);
  };

  const handleQuickAdjustDelta = (product: Product, delta: number) => {
    adjustStock(product.id, {
      changeQuantity: delta,
      reason: delta > 0 ? `Tăng nhanh +${delta} SP` : `Giảm nhanh ${delta} SP`,
    });
  };

  const handleSaveAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || adjustQtyValue === '') return;

    const val = Number(adjustQtyValue);
    const finalReason = adjustReason === 'Khác' ? (customReason.trim() || 'Điều chỉnh kho') : adjustReason;

    if (adjustType === 'set') {
      await adjustStock(adjustingProduct.id, {
        newQuantity: val,
        reason: finalReason,
      });
    } else if (adjustType === 'add') {
      await adjustStock(adjustingProduct.id, {
        changeQuantity: val,
        reason: finalReason,
      });
    } else if (adjustType === 'subtract') {
      await adjustStock(adjustingProduct.id, {
        changeQuantity: -val,
        reason: finalReason,
      });
    }

    setIsAdjustModalOpen(false);
  };

  // =========================================================================
  // Category Handlers
  // =========================================================================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setModalCatId('');
    setModalCatName('');
    setModalCatDesc('');
    setModalCatImage('/assets/images/products/bo5-1.jpg');
    setModalCatImageFileName('bo5-1.jpg (Mặc định)');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setModalCatId(cat.id);
    setModalCatName(cat.name);
    setModalCatDesc(cat.description || '');
    setModalCatImage(cat.image || '/assets/images/products/bo5-1.jpg');
    setModalCatImageFileName(cat.name);
    setIsCatModalOpen(true);
  };

  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCatId.trim() || !modalCatName.trim()) return;

    const cleanId = modalCatId.trim().toLowerCase().replace(/\s+/g, '-');
    const finalCatImage = modalCatImage.trim() || '/assets/images/products/bo5-1.jpg';

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: modalCatName.trim(),
        description: modalCatDesc.trim(),
        image: finalCatImage,
      });
    } else {
      addCategory({
        id: cleanId,
        name: modalCatName.trim(),
        description: modalCatDesc.trim(),
        image: finalCatImage,
      });
    }

    setIsCatModalOpen(false);
  };

  // =========================================================================
  // Order Handlers
  // =========================================================================
  const handleOpenEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditOrderCustomer(order.customer);
    setEditOrderPhone(order.phone);
    setEditOrderAddress(order.address);
    setEditOrderNotes(order.notes || '');
    setEditOrderStatus(order.status);
    setIsOrderEditModalOpen(true);
  };

  const handleSaveOrderEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder || !editOrderCustomer.trim() || !editOrderPhone.trim() || !editOrderAddress.trim()) return;

    updateOrder(editingOrder.id, {
      customer: editOrderCustomer.trim(),
      phone: editOrderPhone.trim(),
      address: editOrderAddress.trim(),
      notes: editOrderNotes.trim(),
      status: editOrderStatus,
    });

    setIsOrderEditModalOpen(false);
  };

  const handleOpenManualOrderModal = () => {
    setManualCustomer('');
    setManualPhone('');
    setManualAddress('');
    setManualNotes('');
    setManualPaymentMethod('COD');
    setManualSelectedProdId(products[0]?.id || '');
    setManualProdQty(1);
    setManualCartItems([]);
    setIsManualOrderModalOpen(true);
  };

  const handleAddManualItem = () => {
    const p = products.find((prod) => prod.id === manualSelectedProdId);
    if (!p) return;

    const existingIndex = manualCartItems.findIndex((item) => item.id === p.id);
    if (existingIndex >= 0) {
      const copy = [...manualCartItems];
      copy[existingIndex].quantity += manualProdQty;
      setManualCartItems(copy);
    } else {
      setManualCartItems([
        ...manualCartItems,
        {
          id: p.id,
          name: p.name,
          price: p.price,
          priceValue: p.priceValue,
          image: p.image,
          quantity: manualProdQty,
          categoryName: p.categoryName,
        },
      ]);
    }
  };

  const handleRemoveManualItem = (index: number) => {
    setManualCartItems(manualCartItems.filter((_, i) => i !== index));
  };

  const handleSaveManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomer.trim() || !manualPhone.trim() || !manualAddress.trim() || manualCartItems.length === 0) return;

    await placeOrder({
      customer: manualCustomer.trim(),
      phone: manualPhone.trim(),
      address: manualAddress.trim(),
      notes: manualNotes.trim(),
      items: manualCartItems,
      paymentMethod: manualPaymentMethod,
    });

    setIsManualOrderModalOpen(false);
  };

  const handlePrintOrder = (order: Order) => {
    window.print();
  };


  // =========================================================================
  // Customer Handlers
  // =========================================================================
  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setCustRole('customer');
    setCustNotes('');
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (c: Customer) => {
    setEditingCustomer(c);
    setCustName(c.name);
    setCustEmail(c.email || '');
    setCustPhone(c.phone || '');
    setCustAddress(c.address || '');
    setCustRole(c.role || 'customer');
    setCustNotes(c.notes || '');
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    const payload = {
      name: custName.trim(),
      email: custEmail.trim() || undefined,
      phone: custPhone.trim() || undefined,
      address: custAddress.trim() || undefined,
      role: custRole,
      notes: custNotes.trim() || undefined,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, payload);
    } else {
      addCustomer(payload);
    }

    setIsCustomerModalOpen(false);
  };

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚙️</span>
            <div>
              <h1>Bảng Quản Trị Hệ Thống MiniShop</h1>
              <p>
                Quản lý toàn diện Sản phẩm, Danh mục, Đơn hàng, Mã giảm giá & Khách hàng
                {isBackendConnected ? (
                  <span style={{ marginLeft: '10px', color: '#16a34a', fontWeight: 600, fontSize: '0.8rem' }}>
                    ● Đang kết nối Supabase Cloud Live
                  </span>
                ) : (
                  <span style={{ marginLeft: '10px', color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem' }}>
                    ● Chế độ Offline Cache
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => refreshData()}
            className="btn-admin-reset"
            title="Đồng bộ dữ liệu mới nhất từ Database"
          >
            🔄 Đồng bộ DB
          </button>
          <button
            onClick={() => logout()}
            className="btn-auth-logout"
            style={{ height: '36px', padding: '0 14px', borderRadius: '8px' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span>📊 Tổng quan & Báo cáo</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span>👞 Sản phẩm</span>
          <span className="admin-tab-badge">{products.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <span>📁 Danh mục</span>
          <span className="admin-tab-badge">{categories.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span>📊 Quản lý tồn kho</span>
          <span
            className="admin-tab-badge"
            style={lowStockProducts.length > 0 ? { background: '#f59e0b', color: '#fff' } : {}}
          >
            {lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length}` : `${totalInventoryUnits} SP`}
          </span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span>📦 Đơn hàng</span>
          <span className="admin-tab-badge">{orders.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <span>👥 Khách hàng</span>
          <span className="admin-tab-badge">{customers.length}</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: TỔNG QUAN (OVERVIEW)
          ===================================================================== */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Tổng doanh thu thực nhận</div>
                <div className="stat-value" style={{ color: '#059669' }}>
                  {formatPrice(totalRevenue)}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>
                <div className="stat-label">Tổng số đơn hàng</div>
                <div className="stat-value">{orders.length} đơn</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {completedOrders.length} hoàn thành · {pendingOrders.length} chờ xử lý
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Sản phẩm & Tồn kho</div>
                <div className="stat-value">{products.length} SP</div>
                <div style={{ fontSize: '0.75rem', color: outOfStockProducts.length > 0 ? '#ef4444' : '#16a34a', fontWeight: 600 }}>
                  {outOfStockProducts.length > 0 ? `⚠️ ${outOfStockProducts.length} SP hết hàng` : '✅ Tất cả còn hàng'}
                </div>
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
                <div className="stat-label">Khách hàng hệ thống</div>
                <div className="stat-value">{customers.length} khách</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {customers.filter((c) => (c.totalOrders || 0) > 0).length} khách đã có đơn hàng
                </div>
              </div>
            </div>
          </div>

          {/* Grid 2 Columns: Category distribution + Best sellers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {/* Category Breakdown Card */}
            <div className="admin-table-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-dark)' }}>
                📁 Phân bố sản phẩm theo danh mục
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.id).length;
                  const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>
                        <span>{c.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count} sản phẩm ({percent}%)</span>
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="admin-table-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-dark)' }}>
                ⚡ Lối tắt thao tác nhanh
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => { setActiveTab('products'); handleOpenAddProduct(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px' }}
                >
                  ➕ Thêm sản phẩm
                </button>
                <button
                  onClick={() => { setActiveTab('inventory'); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#d97706' }}
                >
                  📊 Quản lý tồn kho
                </button>
                <button
                  onClick={() => { setActiveTab('orders'); handleOpenManualOrderModal(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#059669' }}
                >
                  📦 Tạo đơn thủ công
                </button>
                <button
                  onClick={() => { setActiveTab('customers'); handleOpenAddCustomer(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#8b5cf6' }}
                >
                  👥 Thêm khách hàng
                </button>
              </div>

              {lowStockProducts.length > 0 && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '0.825rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: '#b45309' }}>
                    ⚠️ Cảnh báo tồn kho: Có {lowStockProducts.length} sản phẩm sắp hết hàng
                  </div>
                  <div style={{ color: '#92400e', marginBottom: '8px' }}>
                    {lowStockProducts.slice(0, 2).map(p => `${p.name} (${p.stockQuantity || 0} cái)`).join(', ')}...
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    style={{ background: '#d97706', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Xem & Nhập kho ngay →
                  </button>
                </div>
              )}

              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.825rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#0f172a' }}>🛡️ Trạng thái cơ sở dữ liệu Supabase</div>
                <div style={{ color: '#64748b' }}>
                  PostgreSQL Session Pooler v16 | RLS Policies Active | IPv4 Supported | Đồng bộ tự động thời gian thực.
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="admin-table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                📦 Đơn hàng gần đây
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Xem tất cả đơn hàng →
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <div>{order.customer}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.date}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{order.totalFormatted}</td>
                    <td>
                      <span className={`badge-status-${order.status}`}>{order.statusText}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-action-sm"
                        title="Xem chi tiết"
                        onClick={() => setViewingOrder(order)}
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: QUẢN LÝ SẢN PHẨM (PRODUCTS CRUD)
          ===================================================================== */}
      {activeTab === 'products' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <div className="admin-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm theo tên SP, mã SKU, chất liệu..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({products.filter((p) => p.category === c.id).length})
                  </option>
                ))}
              </select>

              <select
                className="admin-select"
                value={prodStockFilter}
                onChange={(e) => setProdStockFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái kho</option>
                <option value="in_stock">Còn hàng ({products.filter((p) => p.stock !== 'Hết hàng').length})</option>
                <option value="out_of_stock">Hết hàng ({products.filter((p) => p.stock === 'Hết hàng').length})</option>
              </select>
            </div>

            <div className="admin-toolbar-right">
              <button className="btn-admin-add" onClick={handleOpenAddProduct}>
                <span>➕ Thêm sản phẩm mới</span>
              </button>
              <button className="btn-admin-reset" onClick={resetProducts} title="Khôi phục 19 sản phẩm đồ da chuẩn">
                🔄 Dữ liệu mẫu
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Giá gốc</th>
                  <th>Kho hàng</th>
                  <th>Nhãn</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-prod-cell">
                        <img src={p.image} alt={p.name} className="admin-prod-thumb" />
                        <div>
                          <div className="admin-prod-title">{p.name}</div>
                          <div className="admin-prod-desc">Mã: {p.id} · {p.specs?.material || p.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {p.categoryName || p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#059669' }}>{p.price}</span>
                    </td>
                    <td>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {p.oldPrice || '—'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStockQuick(p)}
                        className={p.stock === 'Hết hàng' ? 'badge-stock-out' : 'badge-stock-in'}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Nhấp để đổi trạng thái kho nhanh"
                      >
                        {p.stock === 'Hết hàng' ? 'Hết hàng' : 'Còn hàng'}
                      </button>
                    </td>
                    <td>
                      {p.badge ? (
                        <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 700 }}>
                          {p.badge}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-action-sm"
                          title="Nhân bản sản phẩm"
                          onClick={() => handleCloneProduct(p)}
                        >
                          📋
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Chỉnh sửa sản phẩm"
                          onClick={() => handleOpenEditProduct(p)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Xóa sản phẩm"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          style={{ color: '#ef4444' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: QUẢN LÝ DANH MỤC (CATEGORIES CRUD)
          ===================================================================== */}
      {activeTab === 'categories' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <div className="admin-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm danh mục..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-toolbar-right">
              <button className="btn-admin-add" onClick={handleOpenAddCategory}>
                <span>📁 Thêm danh mục mới</span>
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {filteredCategories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <div key={c.id} style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                    <img src={c.image || '/assets/images/products/bo5-1.jpg'} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>
                      {count} Sản phẩm
                    </span>
                  </div>

                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>{c.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>Mã Slug: <code>{c.id}</code></div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', flex: 1, marginBottom: '16px' }}>
                      {c.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                      <button
                        onClick={() => handleOpenEditCategory(c)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

            {/* Inventory Management Tab content */}
      {activeTab === 'inventory' && (
        <div>
          {/* Inventory 4 KPI Cards */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <div className="stat-label">Tổng số lượng hàng tồn</div>
                <div className="stat-value" style={{ color: '#2563eb' }}>
                  {totalInventoryUnits} chiếc
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Trải đều trên {products.length} mã sản phẩm
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <div className="stat-label">Giá trị vốn hàng tồn kho</div>
                <div className="stat-value" style={{ color: '#059669' }}>
                  {formatPrice(totalInventoryValue)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Định giá theo giá niêm yết bán lẻ
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon-wrapper"
                style={{ background: '#fef3c7', color: '#d97706' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <div className="stat-label">Cảnh báo sắp hết hàng</div>
                <div className="stat-value" style={{ color: lowStockProducts.length > 0 ? '#d97706' : '#16a34a' }}>
                  {lowStockProducts.length} SP
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Còn từ 1 đến 5 chiếc trong kho
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon-wrapper"
                style={{ background: '#fee2e2', color: '#dc2626' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div>
                <div className="stat-label">Sản phẩm đã hết hàng</div>
                <div className="stat-value" style={{ color: outOfStockProducts.length > 0 ? '#dc2626' : '#16a34a' }}>
                  {outOfStockProducts.length} SP
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Tồn kho = 0, cần nhập hàng ngay
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left" style={{ flexWrap: 'wrap', gap: '10px' }}>
              <div className="admin-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm sản phẩm theo tên, mã SP..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={inventoryCatFilter}
                onChange={(e) => setInventoryCatFilter(e.target.value)}
              >
                <option value="all">Tất cả danh mục ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="admin-select"
                value={inventoryStatusFilter}
                onChange={(e) => setInventoryStatusFilter(e.target.value as any)}
              >
                <option value="all">Tất cả trạng thái kho</option>
                <option value="in_stock">🟢 Còn hàng dồi dào (&gt; 5 chiếc)</option>
                <option value="low_stock">⚡ Sắp hết hàng (1 - 5 chiếc)</option>
                <option value="out_of_stock">🔴 Đã hết hàng (0 chiếc)</option>
              </select>

              <select
                className="admin-select"
                value={inventorySort}
                onChange={(e) => setInventorySort(e.target.value as any)}
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="qty_asc">Số lượng tồn: Ít nhất ➔ Nhiều nhất</option>
                <option value="qty_desc">Số lượng tồn: Nhiều nhất ➔ Ít nhất</option>
                <option value="val_desc">Giá trị tồn kho cao nhất</option>
                <option value="name_asc">Tên sản phẩm A-Z</option>
              </select>
            </div>

            <div className="admin-toolbar-right">
              <button
                className="btn-admin-add"
                onClick={() => {
                  if (products[0]) handleOpenAdjustModal(products[0], 'add');
                }}
              >
                <span>📦 Nhập kho / Điều chỉnh</span>
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '280px' }}>Sản phẩm & Mã</th>
                  <th>Danh mục</th>
                  <th>Đơn giá</th>
                  <th>Tồn kho</th>
                  <th>Giá trị tồn kho</th>
                  <th>Mức tồn & Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Tăng / Giảm nhanh</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((p) => {
                  const qty = p.stockQuantity !== undefined ? p.stockQuantity : 50;
                  const itemValue = p.priceValue * qty;
                  const isOut = qty === 0;
                  const isLow = !isOut && qty <= 5;
                  const pct = Math.min(100, Math.round((qty / 50) * 100));

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Mã SP: <code>{p.id}</code>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-category-badge">{p.categoryName || p.category}</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.price}</span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              color: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669',
                            }}
                          >
                            {qty}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>chiếc</span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                          {formatPrice(itemValue)}
                        </span>
                      </td>

                      <td style={{ minWidth: '160px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                                color: isOut ? '#dc2626' : isLow ? '#b45309' : '#15803d',
                              }}
                            >
                              {isOut ? 'Hết hàng' : isLow ? `Sắp hết (${qty})` : 'Còn hàng'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{pct}%</span>
                          </div>
                          <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.max(4, pct)}%`,
                                background: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981',
                                borderRadius: '3px',
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '4px', background: '#f8fafc', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <button
                            type="button"
                            disabled={qty < 5}
                            onClick={() => handleQuickAdjustDelta(p, -5)}
                            title="Giảm 5 sản phẩm"
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: qty < 5 ? '#f1f5f9' : '#ffffff',
                              color: qty < 5 ? '#cbd5e1' : '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.725rem',
                              cursor: qty < 5 ? 'not-allowed' : 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            disabled={qty === 0}
                            onClick={() => handleQuickAdjustDelta(p, -1)}
                            title="Giảm 1 sản phẩm"
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: qty === 0 ? '#f1f5f9' : '#ffffff',
                              color: qty === 0 ? '#cbd5e1' : '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.725rem',
                              cursor: qty === 0 ? 'not-allowed' : 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustDelta(p, 1)}
                            title="Tăng 1 sản phẩm"
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#ffffff',
                              color: '#16a34a',
                              fontWeight: 700,
                              fontSize: '0.725rem',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustDelta(p, 5)}
                            title="Tăng 5 sản phẩm"
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#ffffff',
                              color: '#16a34a',
                              fontWeight: 700,
                              fontSize: '0.725rem',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustDelta(p, 10)}
                            title="Tăng 10 sản phẩm"
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#ffffff',
                              color: '#2563eb',
                              fontWeight: 700,
                              fontSize: '0.725rem',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-action-sm"
                          style={{
                            padding: '4px 10px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderColor: '#bfdbfe',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                          onClick={() => handleOpenAdjustModal(p, 'set')}
                        >
                          🛠️ Điều chỉnh
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: QUẢN LÝ ĐƠN HÀNG (ORDERS CRUD)
          ===================================================================== */}
      {activeTab === 'orders' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <div className="admin-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn #MS, tên khách, SĐT..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái ({orders.length})</option>
                <option value="pending">Chờ xử lý ({orders.filter((o) => o.status === 'pending').length})</option>
                <option value="shipping">Đang giao ({orders.filter((o) => o.status === 'shipping').length})</option>
                <option value="completed">Thành công ({orders.filter((o) => o.status === 'completed').length})</option>
                <option value="cancelled">Đã hủy ({orders.filter((o) => o.status === 'cancelled').length})</option>
              </select>
            </div>

            <div className="admin-toolbar-right">
              <button className="btn-admin-add" onClick={handleOpenManualOrderModal}>
                <span>📦 Tạo đơn hàng thủ công</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng & SĐT</th>
                  <th>Địa chỉ nhận hàng</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.date}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{order.customer}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {order.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.address}>
                        {order.address}
                      </div>
                      {order.notes && (
                        <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Note: {order.notes}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#059669' }}>{order.totalFormatted}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.items?.length || 1} sản phẩm</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-dropdown-select"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      >
                        <option value="pending">⏳ Đang xử lý</option>
                        <option value="shipping">🚚 Đang giao hàng</option>
                        <option value="completed">✅ Giao thành công</option>
                        <option value="cancelled">❌ Đã hủy đơn</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-action-sm"
                          title="Xem chi tiết đơn"
                          onClick={() => setViewingOrder(order)}
                        >
                          👁️
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Sửa thông tin đơn"
                          onClick={() => handleOpenEditOrder(order)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Xóa đơn hàng"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa đơn hàng "${order.id}"?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          style={{ color: '#ef4444' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* =====================================================================
          TAB 6: QUẢN LÝ KHÁCH HÀNG (CUSTOMERS CRUD)
          ===================================================================== */}
      {activeTab === 'customers' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <div className="admin-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm khách theo tên, email, SĐT..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-toolbar-right">
              <button className="btn-admin-add" onClick={handleOpenAddCustomer}>
                <span>👥 Thêm khách hàng mới</span>
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Địa chỉ</th>
                  <th>Phân quyền</th>
                  <th>Số đơn hàng</th>
                  <th>Tổng chi tiêu</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: c.role === 'admin' ? '#f3e8ff' : '#ecfdf5',
                          color: c.role === 'admin' ? '#7c3aed' : '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{c.name}</div>
                          {c.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem' }}>📞 {c.phone || 'Chưa có SĐT'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>✉️ {c.email || 'Chưa có Email'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>
                        {c.address || '—'}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: c.role === 'admin' ? '#f3e8ff' : '#f1f5f9',
                        color: c.role === 'admin' ? '#7c3aed' : '#334155',
                      }}>
                        {c.role === 'admin' ? '🔑 Quản trị viên' : c.role === 'staff' ? '👔 Nhân viên' : '👤 Khách hàng'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.totalOrders || 0} đơn</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {formatPrice(c.totalSpent || 0)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-action-sm"
                          title="Sửa thông tin khách hàng"
                          onClick={() => handleOpenEditCustomer(c)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Xóa khách hàng"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${c.name}"?`)) {
                              deleteCustomer(c.id);
                            }
                          }}
                          style={{ color: '#ef4444' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: ADD / EDIT PRODUCT (WITH FILE UPLOAD - NO TYPING URLS)
          ===================================================================== */}
      <div className={`modal-overlay ${isProdModalOpen ? 'open' : ''}`}>
        <div className="modal-admin-card modal-admin-card--lg">
          {/* Header */}
          <div className="modal-admin-header">
            <div className="modal-admin-title-wrap">
              <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <p className="modal-admin-subtitle">
                {editingProduct
                  ? 'Cập nhật thông tin sản phẩm đang quản lý.'
                  : 'Điền đầy đủ thông tin để thêm sản phẩm vào gian hàng.'}
              </p>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsProdModalOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <form id="product-form" onSubmit={handleSaveProductForm} className="modal-admin-body">
            {/* Hidden File Input for Main Image */}
            <input
              type="file"
              ref={mainImageInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              style={{ display: 'none' }}
              onChange={(e) => handleMainImageFiles(e.target.files)}
            />

            {/* Hidden File Input for Gallery (Multiple Files) */}
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleGalleryFiles(e.target.files)}
            />

            {/* Section 1: Thông tin cơ bản */}
            <div className="modal-form-section">
              <div className="modal-form-section-title">
                <span className="step-dot" />
                Thông tin cơ bản
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tên sản phẩm <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="VD: Giày Tây Lười Da Bò Nam Tanpolo Luxury"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Danh mục <span className="required">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Tình trạng kho <span className="required">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={modalStock}
                    onChange={(e) => setModalStock(e.target.value)}
                  >
                    <option value="Còn hàng">Còn hàng (Sẵn sàng bán)</option>
                    <option value="Sắp hết hàng">Sắp hết hàng</option>
                    <option value="Tạm hết hàng">Tạm hết hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Giá & kho */}
            <div className="modal-form-section">
              <div className="modal-form-section-title">
                <span className="step-dot" />
                Giá & tồn kho
              </div>

              <div className="form-grid-4">
                <div className="form-group">
                  <label className="form-label">
                    Số lượng tồn <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    placeholder="VD: 50"
                    value={modalStockQuantity}
                    onChange={(e) => setModalStockQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Giá bán VNĐ <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    placeholder="VD: 680000"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá gốc VNĐ</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    placeholder="VD: 850000"
                    value={modalOldPrice}
                    onChange={(e) => setModalOldPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nhãn Badge</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mới, Hot, -20%"
                    value={modalBadge}
                    onChange={(e) => setModalBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mô tả sản phẩm <span className="required">*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Mô tả chất liệu, tính năng, điểm nổi bật..."
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Hình ảnh */}
            <div className="modal-form-section">
              <div className="modal-form-section-title">
                <span className="step-dot" />
                Hình ảnh sản phẩm
              </div>

              <div className="form-group">
                <label className="form-label">Ảnh đại diện chính</label>
                <div className="image-upload-wrapper">
                  {modalImage ? (
                    <div className="image-preview-box">
                      <img src={modalImage} alt="Ảnh sản phẩm" className="image-preview-thumb" />
                      <div className="image-preview-info">
                        <div className="image-preview-title">Ảnh chính đã chọn</div>
                        <div className="image-preview-meta">
                          {modalImageFileName || 'Đã chọn tệp hình ảnh từ thiết bị'}
                        </div>
                        <div className="image-preview-actions">
                          <button
                            type="button"
                            className="btn-upload-action"
                            onClick={() => mainImageInputRef.current?.click()}
                          >
                            <IconRefresh /> Chọn ảnh khác
                          </button>
                          <button
                            type="button"
                            className="btn-upload-action danger"
                            onClick={() => {
                              setModalImage('');
                              setModalImageFileName('');
                            }}
                          >
                            <IconTrash /> Xóa ảnh
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`image-dropzone ${isDraggingMainImage ? 'dragging' : ''}`}
                      onClick={() => mainImageInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingMainImage(true);
                      }}
                      onDragLeave={() => setIsDraggingMainImage(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingMainImage(false);
                        handleMainImageFiles(e.dataTransfer.files);
                      }}
                    >
                      <div className="image-dropzone-icon"><IconUpload /></div>
                      <div className="image-dropzone-title">Nhấp để chọn ảnh hoặc kéo thả vào đây</div>
                      <div className="image-dropzone-subtitle">PNG, JPG, JPEG, WEBP (Tối đa 15MB)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="form-group">
                <div className="gallery-header-row">
                  <label className="form-label">Thư viện ảnh phụ</label>
                  <div className="gallery-header-actions">
                    <button
                      type="button"
                      className="btn-upload-action"
                      onClick={() => galleryInputRef.current?.click()}
                      style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', borderColor: 'var(--primary-border)' }}
                    >
                      <IconPlus /> Thêm ảnh
                    </button>
                    {modalGallery.length > 0 && (
                      <button
                        type="button"
                        className="btn-upload-action danger"
                        onClick={() => setModalGallery([])}
                      >
                        Xóa tất cả ({modalGallery.length})
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="gallery-grid-wrapper"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingGallery(true);
                  }}
                  onDragLeave={() => setIsDraggingGallery(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingGallery(false);
                    handleGalleryFiles(e.dataTransfer.files);
                  }}
                  style={{
                    padding: isDraggingGallery ? '10px' : '0',
                    borderRadius: '8px',
                    background: isDraggingGallery ? '#f0fdf4' : 'transparent',
                    border: isDraggingGallery ? '2px dashed var(--primary-color)' : 'none',
                  }}
                >
                  {modalGallery.map((url, idx) => (
                    <div key={idx} className="gallery-tile">
                      <img src={url} alt={`gallery-${idx}`} />
                      <span className="gallery-tile-badge">#{idx + 1}</span>
                      <button
                        type="button"
                        className="gallery-tile-delete"
                        onClick={() => handleRemoveGalleryItem(idx)}
                        title="Xóa ảnh này"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Add Tile Button */}
                  <div
                    className="gallery-add-tile"
                    onClick={() => galleryInputRef.current?.click()}
                    title="Nhấp để tải thêm ảnh từ máy"
                  >
                    <span>+</span>
                    <small>Chọn ảnh</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Thông số kỹ thuật */}
            <div className="modal-form-section">
              <div className="modal-form-section-title">
                <span className="step-dot" />
                Thông số kỹ thuật
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Chất liệu</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Da bò thật nguyên tấm"
                    value={modalMaterial}
                    onChange={(e) => setModalMaterial(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Màu sắc</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Đen / Nâu hạt dẻ"
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kích thước / Size</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Size 38 - 44"
                    value={modalDimensions}
                    onChange={(e) => setModalDimensions(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Xuất xứ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Việt Nam - Tanpolo"
                    value={modalOrigin}
                    onChange={(e) => setModalOrigin(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Footer actions (fixed, outside scrollable body) */}
          <div className="modal-admin-footer">
            <button
              type="button"
              className="btn-admin-reset"
              onClick={() => setIsProdModalOpen(false)}
            >
              Hủy bỏ
            </button>
            <button type="submit" form="product-form" className="btn-admin-add">
              <IconSave /> {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL 2: ADD / EDIT CATEGORY (WITH FILE UPLOAD - NO TYPING URLS)
          ===================================================================== */}
      <div className={`modal-overlay ${isCatModalOpen ? 'open' : ''}`}>
        <div className="modal-admin-card modal-admin-card--lg" style={{ maxWidth: '520px', width: '100%' }}>
          <div className="modal-admin-header">
            <div className="modal-admin-title-wrap">
              <h3>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <p className="modal-admin-subtitle">
                {editingCategory
                  ? 'Cập nhật thông tin danh mục đang quản lý.'
                  : 'Điền đầy đủ thông tin để thêm danh mục mới.'}
              </p>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsCatModalOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <form id="category-form" onSubmit={handleSaveCategoryForm} className="modal-admin-body">
            {/* Hidden File Input for Category Image */}
            <input
              type="file"
              ref={catImageInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              style={{ display: 'none' }}
              onChange={(e) => handleCatImageFiles(e.target.files)}
            />

            <div className="form-group">
              <label className="form-label">
                Mã định danh Slug ID <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                required
                disabled={!!editingCategory}
                placeholder="VD: vi-da, giay-tay, balo-da"
                value={modalCatId}
                onChange={(e) => setModalCatId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Tên danh mục <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="VD: Ví Da Bò Nam Cao Cấp"
                value={modalCatName}
                onChange={(e) => setModalCatName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả danh mục</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Mô tả tóm tắt phong cách danh mục..."
                value={modalCatDesc}
                onChange={(e) => setModalCatDesc(e.target.value)}
              />
            </div>

            {/* Category Image: Upload from File (NO URL INPUT) */}
            <div className="form-group">
              <label className="form-label">
                <IconImage /> Ảnh đại diện danh mục
              </label>
              <div className="image-upload-wrapper">
                {modalCatImage ? (
                  <div className="image-preview-box">
                    <img src={modalCatImage} alt="Ảnh danh mục" className="image-preview-thumb" />
                    <div className="image-preview-info">
                      <div className="image-preview-title">Ảnh danh mục đã chọn</div>
                      <div className="image-preview-meta">
                        {modalCatImageFileName || 'Đã chọn tệp hình ảnh từ thiết bị'}
                      </div>
                      <div className="image-preview-actions">
                        <button
                          type="button"
                          className="btn-upload-action"
                          onClick={() => catImageInputRef.current?.click()}
                        >
                          <IconRefresh /> Chọn ảnh khác
                        </button>
                        <button
                          type="button"
                          className="btn-upload-action danger"
                          onClick={() => {
                            setModalCatImage('');
                            setModalCatImageFileName('');
                          }}
                        >
                          <IconTrash /> Xóa ảnh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`image-dropzone ${isDraggingCatImage ? 'dragging' : ''}`}
                    onClick={() => catImageInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingCatImage(true);
                    }}
                    onDragLeave={() => setIsDraggingCatImage(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingCatImage(false);
                      handleCatImageFiles(e.dataTransfer.files);
                    }}
                  >
                    <div className="image-dropzone-icon"><IconUpload /></div>
                    <div className="image-dropzone-title">Nhấp để chọn ảnh banner từ máy tính</div>
                    <div className="image-dropzone-subtitle">Hỗ trợ PNG, JPG, JPEG, WEBP</div>
                  </div>
                )}
              </div>
            </div>
          </form>

          <div className="modal-admin-footer">
            <button
              type="button"
              className="btn-admin-reset"
              onClick={() => setIsCatModalOpen(false)}
            >
              Hủy bỏ
            </button>
            <button type="submit" form="category-form" className="btn-admin-add">
              <IconSave /> {editingCategory ? 'Cập nhật danh mục' : 'Lưu danh mục mới'}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL 3: VIEW ORDER DETAILS
          ===================================================================== */}
      {viewingOrder && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 className="modal-title" style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
                  Chi Tiết Đơn Hàng {viewingOrder.id}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thời gian đặt: {viewingOrder.date}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Customer Info Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><strong>Khách hàng:</strong> {viewingOrder.customer}</div>
                <div><strong>Điện thoại:</strong> 📞 {viewingOrder.phone}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Địa chỉ nhận:</strong> 📍 {viewingOrder.address}</div>
                {viewingOrder.notes && (
                  <div style={{ gridColumn: 'span 2', color: '#b45309' }}><strong>Ghi chú:</strong> {viewingOrder.notes}</div>
                )}
                <div><strong>Thanh toán:</strong> {viewingOrder.paymentMethod}</div>
                <div><strong>Trạng thái:</strong> <span className={`badge-status-${viewingOrder.status}`}>{viewingOrder.statusText}</span></div>
              </div>
            </div>

            {/* Items List */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>📦 Sản phẩm trong đơn</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {viewingOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <img src={item.image || '/assets/images/products/bo5-1.jpg'} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Số lượng: {item.quantity} x {item.price}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>
                      {formatPrice(item.priceValue * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(viewingOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Phí vận chuyển:</span>
                <span>{viewingOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(viewingOrder.shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#059669', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                <span>Tổng thanh toán:</span>
                <span>{viewingOrder.totalFormatted}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => handlePrintOrder(viewingOrder)}
                className="btn-admin-reset"
              >
                🖨️ In hóa đơn
              </button>
              <button
                onClick={() => setViewingOrder(null)}
                className="btn-admin-add"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: EDIT ORDER
          ===================================================================== */}
      {isOrderEditModalOpen && editingOrder && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                ✏️ Cập Nhật Đơn Hàng {editingOrder.id}
              </h2>
              <button
                type="button"
                onClick={() => setIsOrderEditModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveOrderEditForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Tên khách hàng (*)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editOrderCustomer}
                  onChange={(e) => setEditOrderCustomer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại (*)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editOrderPhone}
                  onChange={(e) => setEditOrderPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ giao hàng (*)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  required
                  value={editOrderAddress}
                  onChange={(e) => setEditOrderAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú đơn hàng</label>
                <input
                  type="text"
                  className="form-input"
                  value={editOrderNotes}
                  onChange={(e) => setEditOrderNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái đơn (*)</label>
                <select
                  className="form-input"
                  value={editOrderStatus}
                  onChange={(e) => setEditOrderStatus(e.target.value as Order['status'])}
                >
                  <option value="pending">⏳ Đang xử lý</option>
                  <option value="shipping">🚚 Đang giao hàng</option>
                  <option value="completed">✅ Giao thành công</option>
                  <option value="cancelled">❌ Đã hủy đơn</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-admin-reset"
                  onClick={() => setIsOrderEditModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-admin-add">
                  💾 Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: MANUAL ORDER CREATION
          ===================================================================== */}
      {isManualOrderModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                📦 Tạo Đơn Hàng Mới (Thủ Công)
              </h2>
              <button
                type="button"
                onClick={() => setIsManualOrderModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Tên khách hàng (*)</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="VD: Hoàng Văn Minh"
                    value={manualCustomer}
                    onChange={(e) => setManualCustomer(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại (*)</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="0912345678"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ giao hàng (*)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Địa chỉ nhà, tên đường, phường/quận, thành phố..."
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Phương thức thanh toán</label>
                  <select
                    className="form-input"
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value)}
                  >
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="QR Banking">Chuyển khoản QR Banking</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ghi chú</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Khách dặn giao buổi sáng..."
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Add items to order */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <label className="form-label">Chọn sản phẩm thêm vào đơn (*)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <select
                    className="form-input"
                    style={{ flex: 1 }}
                    value={manualSelectedProdId}
                    onChange={(e) => setManualSelectedProdId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    style={{ width: '70px' }}
                    value={manualProdQty}
                    onChange={(e) => setManualProdQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button
                    type="button"
                    onClick={handleAddManualItem}
                    style={{ padding: '0 16px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Thêm
                  </button>
                </div>

                {/* Items preview */}
                {manualCartItems.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                    Chưa có sản phẩm nào được chọn.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {manualCartItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div>
                          <strong>{item.name}</strong> ({item.quantity} x {item.price})
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 700, color: '#059669' }}>
                            {formatPrice(item.priceValue * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveManualItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn-admin-reset"
                  onClick={() => setIsManualOrderModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={manualCartItems.length === 0}
                  className="btn-admin-add"
                >
                  🚀 Tạo và lưu đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* =====================================================================
          MODAL 7: ADD / EDIT CUSTOMER
          ===================================================================== */}
      {isCustomerModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                {editingCustomer ? '✏️ Chỉnh Sửa Khách Hàng' : '👥 Thêm Khách Hàng Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCustomerForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Họ và tên (*)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="VD: Nguyễn Văn An"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="0912345678"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="an.nguyen@gmail.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Địa chỉ giao hàng mặc định..."
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phân quyền tài khoản</label>
                <select
                  className="form-input"
                  value={custRole}
                  onChange={(e) => setCustRole(e.target.value as any)}
                >
                  <option value="customer">👤 Khách hàng (Customer)</option>
                  <option value="staff">👔 Nhân viên (Staff)</option>
                  <option value="admin">🔑 Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú quản trị</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Khách VIP, thường mua giày size 41..."
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-admin-reset"
                  onClick={() => setIsCustomerModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-admin-add">
                  💾 {editingCustomer ? 'Cập nhật khách hàng' : 'Lưu khách hàng mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: QUẢN LÝ / ĐIỀU CHỈNH TỒN KHO
          ===================================================================== */}
      {isAdjustModalOpen && adjustingProduct && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                📦 Điều Chỉnh Tồn Kho Sản Phẩm
              </h2>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Product Quick Info */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <img
                src={adjustingProduct.image}
                alt={adjustingProduct.name}
                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{adjustingProduct.name}</div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  <span>Đơn giá: <strong style={{ color: '#0f172a' }}>{adjustingProduct.price}</strong></span>
                  <span>•</span>
                  <span>Tồn kho hiện tại: <strong style={{ color: '#2563eb' }}>{adjustingProduct.stockQuantity !== undefined ? adjustingProduct.stockQuantity : 50} chiếc</strong></span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAdjustStock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Mode Selection */}
              <div>
                <label className="form-label">Phương thức điều chỉnh (*)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: adjustType === 'add' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      background: adjustType === 'add' ? '#f0fdf4' : '#ffffff',
                      color: adjustType === 'add' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    ➕ Nhập thêm
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('subtract')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: adjustType === 'subtract' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                      background: adjustType === 'subtract' ? '#fef2f2' : '#ffffff',
                      color: adjustType === 'subtract' ? '#dc2626' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    ➖ Xuất bớt
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('set')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: adjustType === 'set' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: adjustType === 'set' ? '#eff6ff' : '#ffffff',
                      color: adjustType === 'set' ? '#1d4ed8' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    🎯 Đặt lại tồn
                  </button>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="form-group">
                <label className="form-label">
                  {adjustType === 'add'
                    ? 'Số lượng nhập thêm (Chiếc) (*)'
                    : adjustType === 'subtract'
                    ? 'Số lượng xuất giảm (Chiếc) (*)'
                    : 'Số lượng tồn kho mới chính xác (Chiếc) (*)'}
                </label>
                <input
                  type="number"
                  className="form-input"
                  required
                  min="0"
                  value={adjustQtyValue}
                  onChange={(e) => setAdjustQtyValue(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              {/* Calculation Preview */}
              {(() => {
                const current = adjustingProduct.stockQuantity !== undefined ? adjustingProduct.stockQuantity : 50;
                const val = adjustQtyValue === '' ? 0 : Number(adjustQtyValue);
                let finalQty = current;
                if (adjustType === 'add') finalQty = current + val;
                else if (adjustType === 'subtract') finalQty = Math.max(0, current - val);
                else if (adjustType === 'set') finalQty = val;

                return (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#f1f5f9', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#475569' }}>Dự kiến sau điều chỉnh:</span>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: finalQty === 0 ? '#dc2626' : finalQty <= 5 ? '#d97706' : '#16a34a' }}>
                      {current} ➔ {finalQty} chiếc ({finalQty === 0 ? 'Hết hàng' : finalQty <= 5 ? 'Sắp hết' : 'Còn hàng'})
                    </span>
                  </div>
                );
              })()}

              {/* Reason */}
              <div className="form-group">
                <label className="form-label">Lý do điều chỉnh kho (*)</label>
                <select
                  className="form-input"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  <option value="Nhập hàng từ xưởng sản xuất">🏭 Nhập hàng từ xưởng sản xuất</option>
                  <option value="Kiểm kê kho định kỳ">📋 Kiểm kê kho định kỳ</option>
                  <option value="Xuất hàng hỏng / lỗi tiêu hủy">⚠️ Xuất hàng hỏng / lỗi tiêu hủy</option>
                  <option value="Khách trả hàng / hoàn tồn">🔄 Khách trả hàng / hoàn tồn</option>
                  <option value="Xuất bán buôn / chuyển kho">🚚 Xuất bán buôn / chuyển kho</option>
                  <option value="Khác">✏️ Khác (Ghi chú tự do)</option>
                </select>
              </div>

              {adjustReason === 'Khác' && (
                <div className="form-group">
                  <label className="form-label">Chi tiết lý do khác</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ghi chú cụ thể..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-admin-reset"
                  onClick={() => setIsAdjustModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-admin-add">
                  💾 Lưu & Cập nhật tồn kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
