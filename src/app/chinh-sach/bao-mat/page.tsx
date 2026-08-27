import { IconWarning } from '@/components/icons';

export default function BaoMatPage() {
  return (
    <div className="policy-page-container">
      <div className="policy-hero">
        <div className="container">
          <h1 className="policy-title">Bảo Mật</h1>
          <p className="policy-subtitle">Cam kết bảo vệ thông tin cá nhân của khách hàng</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Mục Đích Thu Thập Thông Tin</h2>
            <p>TANPOLO thu thập thông tin cá nhân của khách hàng nhằm các mục đích sau:</p>
            <ul className="policy-list">
              <li>Xử lý đơn hàng và giao hàng đến đúng địa chỉ</li>
              <li>Liên hệ xác nhận đơn hàng, giải đáp thắc mắc</li>
              <li>Gửi thông tin khuyến mãi, sản phẩm mới (nếu đồng ý)</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm mua sắm</li>
              <li>Xử lý các yêu cầu bảo hành, đổi trả</li>
              <li>Tuân thủ quy định pháp luật về thương mại điện tử</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. Phạm Vi Thu Thập Thông Tin</h2>
            <div className="policy-grid">
              <div className="policy-card">
                <span className="policy-card-label">Thông Tin Cá Nhân</span>
                <h3>Dữ Liệu Khách Hàng</h3>
                <ul>
                  <li>Họ và tên</li>
                  <li>Số điện thoại</li>
                  <li>Email</li>
                  <li>Địa chỉ giao hàng</li>
                </ul>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Thông Tin Giao Dịch</span>
                <h3>Lịch Sử Mua Hàng</h3>
                <ul>
                  <li>Lịch sử mua hàng</li>
                  <li>Phương thức thanh toán</li>
                  <li>Trạng thái đơn hàng</li>
                  <li>Phản hồi, đánh giá</li>
                </ul>
              </div>
              <div className="policy-card">
                <span className="policy-card-label">Thông Tin Kỹ Thuật</span>
                <h3>Dữ Liệu Truy Cập</h3>
                <ul>
                  <li>Địa chỉ IP</li>
                  <li>Loại trình duyệt</li>
                  <li>Thiết bị truy cập</li>
                  <li>Cookie website</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Thời Gian Lưu Trữ Thông Tin</h2>
            <ul className="policy-list">
              <li>Thông tin cá nhân: lưu trữ cho đến khi khách hàng yêu cầu xóa</li>
              <li>Lịch sử giao dịch: lưu trữ tối thiểu 3 năm (theo quy định pháp luật)</li>
              <li>Thông tin thanh toán: không lưu trữ thông tin thẻ tín dụng</li>
              <li>Cookie: tự động xóa sau 30 ngày hoặc khi xóa trình duyệt</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Cam Kết Bảo Mật</h2>
            <ul className="policy-list">
              <li>Thông tin khách hàng được mã hóa và bảo mật bằng SSL/TLS</li>
              <li>Chỉ nhân viên được ủy quyền mới được truy cập dữ liệu</li>
              <li>Không chia sẻ thông tin cho bên thứ ba vì mục đích thương mại</li>
              <li>Tuân thủ Luật An ninh mạng và các quy định bảo vệ dữ liệu</li>
              <li>Thông báo ngay cho khách hàng nếu xảy ra sự cố bảo mật</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Chia Sẻ Thông Tin Với Bên Thứ Ba</h2>
            <p>TANPOLO chỉ chia sẻ thông tin cá nhân trong các trường hợp sau:</p>
            <ul className="policy-list">
              <li>Đơn vị vận chuyển (GHN, GHTK, J&T...) để giao hàng</li>
              <li>Cổng thanh toán (Momo, VNPay...) để xử lý giao dịch</li>
              <li>Cơ quan chức năng khi có yêu cầu theo quy định pháp luật</li>
              <li>Đối tác kinh doanh với sự đồng ý rõ ràng của khách hàng</li>
            </ul>
            <p className="policy-note">
              <IconWarning size={14} style={{ verticalAlign: 'middle' }} /> Các bên thứ ba này được yêu cầu tuân thủ nghiêm ngặt chính sách bảo mật tương tự
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Quyền Của Khách Hàng</h2>
            <div className="rights-grid">
              <div className="right-item">
                <h3>Quyền Truy Cập</h3>
                <p>Yêu cầu xem thông tin cá nhân TANPOLO đang lưu trữ</p>
              </div>
              <div className="right-item">
                <h3>Quyền Chỉnh Sửa</h3>
                <p>Cập nhật, sửa đổi thông tin cá nhân bất kỳ lúc nào</p>
              </div>
              <div className="right-item">
                <h3>Quyền Xóa</h3>
                <p>Yêu cầu xóa hoàn toàn thông tin khỏi hệ thống</p>
              </div>
              <div className="right-item">
                <h3>Quyền Từ Chối</h3>
                <p>Từ chối nhận email marketing, tin khuyến mãi</p>
              </div>
            </div>
            <p className="policy-note">
              Để thực hiện các quyền trên, vui lòng liên hệ: <strong>098 844 48 06</strong> hoặc <strong>tanpolo.shoes@gmail.com</strong>
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Sử Dụng Cookie</h2>
            <ul className="policy-list">
              <li>Cookie giúp ghi nhớ đăng nhập, giỏ hàng, ngôn ngữ</li>
              <li>Phân tích hành vi người dùng để cải thiện website</li>
              <li>Cá nhân hóa trải nghiệm mua sắm</li>
              <li>Khách hàng có thể tắt cookie trong trình duyệt</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Bảo Mật Thanh Toán</h2>
            <ul className="policy-list">
              <li>Tất cả giao dịch được mã hóa SSL 256-bit</li>
              <li>Không lưu trữ thông tin thẻ tín dụng/thẻ ATM</li>
              <li>Tuân thủ chuẩn bảo mật PCI-DSS cho thanh toán thẻ</li>
              <li>Xác thực 3D-Secure (OTP) cho mọi giao dịch thẻ</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>9. Liên Hệ Về Bảo Mật</h2>
            <p>Nếu có bất kỳ thắc mắc hoặc khiếu nại về bảo mật thông tin, vui lòng liên hệ:</p>
            <div className="contact-security-box">
              <p><strong>Bộ phận Bảo Mật - TANPOLO</strong></p>
              <p>Email: <a href="mailto:tanpolo.shoes@gmail.com">tanpolo.shoes@gmail.com</a></p>
              <p>Hotline: <a href="tel:0988444806">098 844 48 06</a></p>
              <p>Địa chỉ: 985/71/5 Hương Lộ 2, Phường Bình Trị Đông, TP.HCM</p>
            </div>
            <p className="policy-note">
              Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng <strong>24 giờ làm việc</strong>
            </p>
          </section>

          <section className="policy-section policy-cta">
            <h2>Cần Hỗ Trợ?</h2>
            <p>Liên hệ TANPOLO để được giải đáp thắc mắc về bảo mật</p>
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
