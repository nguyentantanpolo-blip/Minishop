import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  IconShield,
  IconSparkles,
  IconCheckCircle,
  IconArrowRight,
  IconPhone,
  IconClock,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Giới Thiệu Về Tanpolo - Hơn 30 Năm Chế Tác Đồ Da Thật Thủ Công',
  description: 'Khám phá câu chuyện thương hiệu TANPOLO Since 1992s. Tinh hoa chế tác giày da, ví da, thắt lưng và phụ kiện da bò thật 100% thủ công cao cấp.',
};

export default function GioiThieuPage() {
  return (
    <div className="about-page-wrapper">
      {/* Hero Banner Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-hero-badge">
              <IconSparkles size={16} />
              <span>SINCE 1992s • DI SẢN ĐỒ DA THỦ CÔNG VIỆT</span>
            </div>
            <h1 className="about-hero-title">
              Tinh Hoa Nghệ Thuật <br />
              <span className="text-gradient-gold">Chế Tác Đồ Da Thật Tanpolo</span>
            </h1>
            <p className="about-hero-subtitle">
              Hành trình hơn 30 năm bền bỉ gìn giữ và tôn vinh nét đẹp thủ công truyền thống. 
              Mỗi sản phẩm Tanpolo là sự hòa quyện hoàn hảo giữa chất liệu da bò tự nhiên thượng hạng 
              và kỹ nghệ khâu tay tỉ mỉ của những nghệ nhân lành nghề.
            </p>
            <div className="about-hero-actions">
              <Link href="/products" className="btn-about-primary">
                <span>Khám phá bộ sưu tập</span>
                <IconArrowRight size={18} />
              </Link>
              <Link href="/lien-he" className="btn-about-secondary">
                <span>Liên hệ tư vấn xưởng</span>
                <IconPhone size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="about-stats-bar">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat-item">
              <div className="stat-number">30+</div>
              <div className="stat-label">Năm kinh nghiệm chế tác đồ da</div>
            </div>
            <div className="about-stat-item">
              <div className="stat-number">50.000+</div>
              <div className="stat-label">Khách hàng tin tưởng toàn quốc</div>
            </div>
            <div className="about-stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Da bò thật nguyên tấm tự nhiên</div>
            </div>
            <div className="about-stat-item">
              <div className="stat-number">12-24T</div>
              <div className="stat-label">Bảo hành chính hãng & bảo dưỡng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <div className="section-tag">CÂU CHUYỆN THƯƠNG HIỆU</div>
              <h2 className="about-section-heading">
                Hành Trình Khởi Nguồn Từ Đam Mê Thuộc Da Truyền Thống
              </h2>
              <p className="story-paragraph">
                Khởi đầu từ năm 1992 tại Sài Gòn, <strong>TANPOLO</strong> (tiền thân trực thuộc 
                <strong> Công ty TNHH Giày Nhật Huy</strong>) ban đầu là một xưởng nhỏ chuyên đóng giày da thủ công 
                và may đo túi da phục vụ những khách hàng sành điệu, yêu cầu cao về phom dáng và chất lượng da thật.
              </p>
              <p className="story-paragraph">
                Trải qua hơn ba thập kỷ kiên định với phương châm <em>&quot;Chất lượng thật tạo nên giá trị bền vững&quot;</em>, 
                chúng tôi không ngừng nâng cao tay nghề, cập nhật kỹ thuật xử lý da tiên tiến nhưng vẫn gìn giữ 
                trọn vẹn cái hồn của phương pháp khâu tay thủ công truyền thống.
              </p>
              <p className="story-paragraph">
                Từng chiếc ví, đôi giày hay sợi thắt lưng mang thương hiệu Tanpolo khi đến tay quý khách 
                không đơn thuần là một món phụ kiện, mà là một tác phẩm chứa đựng tâm huyết, thời gian và sự tỉ mỉ 
                tuyệt đối của người thợ da lành nghề.
              </p>

              <div className="story-highlights">
                <div className="story-highlight-box">
                  <div className="highlight-icon">
                    <IconCheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Phom dáng chuẩn người Việt:</strong> Nghiên cứu tỉ mỉ kích thước và thói quen sử dụng của người tiêu dùng trong nước.
                  </div>
                </div>
                <div className="story-highlight-box">
                  <div className="highlight-icon">
                    <IconCheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Chất liệu da bò tự nhiên tuyển chọn:</strong> Nhập khẩu chính ngạch từ các xưởng thuộc da danh tiếng, mềm mại và lưu giữ vân da tự nhiên độc bản.
                  </div>
                </div>
              </div>
            </div>

            <div className="about-story-media">
              <div className="story-image-card main-image">
                <img
                  src="/assets/images/products/bo5-1.jpg"
                  alt="Nghệ nhân chế tác đồ da Tanpolo Since 1992s"
                  className="story-img"
                  loading="lazy"
                />
                <div className="story-floating-badge">
                  <div className="badge-crest">1992</div>
                  <div className="badge-text">
                    <strong>DI SẢN 30+ NĂM</strong>
                    <span>Kỹ nghệ đồ da thủ công</span>
                  </div>
                </div>
              </div>
              <div className="story-sub-image-card">
                <img
                  src="/assets/images/products/bo14-1.jpg"
                  alt="Chi tiết ví da khâu tay thủ công Tanpolo"
                  className="sub-story-img"
                  loading="lazy"
                />
                <div className="sub-image-caption">
                  <span>Khâu tay chỉ sáp chống mục</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="about-pillars-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-tag">GIÁ TRỊ CỐT LÕI</div>
            <h2 className="about-section-heading">4 Trụ Cột Tạo Nên Đẳng Cấp Tanpolo</h2>
            <p className="section-subtext">
              Chúng tôi theo đuổi sự hoàn hảo từ chất liệu nguyên bản đến trải nghiệm hậu mãi dài lâu.
            </p>
          </div>

          <div className="about-pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <IconShield size={28} />
              </div>
              <h3 className="pillar-title">100% Da Thật Tuyển Chọn</h3>
              <p className="pillar-desc">
                Chỉ sử dụng da bò lớp 1 (Top-Grain / Full-Grain) và da sáp ngựa điên tự nhiên. 
                Nói KHÔNG hoàn toàn với da tổng hợp, simili hay da ép bột vụn.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <IconSparkles size={28} />
              </div>
              <h3 className="pillar-title">Khâu Tay Thủ Công Tinh Xảo</h3>
              <p className="pillar-desc">
                Từng lỗ đục xiên chéo phong cách Hermes, từng đường chỉ sáp chuyên dụng đều đặn, 
                đảm bảo độ bền cơ học cao nhất ngay cả khi chịu lực co kéo mạnh.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <IconShield size={28} />
              </div>
              <h3 className="pillar-title">Hiệu Ứng Patina Độc Bản</h3>
              <p className="pillar-desc">
                Đồ da Tanpolo càng sử dụng lâu càng trở nên mềm mại, lên nước bóng bẩy và sậm màu tự nhiên, 
                mang dấu ấn phong cách riêng biệt của chủ nhân.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <IconClock size={28} />
              </div>
              <h3 className="pillar-title">Bảo Dưỡng & Bảo Hành Tận Tâm</h3>
              <p className="pillar-desc">
                Chính sách bảo hành rõ ràng từ 12 đến 24 tháng đối với bề mặt da và phụ kiện khóa. 
                Hỗ trợ làm sạch, dưỡng ẩm và làm mới trọn đời sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Process Section */}
      <section className="about-process-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-tag">QUY TRÌNH CHẾ TÁC</div>
            <h2 className="about-section-heading">Hành Trình Kiến Tạo Một Tuyệt Phẩm</h2>
            <p className="section-subtext">
              Mỗi thành phẩm Tanpolo trải qua 4 giai đoạn gắt gao trước khi sẵn sàng đồng hành cùng bạn.
            </p>
          </div>

          <div className="process-timeline-grid">
            <div className="process-step-item">
              <div className="step-badge">01</div>
              <h3 className="step-title">Tuyển Chọn & Kiểm Định Da</h3>
              <p className="step-desc">
                Kiểm tra độ đồng đều, độ đàn hồi tự nhiên và loại bỏ những phần sẹo xước thô. Chỉ những tấm da đạt chuẩn loại A mới được đưa vào xưởng.
              </p>
            </div>

            <div className="process-step-item">
              <div className="step-badge">02</div>
              <h3 className="step-title">Ra Rập & Cắt Phom Chuẩn Xác</h3>
              <p className="step-desc">
                Ứng dụng khuôn dưỡng định hình kết hợp dao cắt thủ công để từng chi tiết đạt độ chính xác từng milimet, đảm bảo lắp ghép kín khít.
              </p>
            </div>

            <div className="process-step-item">
              <div className="step-badge">03</div>
              <h3 className="step-title">May Ráp & Khâu Chỉ Sáp Tay</h3>
              <p className="step-desc">
                Thợ lành nghề đục từng mũi kim và luồn chỉ sáp chịu lực, tạo nên hàng chỉ nổi sắc sảo và chắc chắn vượt trội so với may máy công nghiệp.
              </p>
            </div>

            <div className="process-step-item">
              <div className="step-badge">04</div>
              <h3 className="step-title">Sơn Cạnh, Đánh Bóng & KCS</h3>
              <p className="step-desc">
                Gọt mép, sơn phủ cạnh 3 lớp chống thấm và đánh bóng bằng sáp ong tự nhiên. Kiểm tra chất lượng (KCS) từng chiếc trước khi đóng hộp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Commitments */}
      <section className="about-commitments-section">
        <div className="container">
          <div className="commitment-card-banner">
            <div className="commitment-text-col">
              <div className="section-tag tag-light">CAM KẾT TỪ TANPOLO</div>
              <h2 className="commitment-title">
                Sự Hài Lòng Của Bạn Là Uy Tín 30 Năm Của Chúng Tôi
              </h2>
              <div className="commitment-list">
                <div className="commitment-row">
                  <IconCheckCircle size={20} />
                  <span><strong>Đền bù gấp 10 lần</strong> nếu phát hiện sản phẩm làm từ da giả, da nhân tạo kém chất lượng.</span>
                </div>
                <div className="commitment-row">
                  <IconCheckCircle size={20} />
                  <span><strong>Kiểm tra hàng trước khi thanh toán</strong> (Đồng kiểm khi nhận hàng toàn quốc).</span>
                </div>
                <div className="commitment-row">
                  <IconCheckCircle size={20} />
                  <span><strong>Đổi mới trong 7 ngày</strong> nếu có bất kỳ lỗi nào từ nhà sản xuất.</span>
                </div>
                <div className="commitment-row">
                  <IconCheckCircle size={20} />
                  <span><strong>Bảo dưỡng làm mới trọn đời:</strong> Hỗ trợ đánh xi, dưỡng mềm da định kỳ miễn phí tại cửa hàng.</span>
                </div>
              </div>
            </div>

            <div className="commitment-cta-col">
              <div className="artisan-stamp-box">
                <div className="stamp-circle">
                  <span>TANPOLO</span>
                  <strong>100%</strong>
                  <small>REAL LEATHER</small>
                </div>
              </div>
              <Link href="/products" className="btn-commitment-action">
                Xem Ngay Các Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
