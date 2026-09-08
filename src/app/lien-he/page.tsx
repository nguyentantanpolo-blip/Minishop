'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import {
  IconPhone,
  IconMapPin,
  IconClock,
  IconMail,
  IconCheckCircle,
  IconSparkles,
  IconGmail,
  IconFacebook,
  IconZalo,
  IconExternalLink,
} from '@/components/icons';

export default function LienHePage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    topic: 'tu-van',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn', 'warning');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại để chúng tôi liên hệ', 'warning');
      return;
    }
    if (!formData.message.trim()) {
      showToast('Vui lòng nhập nội dung cần hỗ trợ', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending contact request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Cảm ơn bạn! Tanpolo đã nhận được yêu cầu và sẽ liên hệ lại trong ít phút.', 'success');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        topic: 'tu-van',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="contact-page-wrapper">
      {/* Header Banner */}
      <section className="contact-hero-section">
        <div className="container">
          <div className="contact-hero-content">
            <div className="contact-hero-badge">
              <IconSparkles size={16} />
              <span>HỖ TRỢ TẬN TÂM 24/7 • TANPOLO LEATHER</span>
            </div>
            <h1 className="contact-hero-title">Liên Hệ Với Chúng Tôi</h1>
            <p className="contact-hero-subtitle">
              Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp, tư vấn chọn sản phẩm phù hợp 
              hoặc tiếp nhận đơn hàng thiết kế riêng theo yêu cầu của quý khách.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Details + Form */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left Column: Direct Contact Info & Fast Actions */}
            <div className="contact-info-column">
              <div className="contact-card-highlight">
                <div className="brand-crest-mini">
                  <span className="since-badge">SINCE 1992s</span>
                </div>
                <h2 className="company-official-name">CÔNG TY TNHH GIÀY NHẬT HUY</h2>
                <p className="company-mst">Thương hiệu: <strong>TANPOLO LEATHER</strong> • MST: 0319013067</p>

                <div className="contact-details-list">
                  {/* Address */}
                  <div className="contact-detail-item">
                    <div className="contact-icon-wrapper">
                      <IconMapPin size={22} />
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-title">Showroom & Xưởng Sản Xuất</span>
                      <p className="contact-item-desc">
                        985/71/5 Hương Lộ 2, Phường Bình Trị Đông, TP. Hồ Chí Minh, Việt Nam
                      </p>
                    </div>
                  </div>

                  {/* Phone / Hotline */}
                  <div className="contact-detail-item">
                    <div className="contact-icon-wrapper">
                      <IconPhone size={22} />
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-title">Hotline Tư Vấn & Đặt Hàng</span>
                      <a href="tel:0988444806" className="contact-phone-link">
                        098 844 48 06
                      </a>
                      <span className="contact-time-note">(Hỗ trợ từ 8:00 đến 21:00 hàng ngày)</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="contact-detail-item">
                    <div className="contact-icon-wrapper">
                      <IconMail size={22} />
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-title">Hòm Thư Điện Tử (Email)</span>
                      <a href="mailto:tanpolo.shoes@gmail.com" className="contact-email-link">
                        tanpolo.shoes@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="contact-detail-item">
                    <div className="contact-icon-wrapper">
                      <IconClock size={22} />
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-title">Giờ Mở Cửa Phục Vụ</span>
                      <p className="contact-item-desc">
                        Thứ Hai - Chủ Nhật: <strong>8:00 - 21:00</strong> (Không nghỉ lễ)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Connect Action Buttons */}
                <div className="quick-connect-block">
                  <span className="quick-connect-title">Kênh Kết Nối Nhanh:</span>
                  <div className="quick-connect-grid">
                    <a href="tel:0988444806" className="quick-btn btn-call">
                      <IconPhone size={18} />
                      <span>Gọi Ngay</span>
                    </a>
                    <a
                      href="https://zalo.me/0988444806"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-btn btn-zalo"
                    >
                      <IconZalo size={20} />
                      <span>Chat Zalo</span>
                    </a>
                    <a
                      href="https://www.facebook.com/tanpolovietnam"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-btn btn-fb"
                    >
                      <IconFacebook size={20} color="#1877F2" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="mailto:tanpolo.shoes@gmail.com"
                      className="quick-btn btn-mail"
                    >
                      <IconGmail size={20} />
                      <span>Gmail</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Policy Quick Links */}
              <div className="contact-subcard">
                <h3 className="subcard-title">Hỗ Trợ Mua Sắm & Chính Sách</h3>
                <div className="policy-quick-links">
                  <Link href="/chinh-sach/bao-hanh" className="policy-pill-link">
                    Bảo hành sản phẩm
                  </Link>
                  <Link href="/chinh-sach/doi-tra-hang" className="policy-pill-link">
                    Chính sách đổi trả 7 ngày
                  </Link>
                  <Link href="/chinh-sach/van-chuyen" className="policy-pill-link">
                    Giao hàng toàn quốc
                  </Link>
                  <Link href="/chinh-sach/cham-soc-khach-hang" className="policy-pill-link">
                    Chăm sóc khách hàng
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="contact-form-column">
              <div className="contact-form-card">
                <div className="form-card-header">
                  <h2 className="form-title">Gửi Tin Nhắn Cho Tanpolo</h2>
                  <p className="form-subtitle">
                    Điền thông tin bên dưới, nhân viên tư vấn sẽ liên hệ lại với bạn trong vòng 15 - 30 phút.
                  </p>
                </div>

                {isSubmitted && (
                  <div className="form-success-banner">
                    <IconCheckCircle size={24} />
                    <div>
                      <strong>Gửi yêu cầu thành công!</strong>
                      <p>Chúng tôi đã nhận được thông tin và sẽ gọi lại cho bạn sớm nhất.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-actual-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">
                        Họ và tên <span className="text-required">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className="form-input-field"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">
                        Số điện thoại <span className="text-required">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="form-input-field"
                        placeholder="Ví dụ: 0988 444 806"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email liên hệ (không bắt buộc)</label>
                      <input
                        id="email"
                        type="email"
                        className="form-input-field"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="topic">Bạn cần hỗ trợ về vấn đề gì?</label>
                      <select
                        id="topic"
                        className="form-input-field"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      >
                        <option value="tu-van">Tư vấn chọn sản phẩm đồ da</option>
                        <option value="dat-hang">Hỗ trợ đặt hàng & kiểm tra tiến độ</option>
                        <option value="si-qua-tang">Đặt hàng sỉ & Quà tặng doanh nghiệp</option>
                        <option value="bao-hanh">Yêu cầu bảo hành / đổi size sản phẩm</option>
                        <option value="gop-y">Ý kiến đóng góp & phản ánh dịch vụ</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Nội dung tin nhắn <span className="text-required">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="form-input-field textarea-field"
                      placeholder="Mô tả chi tiết câu hỏi hoặc nhu cầu của quý khách..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit-contact"
                  >
                    {isSubmitting ? (
                      <span>Đang gửi yêu cầu...</span>
                    ) : (
                      <>
                        <span>Gửi Tin Nhắn Ngay</span>
                        <IconSparkles size={18} />
                      </>
                    )}
                  </button>

                  <p className="form-privacy-note">
                    <IconCheckCircle size={14} />
                    <span>Thông tin của bạn được cam kết bảo mật tuyệt đối theo chính sách của Tanpolo.</span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-section-header">
            <div>
              <div className="section-tag">ĐỊA ĐIỂM CỬA HÀNG</div>
              <h2 className="map-title">Ghé Thăm Xưởng & Showroom Tanpolo</h2>
              <p className="map-desc">
                985/71/5 Hương Lộ 2, Phường Bình Trị Đông, TP. Hồ Chí Minh
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=985/71/5+H%C6%B0%C6%A1ng+L%E1%BB%99+2+B%C3%ACnh+Tr%E1%BB%8B+%C4%90%C3%B4ng+H%E1%BB%93+Ch%C3%AD+Minh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-google-maps"
            >
              <span>Mở Chỉ Đường Google Maps</span>
              <IconExternalLink size={16} />
            </a>
          </div>

          <div className="google-map-container">
            <iframe
              title="Vị trí Showroom Tanpolo Leather"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6467303102377!2d106.60251147586862!3d10.761685759461125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c3c907a90b1%3A0xe9633e49be88a2e1!2zOTg1IEjGsMahbmcgTOG7mSAyLCBCw6xuaCBUcuG7iyDEkMO0bmcsIELDrG5oIFTDom4sIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1709900000000!5m2!1svi!2s"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
