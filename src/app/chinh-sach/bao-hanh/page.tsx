export default function BaoHanhPage() {
  return (
    <div className="policy-page-container">
      <div className="policy-hero">
        <div className="container">
          <h1 className="policy-title">Bảo Hành</h1>
          <p className="policy-subtitle">Cam kết chất lượng và trách nhiệm với sản phẩm TANPOLO</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Thời Gian Bảo Hành</h2>
            <div className="policy-grid">
              <div className="policy-card">
                <span className="policy-card-label">Giày Da Cao Cấp</span>
                <h3>Bảo Hành Toàn Diện</h3>
                <p className="policy-highlight">12 THÁNG</p>
                <p>Bảo hành về chất liệu da, đường may, đế giày</p>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Giày Thể Thao</span>
                <h3>Bảo Hành Tiêu Chuẩn</h3>
                <p className="policy-highlight">6 THÁNG</p>
                <p>Bảo hành keo dán, đế giày, chất liệu vải canvas</p>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Dép & Sandal</span>
                <h3>Bảo Hành Cơ Bản</h3>
                <p className="policy-highlight">3 THÁNG</p>
                <p>Bảo hành quai dép, đế chống trượt</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Điều Kiện Bảo Hành</h2>
            <ul className="policy-list">
              <li>Sản phẩm còn trong thời gian bảo hành ghi trên phiếu bảo hành</li>
              <li>Lỗi do nhà sản xuất: đứt chỉ may, bong tróc da, bong đế</li>
              <li>Sản phẩm chưa qua sửa chữa bởi bên thứ ba</li>
              <li>Xuất trình phiếu bảo hành hoặc hóa đơn mua hàng</li>
              <li>Sản phẩm không bị biến dạng do tác động bên ngoài</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Trường Hợp Không Bảo Hành</h2>
            <ul className="policy-list policy-list-exclude">
              <li>Hư hỏng do sử dụng không đúng mục đích</li>
              <li>Mòn tự nhiên do thời gian sử dụng lâu</li>
              <li>Rách, trầy xước do va đập mạnh</li>
              <li>Lem màu, úa màu do giặt với hóa chất mạnh</li>
              <li>Sản phẩm đã qua sửa chữa tại nơi khác</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Quy Trình Bảo Hành</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Liên Hệ</h3>
                <p>Gọi hotline <strong>098 844 48 06</strong> hoặc mang sản phẩm đến cửa hàng</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>Kiểm Tra</h3>
                <p>Nhân viên kiểm tra tình trạng và xác nhận điều kiện bảo hành</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Sửa Chữa</h3>
                <p>Thời gian sửa chữa từ 3-7 ngày làm việc tùy mức độ</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>Nhận Hàng</h3>
                <p>Nhận thông báo và đến lấy sản phẩm đã được bảo hành</p>
              </div>
            </div>
          </section>

          <section className="policy-section policy-cta">
            <h2>Cần Hỗ Trợ Bảo Hành?</h2>
            <p>Đội ngũ TANPOLO luôn sẵn sàng hỗ trợ bạn</p>
            <div className="policy-contact-actions">
              <a href="tel:0988444806" className="policy-btn policy-btn-primary">
                Gọi Hotline
              </a>
              <a href="mailto:tanpolo.shoes@gmail.com" className="policy-btn policy-btn-secondary">
                Gửi Email
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
