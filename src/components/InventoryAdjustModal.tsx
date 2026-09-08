'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import {
  IconPackage,
  IconPlus,
  IconMinus,
  IconTarget,
  IconSave,
  IconX,
  IconCheck,
  IconAlertTriangle,
  IconCreditCard,
  IconLayers,
  IconClock,
} from './icons';

interface InventoryAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts?: Product[];
  initialType?: 'add' | 'subtract' | 'set';
  onAdjust: (
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ) => Promise<void> | void;
}

const REASONS_ADD = [
  'Nhập hàng thành phẩm từ xưởng da Tanpolo',
  'Khách trả hàng / Hoàn tồn kho',
  'Chuyển từ kho chi nhánh / Showroom khác về',
  'Thu hồi sản phẩm trưng bày về kho',
  'Khác',
];

const REASONS_SUBTRACT = [
  'Xuất tiêu hủy sản phẩm lỗi / da trầy xước',
  'Xuất hàng mẫu / quà tặng đối tác',
  'Xuất bán buôn / Chuyển kho đại lý sỉ',
  'Hàng thất thoát / Hư hỏng trong lưu kho',
  'Khác',
];

const REASONS_SET = [
  'Kiểm kê kho định kỳ showroom',
  'Cân bằng sai lệch tồn kho thực tế',
  'Thiết lập định mức tồn kho đầu kỳ',
  'Khác',
];

const InventoryAdjustModalContent: React.FC<{
  product: Product;
  allProducts: Product[];
  initialType?: 'add' | 'subtract' | 'set';
  onClose: () => void;
  onAdjust: (
    productId: string,
    payload: { newQuantity?: number; changeQuantity?: number; reason?: string }
  ) => Promise<void> | void;
}> = ({ product, allProducts, initialType = 'add', onClose, onAdjust }) => {
  const [selectedProductId, setSelectedProductId] = useState(product.id);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract' | 'set'>(initialType);
  const [qtyValue, setQtyValue] = useState<number | ''>(
    initialType === 'set' ? (product.stockQuantity !== undefined ? product.stockQuantity : 50) : 10
  );

  const defaultReason = useMemo(() => {
    if (initialType === 'add') return REASONS_ADD[0];
    if (initialType === 'subtract') return REASONS_SUBTRACT[0];
    return REASONS_SET[0];
  }, [initialType]);

  const [reason, setReason] = useState(defaultReason);
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active product based on selector
  const activeProduct = useMemo(() => {
    return allProducts.find((p) => p.id === selectedProductId) || product;
  }, [allProducts, selectedProductId, product]);

  const currentStock = activeProduct.stockQuantity !== undefined ? activeProduct.stockQuantity : 50;

  // Change default reason when mode changes
  const handleModeChange = (mode: 'add' | 'subtract' | 'set') => {
    setAdjustType(mode);
    if (mode === 'add') {
      setReason(REASONS_ADD[0]);
      setQtyValue(10);
    } else if (mode === 'subtract') {
      setReason(REASONS_SUBTRACT[0]);
      setQtyValue(Math.min(5, currentStock));
    } else {
      setReason(REASONS_SET[0]);
      setQtyValue(currentStock);
    }
  };

  // Quick preset helper
  const handlePresetClick = (val: number, isDirectSet: boolean = false) => {
    if (isDirectSet) {
      setQtyValue(val);
    } else {
      setQtyValue((prev) => (typeof prev === 'number' ? prev + val : val));
    }
  };

  // Calculations
  const numVal = typeof qtyValue === 'number' ? qtyValue : 0;

  let finalStock = currentStock;
  let deltaStock = 0;

  if (adjustType === 'add') {
    deltaStock = numVal;
    finalStock = currentStock + numVal;
  } else if (adjustType === 'subtract') {
    deltaStock = -numVal;
    finalStock = Math.max(0, currentStock - numVal);
  } else if (adjustType === 'set') {
    deltaStock = numVal - currentStock;
    finalStock = Math.max(0, numVal);
  }

  const isOverSubtract = adjustType === 'subtract' && numVal > currentStock;

  const currentTotalVal = currentStock * activeProduct.priceValue;
  const newTotalVal = finalStock * activeProduct.priceValue;
  const deltaTotalVal = deltaStock * activeProduct.priceValue;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyValue === '' || isOverSubtract) return;

    setIsSubmitting(true);
    const finalReasonText = reason === 'Khác' ? (customReason.trim() || 'Điều chỉnh tồn kho') : reason;

    try {
      if (adjustType === 'set') {
        await onAdjust(activeProduct.id, {
          newQuantity: numVal,
          reason: finalReasonText,
        });
      } else if (adjustType === 'add') {
        await onAdjust(activeProduct.id, {
          changeQuantity: numVal,
          reason: finalReasonText,
        });
      } else if (adjustType === 'subtract') {
        await onAdjust(activeProduct.id, {
          changeQuantity: -numVal,
          reason: finalReasonText,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonList = adjustType === 'add' ? REASONS_ADD : adjustType === 'subtract' ? REASONS_SUBTRACT : REASONS_SET;

  return (
    <div className="modal-admin-card inventory-modal-card">
      {/* 1. MODAL HEADER */}
      <div className="inventory-modal-header">
        <div className="inventory-modal-header-left">
          <div className="inventory-header-icon-box">
            <IconPackage size={22} />
          </div>
          <div>
            <h2 className="inventory-modal-title">Điều Chỉnh Tồn Kho Sản Phẩm</h2>
            <p className="inventory-modal-subtitle">
              Quản lý nhập xuất, kiểm kê định kỳ và cân bằng số lượng kho hàng Tanpolo
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inventory-modal-close-btn"
          onClick={onClose}
          title="Đóng cửa sổ"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* 2. PRODUCT SELECTOR & OVERVIEW BANNER */}
      <div className="inventory-product-banner">
        <div className="inventory-product-banner-top">
          <div className="inventory-prod-info-group">
            <img
              src={activeProduct.image || '/assets/images/products/bo5-1.jpg'}
              alt={activeProduct.name}
              className="inventory-product-thumb"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
              }}
            />
            <div className="inventory-product-meta">
              <div className="inventory-product-title-row">
                <span className="inventory-product-name">{activeProduct.name}</span>
                {activeProduct.categoryName && (
                  <span className="inventory-cat-badge">{activeProduct.categoryName}</span>
                )}
              </div>
              <div className="inventory-product-sub-row">
                <span>Mã SP: <strong>#{activeProduct.id}</strong></span>
                <span className="dot-sep">•</span>
                <span>Đơn giá: <strong className="text-price">{activeProduct.price}</strong></span>
              </div>
            </div>
          </div>

          {/* Product Switcher dropdown */}
          {allProducts.length > 1 && (
            <div className="inventory-product-switcher">
              <label htmlFor="inv-prod-switch" className="switcher-label">Đổi sản phẩm:</label>
              <select
                id="inv-prod-switch"
                className="switcher-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Tồn: {p.stockQuantity !== undefined ? p.stockQuantity : 50})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Current Stock Metrics Bar */}
        <div className="inventory-current-metrics-bar">
          <div className="stock-metric-pill">
            <span className="pill-label">Tồn kho hiện hành:</span>
            <span className={`pill-val ${currentStock === 0 ? 'out' : currentStock <= 5 ? 'low' : 'good'}`}>
              {currentStock} chiếc ({currentStock === 0 ? 'Hết hàng' : currentStock <= 5 ? 'Sắp hết' : 'Còn hàng'})
            </span>
          </div>

          <div className="stock-metric-pill">
            <span className="pill-label">Giá trị vốn lưu kho:</span>
            <span className="pill-val val-money">{formatPrice(currentTotalVal)}</span>
          </div>
        </div>
      </div>

      {/* 3. FORM BODY */}
      <form onSubmit={handleSubmit} className="inventory-modal-body">
        {/* Mode Selector (3 Cards) */}
        <div className="inventory-mode-section">
          <label className="inventory-field-label">
            <IconLayers size={15} />
            <span>Phương thức điều chỉnh kho <strong className="text-danger">(*)</strong></span>
          </label>

          <div className="inventory-mode-cards-grid">
            {/* ADD MODE */}
            <div
              className={`inventory-mode-card mode-add ${adjustType === 'add' ? 'active' : ''}`}
              onClick={() => handleModeChange('add')}
            >
              <div className="mode-card-icon add">
                <IconPlus size={18} />
              </div>
              <div className="mode-card-text">
                <div className="mode-card-title">1. Nhập thêm kho</div>
                <div className="mode-card-desc">Cộng thêm số lượng khi xưởng giao hàng mới hoặc khách hoàn trả.</div>
              </div>
              <div className="mode-radio-check">
                {adjustType === 'add' && <IconCheck size={12} />}
              </div>
            </div>

            {/* SUBTRACT MODE */}
            <div
              className={`inventory-mode-card mode-subtract ${adjustType === 'subtract' ? 'active' : ''}`}
              onClick={() => handleModeChange('subtract')}
            >
              <div className="mode-card-icon subtract">
                <IconMinus size={18} />
              </div>
              <div className="mode-card-text">
                <div className="mode-card-title">2. Xuất giảm kho</div>
                <div className="mode-card-desc">Trừ tồn kho khi xuất hàng lỗi, tiêu hủy, hoặc giao cho đại lý sỉ.</div>
              </div>
              <div className="mode-radio-check">
                {adjustType === 'subtract' && <IconCheck size={12} />}
              </div>
            </div>

            {/* SET MODE */}
            <div
              className={`inventory-mode-card mode-set ${adjustType === 'set' ? 'active' : ''}`}
              onClick={() => handleModeChange('set')}
            >
              <div className="mode-card-icon set">
                <IconTarget size={18} />
              </div>
              <div className="mode-card-text">
                <div className="mode-card-title">3. Kiểm kê thực tế</div>
                <div className="mode-card-desc">Ghi đè con số tồn kho chính xác sau khi kiểm đếm thực tế tại cửa hàng.</div>
              </div>
              <div className="mode-radio-check">
                {adjustType === 'set' && <IconCheck size={12} />}
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Input & Preset Chips */}
        <div className="inventory-qty-section">
          <label className="inventory-field-label">
            <IconCreditCard size={15} />
            <span>
              {adjustType === 'add'
                ? 'Số lượng nhập thêm vào kho (Chiếc)'
                : adjustType === 'subtract'
                ? 'Số lượng xuất giảm trừ kho (Chiếc)'
                : 'Số lượng tồn kho thực tế sau kiểm kê (Chiếc)'}{' '}
              <strong className="text-danger">(*)</strong>
            </span>
          </label>

          <div className="inventory-qty-control-row">
            <div className="inventory-number-stepper">
              <button
                type="button"
                className="btn-stepper minus"
                onClick={() => setQtyValue((prev) => Math.max(0, (typeof prev === 'number' ? prev : 0) - 1))}
                disabled={qtyValue === 0}
              >
                <IconMinus size={16} />
              </button>
              <input
                type="number"
                min="0"
                required
                className="inventory-qty-input"
                value={qtyValue}
                onChange={(e) => setQtyValue(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              />
              <button
                type="button"
                className="btn-stepper plus"
                onClick={() => setQtyValue((prev) => (typeof prev === 'number' ? prev : 0) + 1)}
              >
                <IconPlus size={16} />
              </button>
            </div>

            {/* Preset Buttons */}
            <div className="inventory-preset-chips">
              <span className="preset-label">Phím nhanh:</span>
              {adjustType === 'add' && (
                <>
                  <button type="button" className="chip-btn" onClick={() => handlePresetClick(5)}>+5</button>
                  <button type="button" className="chip-btn" onClick={() => handlePresetClick(10)}>+10</button>
                  <button type="button" className="chip-btn" onClick={() => handlePresetClick(20)}>+20</button>
                  <button type="button" className="chip-btn" onClick={() => handlePresetClick(50)}>+50</button>
                  <button type="button" className="chip-btn" onClick={() => handlePresetClick(100)}>+100</button>
                </>
              )}
              {adjustType === 'subtract' && (
                <>
                  <button type="button" className="chip-btn danger" onClick={() => setQtyValue(1)}>1</button>
                  <button type="button" className="chip-btn danger" onClick={() => setQtyValue(2)}>2</button>
                  <button type="button" className="chip-btn danger" onClick={() => setQtyValue(5)}>5</button>
                  <button type="button" className="chip-btn danger" onClick={() => setQtyValue(10)}>10</button>
                  <button type="button" className="chip-btn danger" onClick={() => setQtyValue(currentStock)}>Hết tồn ({currentStock})</button>
                </>
              )}
              {adjustType === 'set' && (
                <>
                  <button type="button" className="chip-btn" onClick={() => setQtyValue(0)}>0 (Hết hàng)</button>
                  <button type="button" className="chip-btn" onClick={() => setQtyValue(5)}>5 (Mức cảnh báo)</button>
                  <button type="button" className="chip-btn" onClick={() => setQtyValue(20)}>20</button>
                  <button type="button" className="chip-btn" onClick={() => setQtyValue(50)}>50 (Chuẩn kho)</button>
                  <button type="button" className="chip-btn" onClick={() => setQtyValue(100)}>100</button>
                </>
              )}
            </div>
          </div>

          {/* Over-subtract Warning */}
          {isOverSubtract && (
            <div className="inventory-warning-alert">
              <IconAlertTriangle size={16} />
              <span>
                Cảnh báo: Bạn đang chọn xuất <strong>{numVal} chiếc</strong>, trong khi kho hiện chỉ còn <strong>{currentStock} chiếc</strong>! Vui lòng kiểm tra lại.
              </span>
            </div>
          )}
        </div>

        {/* 4. LIVE SIMULATION VISUAL BOX */}
        <div className="inventory-simulation-box">
          <div className="sim-header">
            <span className="sim-title">Mô phỏng thay đổi kho sau điều chỉnh</span>
            <span className="sim-time">
              <IconClock size={12} /> Cập nhật tức thời
            </span>
          </div>

          <div className="sim-flow-grid">
            {/* Before */}
            <div className="sim-node">
              <span className="sim-node-label">Tồn kho hiện tại</span>
              <span className="sim-node-val">{currentStock} chiếc</span>
              <span className="sim-node-sub">{formatPrice(currentTotalVal)}</span>
            </div>

            {/* Arrow & Delta */}
            <div className="sim-arrow-box">
              <span className={`sim-delta-badge ${deltaStock > 0 ? 'pos' : deltaStock < 0 ? 'neg' : 'zero'}`}>
                {deltaStock > 0 ? `+${deltaStock}` : deltaStock} chiếc
              </span>
              <span className="sim-arrow-symbol">➔</span>
              <span className={`sim-delta-val ${deltaTotalVal > 0 ? 'pos' : deltaTotalVal < 0 ? 'neg' : 'zero'}`}>
                {deltaTotalVal > 0 ? `+${formatPrice(deltaTotalVal)}` : formatPrice(deltaTotalVal)}
              </span>
            </div>

            {/* After */}
            <div className={`sim-node result ${finalStock === 0 ? 'out' : finalStock <= 5 ? 'low' : 'good'}`}>
              <span className="sim-node-label">Tồn kho mới dự kiến</span>
              <span className="sim-node-val">{finalStock} chiếc</span>
              <span className="sim-node-sub">{formatPrice(newTotalVal)}</span>
            </div>
          </div>
        </div>

        {/* 5. REASON & NOTES */}
        <div className="inventory-reason-section">
          <div className="form-group">
            <label className="inventory-field-label">
              <IconClock size={15} />
              <span>Lý do thực hiện điều chỉnh kho <strong className="text-danger">(*)</strong></span>
            </label>
            <select
              className="inventory-select-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {reasonList.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {reason === 'Khác' && (
            <div className="form-group fade-in">
              <label className="inventory-field-label">
                <span>Chi tiết lý do khác (ghi chú cụ thể)</span>
              </label>
              <input
                type="text"
                required
                className="inventory-input-field"
                placeholder="VD: Kiểm kê đột xuất trước đợt khuyến mãi Black Friday..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 6. MODAL FOOTER */}
        <div className="inventory-modal-footer">
          <div className="footer-notice">
            * Dữ liệu tồn kho sẽ được lưu lại lịch sử và đồng bộ trực tiếp lên hệ thống bán lẻ Tanpolo.
          </div>
          <div className="footer-actions">
            <button
              type="button"
              className="btn-inv-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-inv-submit"
              disabled={isSubmitting || qtyValue === '' || isOverSubtract}
            >
              <IconSave size={16} />
              <span>
                {isSubmitting
                  ? 'Đang cập nhật...'
                  : adjustType === 'add'
                  ? `Xác nhận Nhập +${numVal} sản phẩm`
                  : adjustType === 'subtract'
                  ? `Xác nhận Xuất -${numVal} sản phẩm`
                  : `Xác nhận Đặt tồn = ${numVal} chiếc`}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const InventoryAdjustModal: React.FC<InventoryAdjustModalProps> = (props) => {
  if (!props.isOpen || !props.product) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <InventoryAdjustModalContent
        key={`${props.product.id}_${props.initialType || 'add'}`}
        product={props.product}
        allProducts={props.allProducts || [props.product]}
        initialType={props.initialType}
        onClose={props.onClose}
        onAdjust={props.onAdjust}
      />
    </div>
  );
};
