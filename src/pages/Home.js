import React, { useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import heroImage from '../assets/hero-food.png';
import discount from '../assets/discount.png';
import preorder from '../assets/preorder.png';
import tracking from '../assets/tracking.png';



function Home() {
  useEffect(() => {
    // 👇 Hiệu ứng fade-in / fade-out khi cuộn
    const sections = document.querySelectorAll(`.${styles.fadeSection}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            entry.target.classList.remove(styles.visible);
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  useEffect(() => {
    // 👇 Hiệu ứng parallax cho hero background
    const handleScroll = () => {
      const hero = document.querySelector(`.${styles.heroSection}`);
      if (hero) {
        const scrollY = window.scrollY;
        hero.style.backgroundPositionY = `${scrollY * 0.4}px`; // di chuyển nhẹ
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section
        className={`${styles.heroSection} ${styles.fadeSection}`}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroContent}>
          <h1>GUSTO</h1>
          <p>Đặt món trước – Trải nghiệm ẩm thực không chờ đợi</p>
          <Link to="/restaurants">
            <Button variant="warning" className={styles.heroBtn}>
              Khám phá ngay
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className={`${styles.featuresSection} ${styles.fadeSection}`}>
        <h2>Tại sao chọn Gusto?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <img src={preorder} alt="Đặt món nhanh" />
            <h3>Đặt món trước</h3>
            <p>Tiết kiệm thời gian, không cần xếp hàng chờ đợi.</p>
          </div>
          <div className={styles.featureCard}>
            <img src={tracking} alt="Theo dõi đơn" />
            <h3>Theo dõi đơn hàng</h3>
            <p>Biết chính xác khi nào món của bạn sẵn sàng.</p>
          </div>
          <div className={styles.featureCard}>
            <img src={discount} alt="Ưu đãi hấp dẫn" />
            <h3>Ưu đãi hấp dẫn</h3>
            <p>Nhận nhiều khuyến mãi và giảm giá mỗi ngày!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.ctaSection} ${styles.fadeSection}`}>
        <h2>Bắt đầu đặt món ngay hôm nay!</h2>
        <p>Trải nghiệm nền tảng đặt món hiện đại, nhanh chóng và tiện lợi nhất.</p>
        <Link to="/register">
          <Button variant="outline-light" className={styles.ctaBtn}>
            Đăng ký ngay
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default Home;
