import React, { useEffect } from "react";
import styles from "../styles/Contact.module.scss";

const Contact = () => {
 useEffect(() => {
  const allElements = document.querySelectorAll("*");
  const fadeSections = Array.from(allElements).filter(el =>
    el.className?.toString().includes("fadeSection")
  );

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

  fadeSections.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);
  return (
    <div className={styles.contactPage_container}>
      <div className={styles.contactPage_overlay}></div>

      <div className={`${styles.contactPage_content} ${styles.fadeSection}`}>
        <h1>Liên Hệ Với GUSTO</h1>
        <p>
          Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến, phản hồi và câu hỏi của bạn.
          Hãy liên hệ với GUSTO để cùng nhau xây dựng một nền tảng đặt món ăn tốt hơn mỗi ngày.
        </p>

        <div className={`${styles.contactPage_grid} ${styles.fadeSection}`}>
          {/* --- Thông tin liên hệ --- */}
          <div className={`${styles.contactPage_info} ${styles.fadeSection}`}>
            <h2>Thông Tin Liên Hệ</h2>
            <ul>
              <li><strong>Địa chỉ:</strong> FPT University, TP. Hồ Chí Minh</li>
              <li><strong>Email:</strong> gusto.cpn@gmail.com</li>
              <li><strong>Hotline:</strong> 035 773 2955</li>
              <li><strong>Giờ làm việc:</strong> 8:00 - 18:00 (Thứ 2 - Thứ 7)</li>
            </ul>
          </div>

          {/* --- Form liên hệ --- */}
          <form className={`${styles.contactPage_form} ${styles.fadeSection}`}>
            <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Họ và tên" required />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Email của bạn" required />
            </div>
            <div className={styles.formGroup}>
              <textarea rows="5" placeholder="Nội dung tin nhắn..." required></textarea>
            </div>
            <button type="submit" className={styles.contactPage_btn}>Gửi Tin Nhắn</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
