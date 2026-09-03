'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useShop, INITIAL_BANNERS } from '@/context/ShopContext';
import { IconChevronLeft, IconChevronRight, IconArrowRight } from '@/components/icons';

export default function HomeBannerSlider() {
  const { banners } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const activeBanners = (banners && banners.length > 0)
    ? banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order)
    : INITIAL_BANNERS;

  const slides = activeBanners.length > 0 ? activeBanners : INITIAL_BANNERS;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, goToNext]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swiped left -> next slide
        goToNext();
      } else {
        // Swiped right -> prev slide
        goToPrev();
      }
    }
  };

  return (
    <section className="home-hero-slider-section">
      <div className="container">
        {/* Main Slider Viewport */}
        <div
          className="hero-slider-viewport"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider Track (Trượt mượt mà từ trái sang phải / phải sang trái) */}
          <div
            className="hero-slider-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((slide, idx) => (
              <div key={slide.id || idx} className="hero-slide-item">
                {/* Background Image with Pan/Zoom on active */}
                <div className="hero-slide-media">
                  <img
                    src={slide.image || '/assets/images/products/bo5-1.jpg'}
                    alt={slide.title.replace(/\n/g, ' ')}
                    className="hero-slide-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/products/bo5-1.jpg';
                    }}
                  />
                  {/* Cinematic Gradient Overlay */}
                  <div className="hero-slide-overlay" />
                </div>

                {/* Slide Text Content */}
                <div className="hero-slide-content">
                  {slide.badge && (
                    <span className="hero-slide-badge">
                      <span className="badge-pulse-dot" />
                      {slide.badge}
                    </span>
                  )}

                  <h1 className="hero-slide-title">
                    {slide.title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < slide.title.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h1>

                  {slide.subtitle && (
                    <p className="hero-slide-subtitle">{slide.subtitle}</p>
                  )}

                  <div className="hero-slide-actions">
                    <Link
                      href={slide.link || '/products'}
                      className="btn-hero-cta"
                    >
                      <span>{slide.buttonText || 'Khám phá ngay'}</span>
                      <IconArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="hero-slider-arrow prev"
                onClick={goToPrev}
                title="Xem banner trước (Trượt sang phải)"
                aria-label="Previous Slide"
              >
                <IconChevronLeft size={20} />
              </button>

              <button
                type="button"
                className="hero-slider-arrow next"
                onClick={goToNext}
                title="Xem banner tiếp theo (Trượt sang trái)"
                aria-label="Next Slide"
              >
                <IconChevronRight size={20} />
              </button>
            </>
          )}

          {/* Bottom Bar: Indicators & Counter */}
          {slides.length > 1 && (
            <div className="hero-slider-controls">
              {/* Pill Indicators */}
              <div className="hero-slider-indicators">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`hero-indicator-pill ${currentIndex === idx ? 'active' : ''}`}
                    onClick={() => goToIndex(idx)}
                    title={`Banner ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span className="indicator-progress" />
                  </button>
                ))}
              </div>

              {/* Slide Counter */}
              <div className="hero-slide-counter">
                <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
                <span>/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Badges below slider */}
        <div className="hero-features-bar">
          <div className="feature-item">
            <div className="feature-item-icon">🚚</div>
            <div>
              <span className="feature-title">Giao hàng toàn quốc</span>
              <span className="feature-desc">Freeship đơn từ 500k</span>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-item-icon">💎</div>
            <div>
              <span className="feature-title">Da bò thật 100%</span>
              <span className="feature-desc">Bảo hành 12 tháng</span>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-item-icon">🔄</div>
            <div>
              <span className="feature-title">Đổi trả 7 ngày</span>
              <span className="feature-desc">Kiểm tra trước khi nhận</span>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-item-icon">🛡️</div>
            <div>
              <span className="feature-title">Chính hãng Tanpolo</span>
              <span className="feature-desc">Since 1992s cao cấp</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
