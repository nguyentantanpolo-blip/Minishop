export default function DoiTraHangPage() {
  return (
    <div className="policy-page-container">
      <div className="policy-hero">
        <div className="container">
          <h1 className="policy-title">Chính Sách Đổi Trả Hàng</h1>
          <p className="policy-subtitle">Mua sắm an tâm với chính sách đổi trả linh hoạt từ TANPOLO</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Điều Kiện Đổi Trả</h2>
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-card-icon">📅</div>
                <h3>Thời Gian</h3>
                <p className="policy-highlight">7 ngày</p>
                <p>Kể từ ngày nhận hàng (tính theo dấu bưu điện hoặc ngày giao hàng)</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon">✨</div>
                <h3>Tình Trạng</h3>
                <p className="policy-highlight">Như mới</p>
                <p>Còn nguyên tem, nhãn mác, chưa qua sử dụng, không dơ bẩn</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon">📦</div>
                <h3>Hóa Đơn</h3>
                <p className="policy-highlight">Bắt buộc</p>
                <p>Xuất trình hóa đơn hoặc phiếu bảo hành kèm sản phẩm</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Trường Hợp Được Đổi Trả</h2>
            <ul className="policy-list">
              <li>Sản phẩm bị lỗi do nhà sản xuất (đứt chỉ, bong tróc, sai size)</li>
              <li>Giao nhầm mẫu mã, màu sắc so với đơn hàng</li>
              <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
              <li>Không vừa size (đổi size trong vòng 7 ngày, 1 lần duy nhất)</li>
              <li>Không ưng ý về mẫu mã (hoàn tiền 100% nếu chưa sử dụng)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Trường Hợp Không Đổi Trả</h2>
            <ul className="policy-list policy-list-exclude">
              <li>Sản phẩm đã qua sử dụng, có dấu hiệu mòn đế</li>
              <li>Sản phẩm bị dơ bẩn, mùi hôi, rách</li>
              <li>Mất tem, nhãn mác, hộp giày gốc</li>
              <li>Quá 7 ngày kể từ ngày nhận hàng</li>
              <li>Sản phẩm sale off, giảm giá trên 50%</li>
              <li>Đã đổi size 1 lần trước đó</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Quy Trình Đổi Trả</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Liên Hệ</h3>
                <p>Gọi hotline <strong>098 844 48 06</strong> hoặc nhắn tin Zalo để thông báo đổi trả</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>Gửi Hàng</h3>
                <p>Đóng gói sản phẩm cẩn thận và gửi về địa chỉ TANPOLO (hoặc mang đến shop)</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Kiểm Tra</h3>
                <p>TANPOLO kiểm tra sản phẩm trong vòng 24h và xác nhận</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>Hoàn Tất</h3>
                <p>Đổi sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Phí Đổi Trả</h2>
            <div className="policy-fee-table">
              <div className="fee-row">
                <span className="fee-case">Lỗi từ TANPOLO (sai hàng, lỗi sản xuất)</span>
                <span className="fee-value free">MIỄN PHÍ</span>
              </div>
              <div className="fee-row">
                <span className="fee-case">Đổi size (trong 7 ngày, chưa sử dụng)</span>
                <span className="fee-value free">MIỄN PHÍ lần đầu</span>
              </div>
              <div className="fee-row">
                <span className="fee-case">Không ưng ý (chưa sử dụng)</span>
                <span className="fee-value">Khách chịu phí ship 2 chiều</span>
              </div>
            </div>
          </section>

          <section className="policy-section policy-cta">
            <h2>Cần Hỗ Trợ Đổi Trả?</h2>
            <p>Liên hệ ngay với TANPOLO để được hỗ trợ nhanh chóng</p>
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
