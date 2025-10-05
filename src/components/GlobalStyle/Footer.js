import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Footer.module.scss";

const logo = process.env.PUBLIC_URL + "/LOGOGUSTO.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Link to="/">
            <img src={logo} alt="Gusto Logo" className={styles.logoImg} />
          </Link>
        </div>
        <div className={styles.footerLinks}>
          <a href="/about">Về chúng tôi</a>
          <a href="/contact">Liên hệ</a>
          <a href="/privacy">Điều khoản pháp lý</a>
        </div>
        <div className={styles.footerCopy}>
          <p>&copy; {new Date().getFullYear()} Gusto. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
