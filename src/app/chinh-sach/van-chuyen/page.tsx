export default function VanChuyenPage() {
  return (
    <div className="policy-page-container">
      <div className="policy-hero">
        <div className="container">
          <h1 className="policy-title">Vận Chuyển</h1>
          <p className="policy-subtitle">Giao hàng nhanh chóng, an toàn trên toàn quốc</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Khu Vực Giao Hàng</h2>
            <div className="policy-grid">
              <div className="policy-card">
                <span className="policy-card-label">Nội Thành TP.HCM</span>
                <h3>Giao Trong Ngày</h3>
                <p className="policy-highlight">1-2 NGÀY</p>
                <p>Giao hàng nhanh trong ngày hoặc ngày hôm sau</p>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Tỉnh Lân Cận</span>
                <h3>Giao Nhanh</h3>
                <p className="policy-highlight">2-3 NGÀY</p>
                <p>Bình Dương, Đồng Nai, Long An, Vũng Tàu</p>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Toàn Quốc</span>
                <h3>Giao Tiêu Chuẩn</h3>
                <p className="policy-highlight">3-7 NGÀY</p>
                <p>Miền Bắc, Miền Trung và các tỉnh miền Tây</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Phí Vận Chuyển</h2>
            <div className="shipping-fee-table">
              <div className="fee-row">
                <span className="fee-case">Đơn hàng từ 500.000đ trở lên</span>
                <span className="fee-value free">MIỄN PHÍ SHIP</span>
              </div>
              <div className="fee-row">
                <span className="fee-case">Nội thành TP.HCM (dưới 500k)</span>
                <span className="fee-value">25.000đ</span>
              </div>
              <div className="fee-row">
                <span className="fee-case">Ngoại thành & tỉnh lân cận</span>
                <span className="fee-value">35.000đ</span>
              </div>
              <div className="fee-row">
                <span className="fee-case">Các tỉnh thành khác</span>
                <span className="fee-value">40.000đ - 60.000đ</span>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Đơn Vị Vận Chuyển</h2>
            <div className="shipping-partners">
              <div className="partner-item">
                <div className="partner-logo">GHN</div>
                <p>Giao Hàng Nhanh</p>
              </div>
              <div className="partner-item">
                <div className="partner-logo">GHTK</div>
                <p>Giao Hàng Tiết Kiệm</p>
              </div>
              <div className="partner-item">
                <div className="partner-logo">J&T</div>
                <p>J&T Express</p>
              </div>
              <div className="partner-item">
                <div className="partner-logo">VTP</div>
                <p>Viettel Post</p>
              </div>
            </div>
            <p className="shipping-note">
              TANPOLO chọn đơn vị vận chuyển phù hợp nhất cho từng khu vực để đảm bảo thời gian giao hàng nhanh nhất
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Quy Trình Giao Nhận</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Xác Nhận</h3>
                <p>TANPOLO xác nhận đơn hàng qua điện thoại trong vòng 2h</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>Đóng Gói</h3>
                <p>Sản phẩm được đóng gói cẩn thận, kèm phiếu bảo hành</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Vận Chuyển</h3>
                <p>Bàn giao cho đơn vị vận chuyển, cập nhật mã vận đơn</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>Giao Hàng</h3>
                <p>Shipper liên hệ và giao hàng đến địa chỉ của bạn</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Kiểm Tra Hàng Trước Khi Nhận</h2>
            <ul className="policy-list">
              <li>Khách hàng được quyền kiểm tra hàng trước khi thanh toán</li>
              <li>Kiểm tra sản phẩm: màu sắc, kích cỡ, số lượng</li>
              <li>Kiểm tra tình trạng: còn nguyên vẹn, không bị hư hỏng</li>
              <li>Từ chối nhận hàng nếu không đúng đơn đặt hoặc bị hư hỏng</li>
              <li>Ký xác nhận biên bản nếu phát hiện lỗi từ vận chuyển</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Theo Dõi Đơn Hàng</h2>
            <ul className="policy-list">
              <li>Nhận mã vận đơn qua SMS/Zalo sau khi gửi hàng</li>
              <li>Tra cứu trạng thái đơn hàng trên website đơn vị vận chuyển</li>
              <li>Liên hệ hotline TANPOLO để được hỗ trợ tra cứu</li>
              <li>Nhận thông báo khi hàng đến khu vực giao nhận</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Trường Hợp Đặc Biệt</h2>
            <ul className="policy-list policy-list-exclude">
              <li>Giao hàng chậm do thiên tai, dịch bệnh, ngày lễ</li>
              <li>Không liên hệ được với khách hàng sau 3 lần gọi</li>
              <li>Địa chỉ giao hàng không chính xác hoặc không tìm thấy</li>
              <li>Khách hàng không có mặt để nhận hàng (hẹn lại lần 2)</li>
            </ul>
            <p className="shipping-note">
              ⚠️ Đơn hàng sẽ được hoàn về kho nếu giao không thành công sau 2 lần. Khách hàng vui lòng liên hệ để sắp xếp lại.
            </p>
          </section>

          <section className="policy-section policy-cta">
            <h2>Cần Hỗ Trợ Vận Chuyển?</h2>
            <p>Liên hệ TANPOLO để được tư vấn và hỗ trợ giao hàng</p>
            <div className="policy-contact-actions">
              <a href="tel:0988444806" className="policy-btn policy-btn-primary">
                Gọi Hotline
              </a>
              <a href="https://zalo.me/0988444806" target="_blank" rel="noopener noreferrer" className="policy-btn policy-btn-secondary">
                Chat Zalo
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
