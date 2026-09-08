'use client';

import React, { useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Order } from '@/types';
import { IconPrinter, IconX } from './icons';
import { numberToVietnameseWords } from '@/lib/numberToWords';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  autoPrint?: boolean;
}

const emptySubscribe = () => () => {};

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  autoPrint = false,
}) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const printedTime = useMemo(() => {
    if (!order) return '';
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;
  }, [order]);

  useEffect(() => {
    if (isOpen && order && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, order, autoPrint]);

  if (!isOpen || !order || !isClient) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const isBankTransfer = order.paymentMethod.toLowerCase().includes('chuyển khoản');

  // Format currency helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const invoiceContent = (
    <div className="invoice-sheet">
      {/* 1. INVOICE TOP HEADER */}
      <div className="invoice-header">
        <div className="invoice-brand">
          <div className="invoice-brand-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>TANPOLO</span>
          </div>
          <div className="invoice-brand-title">TANPOLO LEATHER GOODS</div>
          <div className="invoice-brand-slogan">XƯỞNG ĐỒ DA THỦ CÔNG CAO CẤP VIỆT NAM</div>
          <div className="invoice-brand-info">
            <div><strong>Showroom &amp; Xưởng:</strong> 45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
            <div><strong>Hotline CSKH / Zalo:</strong> 0987.654.321 • <strong>Email:</strong> contact@tanpolo.vn</div>
            <div><strong>Website:</strong> https://tanpolo.vn • <strong>Mã số doanh nghiệp:</strong> 0318924568</div>
          </div>
        </div>

        <div className="invoice-meta">
          <h1 className="invoice-title">HÓA ĐƠN BÁN HÀNG</h1>
          <div className="invoice-subtitle">&amp; PHIẾU GIAO HÀNG (DELIVERY RECEIPT)</div>
          <div className="invoice-order-id-box">
            <span className="label">MÃ ĐƠN HÀNG:</span>
            <span className="code">#{order.id}</span>
          </div>
          <div className="invoice-meta-row">
            <span>Ngày đặt hàng:</span>
            <strong>{order.date}</strong>
          </div>
          <div className="invoice-meta-row">
            <span>Ngày xuất phiếu:</span>
            <strong>{printedTime || order.date}</strong>
          </div>
        </div>
      </div>

      <div className="invoice-divider" />

      {/* 2. CUSTOMER & DELIVERY INFO SECTION */}
      <div className="invoice-info-grid">
        {/* Left: Customer Info */}
        <div className="invoice-info-card">
          <div className="invoice-info-card-header">
            <span>THÔNG TIN NGƯỜI NHẬN HÀNG</span>
          </div>
          <div className="invoice-info-card-body">
            <div className="invoice-info-row">
              <span className="label">Khách hàng:</span>
              <span className="value strong-name">{order.customer}</span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Số điện thoại:</span>
              <span className="value strong-phone">{order.phone}</span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Địa chỉ giao:</span>
              <span className="value">{order.address}</span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Lời dặn/Ghi chú:</span>
              <span className="value italic">
                {order.notes && order.notes.trim() ? order.notes : 'Không có ghi chú thêm'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Payment & Delivery Status */}
        <div className="invoice-info-card">
          <div className="invoice-info-card-header">
            <span>PHƯƠNG THỨC &amp; ĐIỀU KIỆN GIAO HÀNG</span>
          </div>
          <div className="invoice-info-card-body">
            <div className="invoice-info-row">
              <span className="label">Thanh toán:</span>
              <span className="value">
                <strong>{order.paymentMethod}</strong>
              </span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Trạng thái TT:</span>
              <span className="value">
                <span className={`invoice-pay-tag ${isBankTransfer ? 'tag-paid' : 'tag-cod'}`}>
                  {isBankTransfer ? '✓ ĐÃ THANH TOÁN (Chuyển khoản)' : '⚡ THU TIỀN KHI GIAO HÀNG (COD)'}
                </span>
              </span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Trạng thái đơn:</span>
              <span className="value">
                <strong>{order.statusText}</strong>
              </span>
            </div>
            <div className="invoice-info-row">
              <span className="label">Quy định xem:</span>
              <span className="value highlight-check">
                ✓ Cho phép khách hàng đồng kiểm trước khi nhận
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT ITEMS TABLE */}
      <div className="invoice-table-wrap">
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>STT</th>
              <th style={{ width: '60px', textAlign: 'center' }}>Ảnh</th>
              <th>Tên sản phẩm &amp; Phân loại đồ da</th>
              <th style={{ width: '110px', textAlign: 'right' }}>Đơn giá</th>
              <th style={{ width: '60px', textAlign: 'center' }}>SL</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img
                      src={item.image || '/assets/images/products/bo5-1.jpg'}
                      alt={item.name}
                      className="invoice-item-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                      }}
                    />
                  </td>
                  <td>
                    <div className="invoice-item-name">{item.name}</div>
                    <div className="invoice-item-sub">
                      {item.categoryName ? `Danh mục: ${item.categoryName}` : `Mã SP: ${item.id}`} • Da bò thuộc cao cấp
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {formatMoney(item.priceValue)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {item.quantity}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {formatMoney(item.priceValue * item.quantity)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  Không có sản phẩm trong đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. FINANCIAL SUMMARY & AMOUNT IN WORDS */}
      <div className="invoice-summary-grid">
        <div className="invoice-words-box">
          <div className="words-title">Số tiền viết bằng chữ:</div>
          <div className="words-content">
            &ldquo;{numberToVietnameseWords(order.total)}&rdquo;
          </div>
          <div className="invoice-policy-note">
            <strong>* Chính sách bảo hành &amp; đổi trả Tanpolo:</strong>
            <ul>
              <li>Cam kết 100% da thật cao cấp nguyên tấm, độ bền vượt trội.</li>
              <li>Bảo hành kỹ thuật chỉ may, khóa kéo, keo viền 12 tháng chính hãng.</li>
              <li>Hỗ trợ đổi mới trong 7 ngày nếu có lỗi kỹ thuật từ nhà sản xuất.</li>
              <li>Quý khách vui lòng giữ lại hóa đơn để được hưởng dịch vụ bảo dưỡng đồ da trọn đời.</li>
            </ul>
          </div>
        </div>

        <div className="invoice-totals-box">
          <div className="total-line">
            <span>Tiền hàng (Tạm tính):</span>
            <strong>{formatMoney(order.subtotal)}</strong>
          </div>
          <div className="total-line">
            <span>Phí vận chuyển toàn quốc:</span>
            <span>
              {order.shippingFee === 0 ? (
                <span style={{ color: '#059669', fontWeight: 700 }}>Miễn phí giao hàng</span>
              ) : (
                formatMoney(order.shippingFee)
              )}
            </span>
          </div>
          {order.subtotal + order.shippingFee > order.total && (
            <div className="total-line">
              <span>Giảm giá / Voucher:</span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>
                -{formatMoney(order.subtotal + order.shippingFee - order.total)}
              </span>
            </div>
          )}
          <div className="total-divider" />
          <div className="total-line grand-total">
            <span>TỔNG CỘNG THANH TOÁN:</span>
            <span className="amount">{order.totalFormatted}</span>
          </div>
          <div className="payment-reminder">
            {isBankTransfer
              ? 'Số tiền đã được thanh toán đầy đủ qua ngân hàng.'
              : `Nhân viên giao nhận thu đúng số tiền: ${order.totalFormatted}`}
          </div>
        </div>
      </div>

      {/* 5. SIGNATURES SECTION */}
      <div className="invoice-signatures">
        <div className="sig-col">
          <div className="sig-title">NGƯỜI LẬP PHIẾU</div>
          <div className="sig-subtitle">(Ký, ghi rõ họ tên)</div>
          <div className="sig-space" />
          <div className="sig-name">Ban Quản Trị Tanpolo</div>
        </div>

        <div className="sig-col">
          <div className="sig-title">NHÂN VIÊN GIAO HÀNG</div>
          <div className="sig-subtitle">(Ký, ghi rõ họ tên)</div>
          <div className="sig-space" />
          <div className="sig-name">Đơn vị vận chuyển</div>
        </div>

        <div className="sig-col">
          <div className="sig-title">KHÁCH HÀNG NHẬN</div>
          <div className="sig-subtitle">(Ký xác nhận hàng nguyên vẹn)</div>
          <div className="sig-space" />
          <div className="sig-name">{order.customer}</div>
        </div>
      </div>

      {/* 6. INVOICE FOOTER */}
      <div className="invoice-footer">
        <div className="footer-thanks">
          ✨ Cảm ơn Quý khách đã tin tưởng và lựa chọn sản phẩm đồ da thủ công Tanpolo!
        </div>
        <div className="footer-contact">
          Mọi thắc mắc và đóng góp ý kiến, xin vui lòng liên hệ Tổng đài CSKH: <strong>0987.654.321</strong> hoặc website <strong>tanpolo.vn</strong>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {/* 1. ON-SCREEN MODAL PREVIEW (Hidden in Print) */}
      <div className="invoice-modal-overlay no-print" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <div className="invoice-modal-container">
          {/* Action Toolbar */}
          <div className="invoice-modal-toolbar">
            <div className="invoice-modal-title">
              <IconPrinter size={18} />
              <span>Xem Trước Hóa Đơn &amp; Phiếu Giao Hàng — Đơn #{order.id}</span>
            </div>
            <div className="invoice-modal-actions">
              <button
                type="button"
                className="btn-invoice-print"
                onClick={handlePrint}
                title="Mở hộp thoại in hoặc Lưu dưới dạng PDF"
              >
                <IconPrinter size={16} />
                <span>In Hóa Đơn / Lưu PDF</span>
              </button>
              <button
                type="button"
                className="btn-invoice-close"
                onClick={onClose}
                title="Đóng xem trước"
              >
                <IconX size={18} />
              </button>
            </div>
          </div>

          {/* Paper View Container */}
          <div className="invoice-modal-body">
            <div className="invoice-paper-wrapper">
              {invoiceContent}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PRINT CONTAINER FOR BROWSER PRINT / PDF EXPORT */}
      <div id="invoice-print-portal" className="invoice-print-portal">
        {invoiceContent}
      </div>
    </>,
    document.body
  );
};
