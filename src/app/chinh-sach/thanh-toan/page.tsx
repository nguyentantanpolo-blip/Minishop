export default function ThanhToanPage() {
  return (
    <div className="policy-page-container">
      <div className="policy-hero">
        <div className="container">
          <h1 className="policy-title">Chính Sách Thanh Toán</h1>
          <p className="policy-subtitle">Đa dạng phương thức thanh toán tiện lợi và an toàn</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Các Phương Thức Thanh Toán</h2>
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-card-icon">💵</div>
                <h3>Tiền Mặt (COD)</h3>
                <p className="policy-highlight">Phổ biến nhất</p>
                <p>Thanh toán khi nhận hàng tại nhà hoặc tại cửa hàng</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon">🏦</div>
                <h3>Chuyển Khoản</h3>
                <p className="policy-highlight">Ưu đãi -20k</p>
                <p>Chuyển khoản qua ngân hàng hoặc ví điện tử</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon">💳</div>
                <h3>Quẹt Thẻ</h3>
                <p className="policy-highlight">Tại cửa hàng</p>
                <p>Visa, Mastercard, thẻ ATM nội địa</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Thanh Toán Tiền Mặt (COD)</h2>
            <ul className="policy-list">
              <li>Thanh toán trực tiếp cho nhân viên giao hàng khi nhận sản phẩm</li>
              <li>Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
              <li>Áp dụng cho đơn hàng dưới <strong>5.000.000đ</strong></li>
              <li>Phí COD: <strong>Miễn phí</strong> trong nội thành, <strong>20.000đ</strong> ngoại thành</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Thanh Toán Chuyển Khoản</h2>
            <div className="bank-info-card">
              <h3>Thông Tin Tài Khoản</h3>
              <div className="bank-detail">
                <span className="bank-label">Ngân hàng:</span>
                <span className="bank-value">Vietcombank - Chi nhánh TP.HCM</span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Chủ tài khoản:</span>
                <span className="bank-value">CÔNG TY TNHH GIÀY NHẬT HUY</span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Số tài khoản:</span>
                <span className="bank-value bank-number">0123 4567 8900</span>
              </div>
              <div className="bank-detail">
                <span className="bank-label">Nội dung CK:</span>
                <span className="bank-value bank-transfer-note">TANPOLO [SĐT] [Họ tên]</span>
              </div>
            </div>
            <p className="payment-note">
              ⚡ <strong>Ưu đãi:</strong> Giảm ngay <strong>20.000đ</strong> cho đơn hàng thanh toán trước
            </p>
            <ul className="policy-list">
              <li>Chuyển khoản trước khi nhận hàng</li>
              <li>Ghi rõ nội dung chuyển khoản theo mẫu</li>
              <li>Gửi ảnh chụp biến lai cho TANPOLO qua Zalo/Facebook</li>
              <li>Đơn hàng được xử lý sau khi nhận được tiền (30 phút - 2h)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Thanh Toán Qua Ví Điện Tử</h2>
            <div className="ewallet-grid">
              <div className="ewallet-item">
                <div className="ewallet-icon momo-bg">Momo</div>
                <p>098 844 48 06</p>
              </div>
              <div className="ewallet-item">
                <div className="ewallet-icon zalopay-bg">ZaloPay</div>
                <p>098 844 48 06</p>
              </div>
              <div className="ewallet-item">
                <div className="ewallet-icon vnpay-bg">VNPay</div>
                <p>Quét mã QR</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Chính Sách Hoàn Tiền</h2>
            <ul className="policy-list">
              <li>Hoàn tiền 100% nếu hủy đơn trước khi giao hàng</li>
              <li>Hoàn tiền trong vòng <strong>3-7 ngày làm việc</strong> sau khi duyệt</li>
              <li>Hoàn về tài khoản ngân hàng hoặc ví điện tử đã thanh toán</li>
              <li>Không hoàn tiền với đơn hàng đã nhận và sử dụng</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Bảo Mật Thông Tin Thanh Toán</h2>
            <ul className="policy-list">
              <li>Thông tin thẻ và tài khoản được mã hóa bảo mật</li>
              <li>TANPOLO không lưu trữ thông tin thẻ tín dụng của khách hàng</li>
              <li>Tuân thủ chuẩn bảo mật PCI-DSS</li>
              <li>Mọi giao dịch đều được ghi nhận và có hóa đơn VAT theo yêu cầu</li>
            </ul>
          </section>

          <section className="policy-section policy-cta">
            <h2>Cần Hỗ Trợ Thanh Toán?</h2>
            <p>Liên hệ TANPOLO để được tư vấn chi tiết</p>
            <div className="policy-contact-actions">
              <a href="tel:0988444806" className="policy-btn policy-btn-primary">
                📞 Gọi Hotline
              </a>
              <a href="https://zalo.me/0988444806" target="_blank" rel="noopener noreferrer" className="policy-btn policy-btn-secondary">
                💬 Chat Zalo
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
