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

import {
  IconBarChart,
  IconBriefcase,
  IconClipboard,
  IconDot,
  IconEye,
  IconFolder,
  IconImage,
  IconKey,
  IconLock,
  IconMail,
  IconMapPin,
  IconMinus,
  IconPackage,
  IconPencil,
  IconPhone,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconRocket,
  IconSave,
  IconSettings,
  IconShield,
  IconShoppingBag,
  IconTarget,
  IconTrash,
  IconTruck,
  IconUpload,
  IconUser,
  IconUsers,
  IconWarning,
  IconXCircle,
  IconZap,
  IconCopy,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconCreditCard,
  IconFileText,
  IconExternalLink,
} from '@/components/icons';

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

  const { user, isAdmin, loading, logout } = useAuth();

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
  const [viewingCategoryProducts, setViewingCategoryProducts] = useState<Category | null>(null);

  // =========================================================================
  // Order Filter & Detail State
  // =========================================================================
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isOrderEditModalOpen, setIsOrderEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editOrderCustomer, setEditOrderCustomer] = useState('');
  const [editOrderPhone, setEditOrderPhone] = useState('');
  const [editOrderAddress, setEditOrderAddress] = useState('');
  const [editOrderNotes, setEditOrderNotes] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState<Order['status']>('pending');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    }
  };

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
  if (loading) {
    return (
      <main className="container" style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Đang kiểm tra quyền truy cập...</div>
      </main>
    );
  }

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
          <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            <IconLock size={48} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-dark)' }}>
            Khu Vực Quản Trị Hệ Thống (Admin Only)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Tài khoản khách hàng thông thường không có quyền truy cập hoặc quản lý.
            Vui lòng đăng nhập với tài khoản <strong>Quản trị viên (Admin)</strong> để sử dụng bảng điều khiển.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/login"
              className="btn-auth-register"
              style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <IconLock size={14} /> Đăng nhập với tài khoản Quản trị viên
            </Link>

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

  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  const filteredOrders = orders
    .filter((o) => {
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const q = orderSearch.toLowerCase().trim();
      return (
        matchStatus &&
        (!q ||
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          (o.notes && o.notes.toLowerCase().includes(q)) ||
          o.items?.some((it) => it.name.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => {
      if (orderSort === 'highest') return b.total - a.total;
      if (orderSort === 'lowest') return a.total - b.total;
      if (orderSort === 'oldest') return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

  const filteredOrdersTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);


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

  const handleUpdateManualItemQty = (index: number, delta: number) => {
    const updated = [...manualCartItems];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      handleRemoveManualItem(index);
    } else {
      updated[index].quantity = newQty;
      setManualCartItems(updated);
    }
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

  const currentViewingOrder = viewingOrder
    ? orders.find((o) => o.id === viewingOrder.id) || viewingOrder
    : null;

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}><IconSettings size={28} /></span>
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
          <span><IconBarChart size={14} /> Tổng quan & Báo cáo</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span><IconShoppingBag size={14} /> Sản phẩm</span>
          <span className="admin-tab-badge">{products.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <span><IconFolder size={14} /> Danh mục</span>
          <span className="admin-tab-badge">{categories.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span><IconBarChart size={14} /> Quản lý tồn kho</span>
          <span
            className="admin-tab-badge"
            style={lowStockProducts.length > 0 ? { background: '#f59e0b', color: '#fff' } : {}}
          >
            {lowStockProducts.length > 0 ? `${lowStockProducts.length}` : `${totalInventoryUnits} SP`}
          </span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span><IconPackage size={14} /> Đơn hàng</span>
          <span className="admin-tab-badge">{orders.length}</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <span><IconUsers size={14} /> Khách hàng</span>
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
                  {outOfStockProducts.length > 0 ? `${outOfStockProducts.length} SP hết hàng` : 'Tất cả còn hàng'}
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
                <IconFolder size={16} /> Phân bố sản phẩm theo danh mục
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
                <IconZap size={16} /> Lối tắt thao tác nhanh
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => { setActiveTab('products'); handleOpenAddProduct(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px' }}
                >
                  <IconPlus size={14} /> Thêm sản phẩm
                </button>
                <button
                  onClick={() => { setActiveTab('inventory'); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#d97706' }}
                >
                  <IconBarChart size={14} /> Quản lý tồn kho
                </button>
                <button
                  onClick={() => { setActiveTab('orders'); handleOpenManualOrderModal(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#059669' }}
                >
                  <IconPackage size={14} /> Tạo đơn thủ công
                </button>
                <button
                  onClick={() => { setActiveTab('customers'); handleOpenAddCustomer(); }}
                  className="btn-admin-add"
                  style={{ justifyContent: 'center', height: '44px', borderRadius: '10px', background: '#8b5cf6' }}
                >
                  <IconUsers size={14} /> Thêm khách hàng
                </button>
              </div>

              {lowStockProducts.length > 0 && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '0.825rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: '#b45309' }}>
                    <IconWarning size={14} /> Cảnh báo tồn kho: Có {lowStockProducts.length} sản phẩm sắp hết hàng
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
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#0f172a' }}><IconShield size={14} /> Trạng thái cơ sở dữ liệu Supabase</div>
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
                <IconPackage size={16} /> Đơn hàng gần đây
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
                        <IconEye size={14} />
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
                <span><IconPlus size={14} /> Thêm sản phẩm mới</span>
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
                          <IconClipboard size={14} />
                        </button>
                        <button
                          className="btn-action-sm"
                          title="Chỉnh sửa sản phẩm"
                          onClick={() => handleOpenEditProduct(p)}
                        >
                          <IconPencil size={14} />
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
                          <IconTrash size={14} />
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
                <span><IconFolder size={14} /> Thêm danh mục mới</span>
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px', marginBottom: '40px' }}>
            {filteredCategories.map((c) => {
              const catProducts = products.filter((p) => p.category === c.id);
              const count = catProducts.length;
              const totalStock = catProducts.reduce((sum, p) => sum + (p.stockQuantity || (p.stock === 'Hết hàng' ? 0 : 10)), 0);
              const priceValues = catProducts.map((p) => p.priceValue).filter((v): v is number => typeof v === 'number' && v > 0);
              const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
              const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

              return (
                <div key={c.id} className="category-admin-card">
                  {/* Category Card Cover */}
                  <div className="category-card-cover">
                    <img
                      src={c.image || '/assets/images/products/bo5-1.jpg'}
                      alt={c.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                      }}
                    />
                    <div className="category-cover-overlay">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Slug: {c.id}
                        </span>
                        <span
                          style={{
                            background: '#059669',
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          {count} Sản phẩm
                        </span>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)', margin: 0 }}>
                          {c.name}
                        </h3>
                        <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '2px' }}>
                          Tổng kho: <strong>{totalStock} chiếc</strong> {minPrice > 0 && `• ${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Card Content */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                      {c.description || 'Danh mục sản phẩm đồ da thủ công Tanpolo.'}
                    </p>

                    {/* Product Thumbnails Gallery Preview */}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Mẫu sản phẩm ({count})
                        </span>
                        {count > 0 && (
                          <button
                            type="button"
                            onClick={() => setViewingCategoryProducts(c)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                          >
                            Xem tất cả →
                          </button>
                        )}
                      </div>

                      {count === 0 ? (
                        <div style={{ padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                          Chưa có sản phẩm trong danh mục
                        </div>
                      ) : (
                        <div className="category-thumbs-preview-row">
                          {catProducts.slice(0, 4).map((p) => (
                            <img
                              key={p.id}
                              src={p.image || '/assets/images/products/bo5-1.jpg'}
                              alt={p.name}
                              title={`${p.name} - ${p.price}`}
                              className="category-preview-thumb"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                              }}
                            />
                          ))}
                          {count > 4 && (
                            <div
                              onClick={() => setViewingCategoryProducts(c)}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: 'var(--radius-sm)',
                                background: '#e2e8f0',
                                color: 'var(--text-dark)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                              title={`Xem thêm ${count - 4} sản phẩm khác`}
                            >
                              +{count - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setViewingCategoryProducts(c)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--primary-border)',
                          background: 'var(--primary-light)',
                          color: 'var(--primary-color)',
                          fontWeight: 700,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <IconEye size={14} /> Xem sản phẩm ({count})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(c)}
                        title="Chỉnh sửa danh mục"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: '#ffffff',
                          color: 'var(--text-dark)',
                          fontWeight: 600,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconPencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        title="Xóa danh mục"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconTrash size={14} />
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
                <option value="in_stock"><IconDot size={10} style={{ color: '#16a34a' }} /> Còn hàng dồi dào (&gt; 5 chiếc)</option>
                <option value="low_stock"><IconDot size={10} style={{ color: '#f59e0b' }} /> Sắp hết hàng (1 - 5 chiếc)</option>
                <option value="out_of_stock"><IconDot size={10} style={{ color: '#dc2626' }} /> Đã hết hàng (0 chiếc)</option>
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
                <span><IconPackage size={14} /> Nhập kho / Điều chỉnh</span>
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
                          <IconSettings size={14} /> Điều chỉnh
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
          TAB 5: QUẢN LÝ ĐƠN HÀNG (ORDERS CRUD - REVAMPED & BEAUTIFIED)
          ===================================================================== */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Order KPI Summary Cards */}
          <div className="orders-kpi-grid">
            {/* KPI 1: All Orders */}
            <div
              className={`order-kpi-card ${orderStatusFilter === 'all' ? 'active-filter' : ''}`}
              onClick={() => setOrderStatusFilter('all')}
              title="Xem tất cả đơn hàng"
            >
              <div className="order-kpi-icon" style={{ background: '#f1f5f9', color: 'var(--text-dark)' }}>
                <IconShoppingBag size={22} />
              </div>
              <div className="order-kpi-info">
                <span className="order-kpi-label">Tổng đơn hàng</span>
                <span className="order-kpi-val">{orders.length}</span>
                <span className="order-kpi-sub">Doanh thu: {formatPrice(totalRevenue)}</span>
              </div>
            </div>

            {/* KPI 2: Pending Orders */}
            <div
              className={`order-kpi-card ${orderStatusFilter === 'pending' ? 'active-filter' : ''}`}
              onClick={() => setOrderStatusFilter(orderStatusFilter === 'pending' ? 'all' : 'pending')}
              title="Lọc đơn chờ xử lý"
            >
              <div className="order-kpi-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <IconClock size={22} />
              </div>
              <div className="order-kpi-info">
                <span className="order-kpi-label" style={{ color: '#b45309' }}>Chờ xử lý</span>
                <span className="order-kpi-val" style={{ color: '#d97706' }}>{pendingOrders.length}</span>
                <span className="order-kpi-sub">Cần đóng gói & giao</span>
              </div>
            </div>

            {/* KPI 3: Shipping Orders */}
            <div
              className={`order-kpi-card ${orderStatusFilter === 'shipping' ? 'active-filter' : ''}`}
              onClick={() => setOrderStatusFilter(orderStatusFilter === 'shipping' ? 'all' : 'shipping')}
              title="Lọc đơn đang giao hàng"
            >
              <div className="order-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <IconTruck size={22} />
              </div>
              <div className="order-kpi-info">
                <span className="order-kpi-label" style={{ color: '#1d4ed8' }}>Đang giao hàng</span>
                <span className="order-kpi-val" style={{ color: '#2563eb' }}>{shippingOrders.length}</span>
                <span className="order-kpi-sub">Đang trên đường giao</span>
              </div>
            </div>

            {/* KPI 4: Completed Orders */}
            <div
              className={`order-kpi-card ${orderStatusFilter === 'completed' ? 'active-filter' : ''}`}
              onClick={() => setOrderStatusFilter(orderStatusFilter === 'completed' ? 'all' : 'completed')}
              title="Lọc đơn giao thành công"
            >
              <div className="order-kpi-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <IconCheckCircle size={22} />
              </div>
              <div className="order-kpi-info">
                <span className="order-kpi-label" style={{ color: '#047857' }}>Giao thành công</span>
                <span className="order-kpi-val" style={{ color: '#059669' }}>{completedOrders.length}</span>
                <span className="order-kpi-sub">Đã quyết toán</span>
              </div>
            </div>

            {/* KPI 5: Cancelled Orders */}
            <div
              className={`order-kpi-card ${orderStatusFilter === 'cancelled' ? 'active-filter' : ''}`}
              onClick={() => setOrderStatusFilter(orderStatusFilter === 'cancelled' ? 'all' : 'cancelled')}
              title="Lọc đơn đã hủy"
            >
              <div className="order-kpi-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <IconXCircle size={22} />
              </div>
              <div className="order-kpi-info">
                <span className="order-kpi-label" style={{ color: '#b91c1c' }}>Đã hủy đơn</span>
                <span className="order-kpi-val" style={{ color: '#dc2626' }}>{cancelledOrders.length}</span>
                <span className="order-kpi-sub">Khách hủy / hoàn hàng</span>
              </div>
            </div>
          </div>

          {/* Controls Toolbar */}
          <div className="admin-toolbar" style={{ marginBottom: '14px' }}>
            <div className="admin-toolbar-left" style={{ gap: '10px' }}>
              {/* Search Box */}
              <div className="admin-search-box" style={{ minWidth: '280px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, khách hàng, SĐT, địa chỉ, SP..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                {orderSearch && (
                  <button
                    type="button"
                    onClick={() => setOrderSearch('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="order-filter-pills">
                <button
                  type="button"
                  className={`order-filter-pill ${orderStatusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter('all')}
                >
                  Tất cả <span className="order-filter-pill-count">{orders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-filter-pill ${orderStatusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter('pending')}
                  style={orderStatusFilter === 'pending' ? { background: '#d97706', borderColor: '#d97706' } : {}}
                >
                  Chờ xử lý <span className="order-filter-pill-count">{pendingOrders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-filter-pill ${orderStatusFilter === 'shipping' ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter('shipping')}
                  style={orderStatusFilter === 'shipping' ? { background: '#2563eb', borderColor: '#2563eb' } : {}}
                >
                  Đang giao <span className="order-filter-pill-count">{shippingOrders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-filter-pill ${orderStatusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter('completed')}
                  style={orderStatusFilter === 'completed' ? { background: '#059669', borderColor: '#059669' } : {}}
                >
                  Thành công <span className="order-filter-pill-count">{completedOrders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-filter-pill ${orderStatusFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter('cancelled')}
                  style={orderStatusFilter === 'cancelled' ? { background: '#dc2626', borderColor: '#dc2626' } : {}}
                >
                  Đã hủy <span className="order-filter-pill-count">{cancelledOrders.length}</span>
                </button>
              </div>
            </div>

            <div className="admin-toolbar-right" style={{ gap: '10px' }}>
              {/* Sort Selector */}
              <select
                className="admin-select"
                value={orderSort}
                onChange={(e) => setOrderSort(e.target.value as any)}
                title="Sắp xếp danh sách"
              >
                <option value="newest">Mới nhất trước</option>
                <option value="oldest">Cũ nhất trước</option>
                <option value="highest">Giá trị cao nhất</option>
                <option value="lowest">Giá trị thấp nhất</option>
              </select>

              <button
                className="btn-admin-reset"
                onClick={() => refreshData()}
                title="Làm mới dữ liệu từ máy chủ"
                disabled={isLoading}
              >
                <IconRefresh size={14} className={isLoading ? 'spin-anim' : ''} />
              </button>

              <button className="btn-admin-add" onClick={handleOpenManualOrderModal}>
                <IconPlus size={15} /> Tạo đơn hàng mới
              </button>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="admin-table-card" style={{ padding: 0, overflow: 'hidden' }}>
            {filteredOrders.length === 0 ? (
              <div className="admin-table-empty">
                <div className="admin-table-empty-icon">
                  <IconPackage size={32} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', margin: 0 }}>
                  Không tìm thấy đơn hàng nào
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {orderSearch || orderStatusFilter !== 'all'
                    ? 'Không có đơn hàng nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.'
                    : 'Chưa có đơn hàng nào được tạo trong hệ thống.'}
                </p>
                {(orderSearch || orderStatusFilter !== 'all') && (
                  <button
                    type="button"
                    className="btn-admin-reset"
                    style={{ marginTop: '8px' }}
                    onClick={() => {
                      setOrderSearch('');
                      setOrderStatusFilter('all');
                    }}
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: '20px' }}>Mã đơn & Thời gian</th>
                      <th>Khách hàng & SĐT</th>
                      <th>Sản phẩm trong đơn</th>
                      <th>Tổng thanh toán</th>
                      <th>Phương thức</th>
                      <th>Trạng thái đơn</th>
                      <th style={{ textAlign: 'right', paddingRight: '20px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const initial = order.customer ? order.customer.charAt(0).toUpperCase() : 'K';
                      return (
                        <tr key={order.id}>
                          {/* Mã đơn & Thời gian */}
                          <td style={{ paddingLeft: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong
                                style={{
                                  fontFamily: 'ui-monospace, monospace',
                                  fontSize: '0.92rem',
                                  color: 'var(--text-dark)',
                                }}
                              >
                                #{order.id}
                              </strong>
                              <button
                                type="button"
                                className={`order-copy-btn ${copiedKey === order.id ? 'copied' : ''}`}
                                style={{ padding: '2px 5px', fontSize: '0.68rem' }}
                                title="Sao chép mã đơn"
                                onClick={() => handleCopyText(order.id, order.id)}
                              >
                                {copiedKey === order.id ? <IconCheck size={10} /> : <IconCopy size={10} />}
                              </button>
                            </div>
                            <div
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '3px',
                              }}
                            >
                              <IconClock size={11} /> {order.date}
                            </div>
                          </td>

                          {/* Khách hàng & SĐT */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #059669, #10b981)',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  flexShrink: 0,
                                }}
                              >
                                {initial}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.88rem' }}>
                                  {order.customer}
                                </div>
                                <a
                                  href={`tel:${order.phone}`}
                                  style={{
                                    fontSize: '0.78rem',
                                    color: '#2563eb',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600,
                                    marginTop: '2px',
                                  }}
                                >
                                  <IconPhone size={11} /> {order.phone}
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Sản phẩm trong đơn */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {order.items && order.items.length > 0 ? (
                                <>
                                  <div className="order-thumbs-stack">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                      <img
                                        key={idx}
                                        src={item.image || '/assets/images/products/bo5-1.jpg'}
                                        alt={item.name}
                                        className="order-thumb-item"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src =
                                            '/assets/images/products/bo5-1.jpg';
                                        }}
                                      />
                                    ))}
                                    {order.items.length > 3 && (
                                      <span className="order-thumb-more">+{order.items.length - 3}</span>
                                    )}
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: 'var(--text-dark)',
                                        maxWidth: '180px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                      title={order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                                    >
                                      {order.items[0]?.name}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                      {order.items.reduce((s, it) => s + it.quantity, 0)} món hàng
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                  1 sản phẩm
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Tổng thanh toán */}
                          <td>
                            <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.96rem' }}>
                              {order.totalFormatted}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {order.shippingFee === 0 ? 'Miễn phí ship' : `Ship: ${formatPrice(order.shippingFee)}`}
                            </div>
                          </td>

                          {/* Phương thức thanh toán */}
                          <td>
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                background: order.paymentMethod.toLowerCase().includes('chuyển khoản')
                                  ? '#eff6ff'
                                  : '#fef3c7',
                                color: order.paymentMethod.toLowerCase().includes('chuyển khoản')
                                  ? '#1e40af'
                                  : '#92400e',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <IconCreditCard size={12} />
                              {order.paymentMethod.toLowerCase().includes('chuyển khoản') ? 'Chuyển khoản' : 'COD'}
                            </span>
                          </td>

                          {/* Trạng thái đơn hàng */}
                          <td>
                            <select
                              className="status-dropdown-select"
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-pill)',
                                cursor: 'pointer',
                              }}
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            >
                              <option value="pending">⏳ Đang xử lý</option>
                              <option value="shipping">🚚 Đang giao hàng</option>
                              <option value="completed">✅ Giao thành công</option>
                              <option value="cancelled">❌ Đã hủy đơn</option>
                            </select>
                          </td>

                          {/* Thao tác */}
                          <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                            <div className="action-btn-group" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                className="btn-action-sm"
                                title="Xem chi tiết đơn hàng"
                                onClick={() => setViewingOrder(order)}
                                style={{ color: '#059669' }}
                              >
                                <IconEye size={15} />
                              </button>
                              <button
                                className="btn-action-sm"
                                title="In hóa đơn đơn hàng"
                                onClick={() => handlePrintOrder(order)}
                              >
                                <IconPrinter size={15} />
                              </button>
                              <button
                                className="btn-action-sm"
                                title="Chỉnh sửa đơn hàng"
                                onClick={() => handleOpenEditOrder(order)}
                                style={{ color: '#2563eb' }}
                              >
                                <IconPencil size={15} />
                              </button>
                              <button
                                className="btn-action-sm"
                                title="Xóa đơn hàng"
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.id}"?`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                style={{ color: '#ef4444' }}
                              >
                                <IconTrash size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Table Bottom Footer Summary */}
                <div
                  style={{
                    padding: '14px 20px',
                    background: '#f8fafc',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    Hiển thị <strong>{filteredOrders.length}</strong> trên tổng số <strong>{orders.length}</strong> đơn hàng
                  </div>
                  <div>
                    Tổng giá trị hiển thị: <strong style={{ color: '#059669', fontSize: '0.95rem' }}>{formatPrice(filteredOrdersTotal)}</strong>
                  </div>
                </div>
              </>
            )}
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
                <span><IconUsers size={14} /> Thêm khách hàng mới</span>
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
                      <div style={{ fontSize: '0.825rem' }}><IconPhone size={12} /> {c.phone || 'Chưa có SĐT'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><IconMail size={12} /> {c.email || 'Chưa có Email'}</div>
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
                        {c.role === 'admin' ? (<><IconKey size={12} /> Quản trị viên</>) : c.role === 'staff' ? (<><IconBriefcase size={12} /> Nhân viên</>) : (<><IconUser size={12} /> Khách hàng</>)}
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
                          <IconPencil size={14} />
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
                          <IconTrash size={14} />
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
          MODAL 2.5: VIEW CATEGORY PRODUCTS (XEM SẢN PHẨM THEO DANH MỤC)
          ===================================================================== */}
      {viewingCategoryProducts && (() => {
        const catProducts = products.filter((p) => p.category === viewingCategoryProducts.id);
        const totalStock = catProducts.reduce((sum, p) => sum + (p.stockQuantity || (p.stock === 'Hết hàng' ? 0 : 10)), 0);

        return (
          <div
            className="modal-overlay open"
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewingCategoryProducts(null);
            }}
          >
            <div className="modal-admin-card modal-admin-card--cat-products">
              {/* Header */}
              <div className="modal-admin-header">
                <div className="modal-admin-title-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                      <IconFolder size={18} color="var(--primary-color)" /> {viewingCategoryProducts.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: '#f0fdf4',
                        color: '#15803d',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      {catProducts.length} Mẫu sản phẩm • {totalStock} chiếc
                    </span>
                  </div>
                  <p className="modal-admin-subtitle">
                    Slug ID: <code>{viewingCategoryProducts.id}</code> — {viewingCategoryProducts.description || 'Toàn bộ danh sách sản phẩm thuộc danh mục này'}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setViewingCategoryProducts(null)}
                  title="Đóng modal"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="modal-admin-body" style={{ overflowY: 'auto', maxHeight: '65vh', padding: '20px' }}>
                {catProducts.length === 0 ? (
                  <div className="admin-table-empty">
                    <div className="admin-table-empty-icon">
                      <IconPackage size={32} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      Chưa có sản phẩm nào trong danh mục này
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Bạn có thể tạo sản phẩm mới và gán vào danh mục này ngay bên dưới.
                    </p>
                    <button
                      type="button"
                      className="btn-admin-add"
                      onClick={() => {
                        const targetCat = viewingCategoryProducts.id;
                        setViewingCategoryProducts(null);
                        handleOpenAddProduct();
                        setModalCategory(targetCat);
                      }}
                    >
                      <IconPlus size={14} /> Thêm sản phẩm đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="cat-products-grid">
                    {catProducts.map((p) => (
                      <div key={p.id} className="cat-product-card">
                        <div style={{ position: 'relative' }}>
                          <img
                            src={p.image || '/assets/images/products/bo5-1.jpg'}
                            alt={p.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                            }}
                          />
                          {p.badge && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'var(--primary-color)',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-pill)',
                              }}
                            >
                              {p.badge}
                            </span>
                          )}
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              background: p.stock === 'Hết hàng' ? '#ef4444' : '#059669',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            {p.stock} ({p.stockQuantity ?? 50})
                          </span>
                        </div>

                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--text-dark)',
                              lineHeight: 1.35,
                              minHeight: '34px',
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Mã: <code>{p.id}</code>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                              {p.price}
                            </span>
                            {p.oldPrice && (
                              <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-light)' }}>
                                {p.oldPrice}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setViewingCategoryProducts(null);
                                handleOpenEditProduct(p);
                              }}
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: '#ffffff',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                              }}
                            >
                              <IconPencil size={12} /> Sửa SP
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStockQuick(p)}
                              title="Đổi trạng thái còn hàng / hết hàng nhanh"
                              style={{
                                padding: '6px 8px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-subtle)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconRefresh size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-admin-footer">
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Đang hiển thị <strong>{catProducts.length}</strong> sản phẩm thuộc <strong>{viewingCategoryProducts.name}</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-admin-reset"
                    onClick={() => {
                      setProdCategory(viewingCategoryProducts.id);
                      setActiveTab('products');
                      setViewingCategoryProducts(null);
                    }}
                  >
                    Xem & Lọc trong tab Sản phẩm →
                  </button>
                  <button
                    type="button"
                    className="btn-admin-add"
                    onClick={() => {
                      const targetCat = viewingCategoryProducts.id;
                      setViewingCategoryProducts(null);
                      handleOpenAddProduct();
                      setModalCategory(targetCat);
                    }}
                  >
                    <IconPlus size={14} /> Thêm sản phẩm mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =====================================================================
          MODAL 3: VIEW ORDER DETAILS (EXPANDED & BEAUTIFIED)
          ===================================================================== */}
      {currentViewingOrder && (
        <div
          className="modal-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingOrder(null);
          }}
        >
          <div className="modal-admin-card modal-admin-card--xl printable-order-modal">
            {/* Top Bar for Desktop & Actions */}
            <div className="order-detail-header-bar no-print">
              <div className="order-detail-header-left">
                <div className="order-code-badge">
                  <span>#{currentViewingOrder.id}</span>
                  <button
                    type="button"
                    className={`order-copy-btn ${copiedKey === 'order-id' ? 'copied' : ''}`}
                    title="Sao chép mã đơn hàng"
                    onClick={() => handleCopyText('order-id', currentViewingOrder.id)}
                  >
                    {copiedKey === 'order-id' ? (
                      <>
                        <IconCheck size={12} /> Đã chép
                      </>
                    ) : (
                      <>
                        <IconCopy size={12} /> Chép mã
                      </>
                    )}
                  </button>
                </div>

                <span
                  className={`badge-status-${currentViewingOrder.status}`}
                  style={{
                    fontSize: '0.85rem',
                    padding: '6px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {currentViewingOrder.status === 'pending' && <IconClock size={14} />}
                  {currentViewingOrder.status === 'shipping' && <IconTruck size={14} />}
                  {currentViewingOrder.status === 'completed' && <IconCheckCircle size={14} />}
                  {currentViewingOrder.status === 'cancelled' && <IconXCircle size={14} />}
                  {currentViewingOrder.statusText}
                </span>

                <div
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <IconClock size={14} /> Thời gian đặt: <strong>{currentViewingOrder.date}</strong>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handlePrintOrder(currentViewingOrder)}
                  className="btn-admin-reset"
                  style={{ padding: '8px 14px', fontSize: '0.825rem' }}
                  title="In hóa đơn đơn hàng"
                >
                  <IconPrinter size={15} /> In hóa đơn
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditOrder(currentViewingOrder);
                    setViewingOrder(null);
                  }}
                  className="btn-admin-reset"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.825rem',
                    color: '#2563eb',
                    borderColor: '#bfdbfe',
                    backgroundColor: '#eff6ff',
                  }}
                  title="Chỉnh sửa thông tin đơn hàng"
                >
                  <IconPencil size={15} /> Sửa đơn
                </button>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setViewingOrder(null)}
                  title="Đóng modal"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Print Only Header */}
            <div
              style={{
                display: 'none',
                padding: '24px 0 16px 0',
                borderBottom: '2px solid #0f172a',
                marginBottom: '20px',
              }}
              className="print-only-block"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '0.05em' }}>
                    TANPOLO LEATHER GOODS
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0 0' }}>
                    Đồ Da Thủ Công Cao Cấp • Hotline: 0987.654.321
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>HÓA ĐƠN BÁN HÀNG</h2>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    Mã đơn: <strong>#{currentViewingOrder.id}</strong> | Ngày đặt: {currentViewingOrder.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="order-detail-body">
              {/* ORDER STEPPER TRACKER */}
              <div className="order-stepper-wrapper no-print">
                <div className="order-stepper-title">
                  <span>Tiến trình xử lý đơn hàng</span>
                  <span style={{ fontWeight: 600, textTransform: 'none', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Cập nhật trực tiếp:
                  </span>
                </div>

                {currentViewingOrder.status === 'cancelled' ? (
                  <div
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      color: '#b91c1c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconXCircle size={22} />
                      <div>
                        <strong>Đơn hàng này đã bị hủy</strong>
                        <div style={{ fontSize: '0.8rem', marginTop: '2px', color: '#dc2626' }}>
                          Trạng thái hiện tại không thể giao vận. Bạn có thể khôi phục lại đơn nếu cần.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-step-action outline"
                      style={{ borderColor: '#fca5a5', color: '#b91c1c' }}
                      onClick={() => updateOrderStatus(currentViewingOrder.id, 'pending')}
                    >
                      <IconRefresh size={14} /> Khôi phục về Đang xử lý
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="order-stepper-track">
                      {/* Step 1: Pending */}
                      <div
                        className={`order-step-node ${
                          currentViewingOrder.status === 'completed' || currentViewingOrder.status === 'shipping'
                            ? 'completed'
                            : 'current'
                        }`}
                      >
                        {/* Connector line from Step 1 to Step 2 */}
                        <div
                          className={`order-step-connector ${
                            currentViewingOrder.status === 'completed' || currentViewingOrder.status === 'shipping'
                              ? 'active'
                              : ''
                          }`}
                        />
                        <div className="order-step-icon-circle">
                          {currentViewingOrder.status === 'completed' || currentViewingOrder.status === 'shipping' ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconClock size={18} />
                          )}
                        </div>
                        <div className="order-step-label">1. Tiếp nhận đơn</div>
                        <div className="order-step-desc">Chờ duyệt & đóng gói</div>
                      </div>

                      {/* Step 2: Shipping */}
                      <div
                        className={`order-step-node ${
                          currentViewingOrder.status === 'completed'
                            ? 'completed'
                            : currentViewingOrder.status === 'shipping'
                            ? 'current'
                            : ''
                        }`}
                      >
                        {/* Connector line from Step 2 to Step 3 */}
                        <div
                          className={`order-step-connector ${
                            currentViewingOrder.status === 'completed' ? 'active' : ''
                          }`}
                        />
                        <div className="order-step-icon-circle">
                          {currentViewingOrder.status === 'completed' ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconTruck size={18} />
                          )}
                        </div>
                        <div className="order-step-label">2. Đang giao hàng</div>
                        <div className="order-step-desc">Đang vận chuyển</div>
                      </div>

                      {/* Step 3: Completed (No connector line) */}
                      <div
                        className={`order-step-node ${
                          currentViewingOrder.status === 'completed' ? 'completed' : ''
                        }`}
                      >
                        <div className="order-step-icon-circle">
                          <IconCheckCircle size={18} />
                        </div>
                        <div className="order-step-label">3. Giao thành công</div>
                        <div className="order-step-desc">Khách đã nhận hàng</div>
                      </div>
                    </div>

                    {/* Quick Stepper Action Buttons */}
                    <div className="order-stepper-actions">
                      <div className="order-stepper-quick-btns">
                        {currentViewingOrder.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn-step-action info"
                              onClick={() => updateOrderStatus(currentViewingOrder.id, 'shipping')}
                            >
                              <IconTruck size={14} /> Bắt đầu giao hàng
                            </button>
                            <button
                              type="button"
                              className="btn-step-action danger"
                              onClick={() => {
                                if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                  updateOrderStatus(currentViewingOrder.id, 'cancelled');
                                }
                              }}
                            >
                              <IconXCircle size={14} /> Hủy đơn hàng
                            </button>
                          </>
                        )}

                        {currentViewingOrder.status === 'shipping' && (
                          <>
                            <button
                              type="button"
                              className="btn-step-action primary"
                              onClick={() => updateOrderStatus(currentViewingOrder.id, 'completed')}
                            >
                              <IconCheckCircle size={14} /> Xác nhận Giao thành công
                            </button>
                            <button
                              type="button"
                              className="btn-step-action outline"
                              onClick={() => updateOrderStatus(currentViewingOrder.id, 'pending')}
                            >
                              <IconClock size={14} /> Về Chờ xử lý
                            </button>
                            <button
                              type="button"
                              className="btn-step-action danger"
                              onClick={() => {
                                if (window.confirm('Khách từ chối nhận hoặc hủy đơn?')) {
                                  updateOrderStatus(currentViewingOrder.id, 'cancelled');
                                }
                              }}
                            >
                              <IconXCircle size={14} /> Hủy đơn
                            </button>
                          </>
                        )}

                        {currentViewingOrder.status === 'completed' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                color: '#059669',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <IconCheckCircle size={16} /> Đơn hàng đã hoàn thành và quyết toán thành công
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Dropdown status selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Chuyển nhanh:</span>
                        <select
                          className="form-control"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.82rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                            minWidth: '150px',
                          }}
                          value={currentViewingOrder.status}
                          onChange={(e) =>
                            updateOrderStatus(currentViewingOrder.id, e.target.value as Order['status'])
                          }
                        >
                          <option value="pending">Chờ xử lý (Pending)</option>
                          <option value="shipping">Đang giao hàng (Shipping)</option>
                          <option value="completed">Giao thành công (Completed)</option>
                          <option value="cancelled">Đã hủy đơn (Cancelled)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* TWO-COLUMN CONTENT GRID */}
              <div className="order-detail-layout-grid">
                {/* LEFT COLUMN: ITEMS & FINANCIALS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Card: Sản phẩm trong đơn */}
                  <div className="order-card">
                    <div className="order-card-header">
                      <h3 className="order-card-title">
                        <IconPackage size={18} color="var(--primary-color)" />
                        Danh sách sản phẩm ({currentViewingOrder.items?.length || 0})
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Đồ da Tanpolo chính hãng
                      </span>
                    </div>

                    <div className="order-card-body" style={{ padding: 0 }}>
                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th style={{ textAlign: 'center' }}>Đơn giá</th>
                            <th style={{ textAlign: 'center' }}>Số lượng</th>
                            <th style={{ textAlign: 'right' }}>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentViewingOrder.items?.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="order-product-cell">
                                  <img
                                    src={item.image || '/assets/images/products/bo5-1.jpg'}
                                    alt={item.name}
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        '/assets/images/products/bo5-1.jpg';
                                    }}
                                  />
                                  <div>
                                    <div className="order-product-name">{item.name}</div>
                                    <div className="order-product-cat">
                                      {item.categoryName ? (
                                        <span>Danh mục: {item.categoryName}</span>
                                      ) : (
                                        <span>Mã SP: {item.id}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {item.price}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className="order-item-qty-badge">x{item.quantity}</span>
                              </td>
                              <td className="order-item-total">
                                {formatPrice(item.priceValue * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Card: Bảng tính tiền & Phương thức thanh toán */}
                  <div className="order-card">
                    <div className="order-card-header">
                      <h3 className="order-card-title">
                        <IconCreditCard size={18} color="var(--primary-color)" />
                        Thanh toán & Vận chuyển
                      </h3>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          background:
                            currentViewingOrder.paymentMethod.toLowerCase().includes('chuyển khoản')
                              ? '#dbeafe'
                              : '#fef3c7',
                          color:
                            currentViewingOrder.paymentMethod.toLowerCase().includes('chuyển khoản')
                              ? '#1e40af'
                              : '#92400e',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 700,
                        }}
                      >
                        {currentViewingOrder.paymentMethod.toLowerCase().includes('chuyển khoản')
                          ? 'Đã xác nhận thanh toán CK'
                          : 'Thu tiền khi giao hàng (COD)'}
                      </span>
                    </div>

                    <div className="order-card-body">
                      <div className="order-finance-box" style={{ marginTop: 0 }}>
                        <div className="order-finance-row">
                          <span>Tạm tính tiền hàng:</span>
                          <strong>{formatPrice(currentViewingOrder.subtotal)}</strong>
                        </div>

                        <div className="order-finance-row">
                          <span>Phí vận chuyển toàn quốc:</span>
                          <span>
                            {currentViewingOrder.shippingFee === 0 ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>Miễn phí giao hàng</span>
                            ) : (
                              formatPrice(currentViewingOrder.shippingFee)
                            )}
                          </span>
                        </div>

                        <div className="order-finance-row">
                          <span>Phương thức thanh toán:</span>
                          <strong>{currentViewingOrder.paymentMethod}</strong>
                        </div>

                        <div className="order-finance-row total-row">
                          <span>Tổng cộng thanh toán:</span>
                          <span className="total-amount">{currentViewingOrder.totalFormatted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CUSTOMER, ADDRESS, NOTES, ACTIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Card: Thông tin khách hàng */}
                  <div className="order-card">
                    <div className="order-card-header">
                      <h3 className="order-card-title">
                        <IconUser size={18} color="var(--primary-color)" />
                        Khách hàng & Nhận hàng
                      </h3>
                    </div>

                    <div className="order-card-body">
                      {/* Customer Avatar & Name */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingBottom: '14px',
                          borderBottom: '1px solid var(--border-color)',
                          marginBottom: '10px',
                        }}
                      >
                        <div className="order-customer-avatar">
                          {currentViewingOrder.customer ? currentViewingOrder.customer.charAt(0).toUpperCase() : 'K'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>
                            {currentViewingOrder.customer}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Khách hàng đặt qua Website
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="order-info-line">
                        <div className="order-info-icon">
                          <IconPhone size={16} />
                        </div>
                        <div className="order-info-content">
                          <div className="order-info-label">Số điện thoại</div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                            }}
                          >
                            <a
                              href={`tel:${currentViewingOrder.phone}`}
                              style={{
                                color: '#2563eb',
                                fontWeight: 700,
                                fontSize: '0.92rem',
                                textDecoration: 'none',
                              }}
                            >
                              {currentViewingOrder.phone}
                            </a>
                            <button
                              type="button"
                              className={`order-copy-btn ${copiedKey === 'phone' ? 'copied' : ''}`}
                              onClick={() => handleCopyText('phone', currentViewingOrder.phone)}
                            >
                              {copiedKey === 'phone' ? (
                                <>
                                  <IconCheck size={11} /> Đã chép
                                </>
                              ) : (
                                <>
                                  <IconCopy size={11} /> Chép
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="order-info-line">
                        <div className="order-info-icon">
                          <IconMapPin size={16} />
                        </div>
                        <div className="order-info-content">
                          <div className="order-info-label">Địa chỉ nhận hàng</div>
                          <div className="order-info-val">{currentViewingOrder.address}</div>
                          <div style={{ marginTop: '6px' }}>
                            <button
                              type="button"
                              className={`order-copy-btn ${copiedKey === 'address' ? 'copied' : ''}`}
                              onClick={() => handleCopyText('address', currentViewingOrder.address)}
                            >
                              {copiedKey === 'address' ? (
                                <>
                                  <IconCheck size={11} /> Đã sao chép địa chỉ
                                </>
                              ) : (
                                <>
                                  <IconCopy size={11} /> Sao chép địa chỉ
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Ghi chú đơn hàng */}
                  <div className="order-card">
                    <div className="order-card-header">
                      <h3 className="order-card-title">
                        <IconFileText size={18} color="var(--primary-color)" />
                        Ghi chú từ khách hàng
                      </h3>
                    </div>
                    <div className="order-card-body">
                      {currentViewingOrder.notes && currentViewingOrder.notes.trim() ? (
                        <div className="order-notes-box">
                          <strong>Lời nhắn:</strong> &ldquo;{currentViewingOrder.notes}&rdquo;
                        </div>
                      ) : (
                        <div
                          style={{
                            color: 'var(--text-light)',
                            fontStyle: 'italic',
                            fontSize: '0.84rem',
                            padding: '6px 0',
                          }}
                        >
                          Không có ghi chú thêm từ khách hàng
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card: Thao tác quản trị */}
                  <div className="order-card no-print">
                    <div className="order-card-header">
                      <h3 className="order-card-title">
                        <IconSettings size={18} color="var(--primary-color)" />
                        Thao tác quản trị
                      </h3>
                    </div>
                    <div className="order-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenEditOrder(currentViewingOrder);
                          setViewingOrder(null);
                        }}
                        className="btn-admin-reset"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          color: '#2563eb',
                          borderColor: '#bfdbfe',
                          padding: '10px',
                        }}
                      >
                        <IconPencil size={15} /> Chỉnh sửa thông tin đơn hàng
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintOrder(currentViewingOrder)}
                        className="btn-admin-reset"
                        style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                      >
                        <IconPrinter size={15} /> In phiếu giao hàng / Hóa đơn
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng "${currentViewingOrder.id}"?`
                            )
                          ) {
                            deleteOrder(currentViewingOrder.id);
                            setViewingOrder(null);
                          }
                        }}
                        className="btn-admin-reset"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          color: '#ef4444',
                          borderColor: '#fca5a5',
                          padding: '10px',
                        }}
                      >
                        <IconTrash size={15} /> Xóa vĩnh viễn đơn hàng này
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-admin-footer no-print">
              <div style={{ flex: 1, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Tổng giá trị đơn: <strong style={{ color: '#059669', fontSize: '1rem' }}>{currentViewingOrder.totalFormatted}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handlePrintOrder(currentViewingOrder)}
                  className="btn-admin-reset"
                >
                  <IconPrinter size={15} /> In hóa đơn
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="btn-admin-add"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: EDIT ORDER (EXPANDED & BEAUTIFIED)
          ===================================================================== */}
      {isOrderEditModalOpen && editingOrder && (
        <div
          className="modal-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOrderEditModalOpen(false);
          }}
        >
          <div className="modal-admin-card modal-admin-card--edit-order">
            {/* Modal Header */}
            <div className="modal-admin-header">
              <div className="modal-admin-title-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                    <IconPencil size={18} color="var(--primary-color)" /> Cập Nhật Đơn Hàng #{editingOrder.id}
                  </h3>
                  <span className={`badge-status-${editOrderStatus}`} style={{ fontSize: '0.8rem', padding: '3px 10px' }}>
                    {editOrderStatus === 'pending' && 'Đang xử lý'}
                    {editOrderStatus === 'shipping' && 'Đang giao hàng'}
                    {editOrderStatus === 'completed' && 'Giao thành công'}
                    {editOrderStatus === 'cancelled' && 'Đã hủy đơn'}
                  </span>
                </div>
                <p className="modal-admin-subtitle">
                  Thời gian đặt: {editingOrder.date} • Tổng tiền: <strong style={{ color: '#059669' }}>{editingOrder.totalFormatted}</strong>
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsOrderEditModalOpen(false)}
                title="Đóng modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body Form */}
            <form id="order-edit-form" onSubmit={handleSaveOrderEditForm} className="modal-admin-body">
              <div className="order-edit-grid">
                {/* Left Column: Form Inputs */}
                <div className="order-edit-section">
                  <div className="order-edit-section-title">
                    <IconUser size={15} /> Thông tin người nhận & Địa chỉ
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Tên khách hàng (*)</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="Họ và tên khách hàng"
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
                        placeholder="Số điện thoại liên hệ"
                        value={editOrderPhone}
                        onChange={(e) => setEditOrderPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Địa chỉ giao hàng chi tiết (*)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      required
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      value={editOrderAddress}
                      onChange={(e) => setEditOrderAddress(e.target.value)}
                    />
                  </div>

                  <div className="order-edit-section-title" style={{ marginTop: '8px' }}>
                    <IconSettings size={15} /> Trạng thái & Ghi chú
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trạng thái xử lý đơn hàng (*)</label>
                    <select
                      className="form-input"
                      style={{ fontWeight: 600 }}
                      value={editOrderStatus}
                      onChange={(e) => setEditOrderStatus(e.target.value as Order['status'])}
                    >
                      <option value="pending">⏳ Chờ xử lý (Pending) - Tiếp nhận đơn</option>
                      <option value="shipping">🚚 Đang giao hàng (Shipping) - Bàn giao vận chuyển</option>
                      <option value="completed">✅ Giao thành công (Completed) - Đã thanh toán</option>
                      <option value="cancelled">❌ Đã hủy đơn (Cancelled) - Hủy đơn hàng</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ghi chú đơn hàng / Lời nhắn</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="Ghi chú giao giờ hành chính, gọi trước khi giao, v.v..."
                      value={editOrderNotes}
                      onChange={(e) => setEditOrderNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Column: Order Preview & Items Summary */}
                <div className="order-edit-preview-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      Sản phẩm trong đơn ({editingOrder.items?.length || 0})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {editingOrder.paymentMethod}
                    </span>
                  </div>

                  {/* Items Scrollable List */}
                  <div className="order-edit-items-scroll">
                    {editingOrder.items?.map((item, idx) => (
                      <div key={idx} className="order-edit-item-row">
                        <img
                          src={item.image || '/assets/images/products/bo5-1.jpg'}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              '/assets/images/products/bo5-1.jpg';
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: 'var(--text-dark)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.price} • Số lượng: <strong>x{item.quantity}</strong>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', flexShrink: 0 }}>
                          {formatPrice(item.priceValue * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Summary */}
                  <div
                    style={{
                      borderTop: '1px dashed var(--border-color)',
                      paddingTop: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tạm tính:</span>
                      <strong>{formatPrice(editingOrder.subtotal)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Phí giao hàng:</span>
                      <span>
                        {editingOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(editingOrder.shippingFee)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '8px',
                        marginTop: '2px',
                        color: 'var(--text-dark)',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                      }}
                    >
                      <span>Tổng thanh toán:</span>
                      <span style={{ color: '#059669', fontSize: '1.05rem' }}>{editingOrder.totalFormatted}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f1f5f9',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    💡 <em>Thay đổi thông tin sẽ được cập nhật đồng bộ lên cơ sở dữ liệu và áp dụng ngay lập tức cho quy trình xử lý đơn hàng.</em>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="modal-admin-footer">
              <button
                type="button"
                className="btn-admin-reset"
                onClick={() => {
                  setViewingOrder(editingOrder);
                  setIsOrderEditModalOpen(false);
                }}
                style={{ marginRight: 'auto' }}
                title="Xem chi tiết đầy đủ đơn hàng"
              >
                <IconEye size={14} /> Xem chi tiết đơn
              </button>

              <button
                type="button"
                className="btn-admin-reset"
                onClick={() => setIsOrderEditModalOpen(false)}
              >
                Hủy bỏ
              </button>

              <button type="submit" form="order-edit-form" className="btn-admin-add">
                <IconSave size={14} /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: MANUAL ORDER CREATION (REVAMPED & BEAUTIFIED)
          ===================================================================== */}
      {isManualOrderModalOpen && (() => {
        const manualSubtotal = manualCartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
        const manualShippingFee = manualCartItems.length > 0 ? (manualSubtotal >= 500000 ? 0 : 30000) : 0;
        const manualTotal = manualSubtotal + manualShippingFee;
        const currentProd = products.find((p) => p.id === manualSelectedProdId) || products[0];

        return (
          <div
            className="modal-overlay open"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsManualOrderModalOpen(false);
            }}
          >
            <div className="modal-admin-card modal-admin-card--manual-order">
              {/* Modal Header */}
              <div className="modal-admin-header">
                <div className="modal-admin-title-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                      <IconPlus size={18} color="var(--primary-color)" /> Tạo Đơn Hàng Mới (Thủ Công)
                    </h3>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-pill)',
                        background: '#eff6ff',
                        color: '#2563eb',
                      }}
                    >
                      Bán tại quầy / Hotline
                    </span>
                  </div>
                  <p className="modal-admin-subtitle">
                    Khởi tạo đơn đặt hàng nhanh chóng, tính toán phí giao hàng và doanh thu tự động
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  title="Đóng modal"
                >
                  ×
                </button>
              </div>

              {/* Modal Body Form */}
              <form id="manual-order-form" onSubmit={handleSaveManualOrder} className="modal-admin-body">
                <div className="manual-order-grid">
                  {/* Left Column: Customer & Delivery Info */}
                  <div className="order-edit-section">
                    <div className="order-edit-section-title">
                      <IconUser size={15} /> Thông tin khách hàng & Giao hàng
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Tên khách hàng (*)</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          placeholder="Họ và tên khách hàng"
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
                          placeholder="Số điện thoại liên hệ"
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Địa chỉ giao hàng chi tiết (*)</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        required
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                      />
                    </div>

                    <div className="order-edit-section-title" style={{ marginTop: '8px' }}>
                      <IconCreditCard size={15} /> Thanh toán & Lời nhắn
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phương thức thanh toán</label>
                      <select
                        className="form-input"
                        value={manualPaymentMethod}
                        onChange={(e) => setManualPaymentMethod(e.target.value)}
                        style={{ fontWeight: 600 }}
                      >
                        <option value="COD">💵 Thanh toán khi nhận hàng (COD)</option>
                        <option value="QR Banking">💳 Chuyển khoản QR Banking (Đã nhận tiền)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ghi chú đơn hàng / Lời nhắn</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Ghi chú giao giờ hành chính, gọi trước khi giao, v.v..."
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Right Column: Product Picker, Cart Items & Summary */}
                  <div className="manual-prod-picker-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Thêm sản phẩm vào đơn
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Kho: {products.length} mẫu
                      </span>
                    </div>

                    {/* Product Selection Row with Thumbnail */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <img
                          src={currentProd?.image || '/assets/images/products/bo5-1.jpg'}
                          alt="Selected product"
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <select
                            className="form-input"
                            style={{ fontSize: '0.825rem', padding: '6px 10px', width: '100%' }}
                            value={manualSelectedProdId}
                            onChange={(e) => setManualSelectedProdId(e.target.value)}
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} — {p.price}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Số lượng:</span>
                          <div className="manual-qty-control">
                            <button
                              type="button"
                              className="manual-qty-btn"
                              onClick={() => setManualProdQty(Math.max(1, manualProdQty - 1))}
                            >
                              -
                            </button>
                            <span className="manual-qty-val">{manualProdQty}</span>
                            <button
                              type="button"
                              className="manual-qty-btn"
                              onClick={() => setManualProdQty(manualProdQty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddManualItem}
                          className="btn-admin-add"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          <IconPlus size={13} /> Thêm vào đơn
                        </button>
                      </div>
                    </div>

                    {/* Selected Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        Sản phẩm đã chọn ({manualCartItems.length})
                      </span>

                      {manualCartItems.length === 0 ? (
                        <div
                          style={{
                            padding: '24px 16px',
                            textAlign: 'center',
                            background: '#ffffff',
                            border: '1px dashed var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-muted)',
                            fontSize: '0.82rem',
                          }}
                        >
                          Chưa có sản phẩm nào trong đơn hàng.
                          <br />
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                            Vui lòng chọn sản phẩm ở trên và bấm &quot;Thêm vào đơn&quot;
                          </span>
                        </div>
                      ) : (
                        <div className="order-edit-items-scroll">
                          {manualCartItems.map((item, idx) => (
                            <div key={idx} className="manual-cart-item">
                              <img
                                src={item.image || '/assets/images/products/bo5-1.jpg'}
                                alt={item.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                                }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: 'var(--text-dark)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  {item.price}
                                </div>
                              </div>

                              <div className="manual-qty-control">
                                <button
                                  type="button"
                                  className="manual-qty-btn"
                                  onClick={() => handleUpdateManualItemQty(idx, -1)}
                                >
                                  -
                                </button>
                                <span className="manual-qty-val">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="manual-qty-btn"
                                  onClick={() => handleUpdateManualItemQty(idx, 1)}
                                >
                                  +
                                </button>
                              </div>

                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', minWidth: '70px', textAlign: 'right' }}>
                                {formatPrice(item.priceValue * item.quantity)}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveManualItem(idx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                title="Xóa món này"
                              >
                                <IconTrash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Financial Summary Box */}
                    <div
                      style={{
                        borderTop: '1px dashed var(--border-color)',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.825rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Tạm tính:</span>
                        <strong>{formatPrice(manualSubtotal)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Phí giao hàng:</span>
                        <span>
                          {manualShippingFee === 0 && manualCartItems.length > 0 ? (
                            <span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí (Đơn ≥ 500k)</span>
                          ) : (
                            formatPrice(manualShippingFee)
                          )}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '8px',
                          marginTop: '2px',
                          color: 'var(--text-dark)',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                        }}
                      >
                        <span>Tổng thanh toán:</span>
                        <span style={{ color: '#059669', fontSize: '1.1rem' }}>{formatPrice(manualTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="modal-admin-footer">
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Tổng số món: <strong>{manualCartItems.reduce((s, i) => s + i.quantity, 0)}</strong> sản phẩm
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-admin-reset"
                    onClick={() => setIsManualOrderModalOpen(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    form="manual-order-form"
                    disabled={manualCartItems.length === 0}
                    className="btn-admin-add"
                  >
                    <IconRocket size={14} /> Tạo đơn hàng {manualTotal > 0 && `• ${formatPrice(manualTotal)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      {/* =====================================================================
          MODAL 7: ADD / EDIT CUSTOMER
          ===================================================================== */}
      {isCustomerModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-admin-card" style={{ maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                {editingCustomer ? (<><IconPencil size={16} /> Chỉnh Sửa Khách Hàng</>) : (<><IconUsers size={16} /> Thêm Khách Hàng Mới</>)}
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
                  <option value="customer">Khách hàng (Customer)</option>
                  <option value="staff">Nhân viên (Staff)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
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
                  <IconSave size={14} /> {editingCustomer ? 'Cập nhật khách hàng' : 'Lưu khách hàng mới'}
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
                <IconPackage size={16} /> Điều Chỉnh Tồn Kho Sản Phẩm
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
                    <IconPlus size={14} /> Nhập thêm
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
                    <IconMinus size={14} /> Xuất bớt
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
                    <IconTarget size={14} /> Đặt lại tồn
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
                  <option value="Nhập hàng từ xưởng sản xuất">Nhập hàng từ xưởng sản xuất</option>
                  <option value="Kiểm kê kho định kỳ">Kiểm kê kho định kỳ</option>
                  <option value="Xuất hàng hỏng / lỗi tiêu hủy">Xuất hàng hỏng / lỗi tiêu hủy</option>
                  <option value="Khách trả hàng / hoàn tồn">Khách trả hàng / hoàn tồn</option>
                  <option value="Xuất bán buôn / chuyển kho">Xuất bán buôn / chuyển kho</option>
                  <option value="Khác">Khác (Ghi chú tự do)</option>
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
                  <IconSave size={14} /> Lưu & Cập nhật tồn kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
