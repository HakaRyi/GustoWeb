import React from 'react';
import styles from '../../styles/Header.module.scss';
import { Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaAddressBook, FaPaperPlane, FaShoppingCart, FaSignInAlt } from 'react-icons/fa';

const logo = process.env.PUBLIC_URL + '/LOGOGUSTO.png';

function Header({ token, cartCount = 0 }) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <Link to="/">
            <img src={logo} alt="Gusto Logo" className={styles.logoImg} />
          </Link>
        </div>

        <Nav className={styles.navbar}>
          <Link to="/" className={styles.navLink}>
            <FaHome className={styles.navIcon} /> Trang chủ
          </Link>
          <Link to="/about" className={styles.navLink}>
            <FaInfoCircle className={styles.navIcon} /> Về chúng tôi
          </Link>
          <Link to="/contact" className={styles.navLink}>
            <FaPaperPlane className={styles.navIcon} /> Liên hệ
          </Link>

          {!token ? (
            <Link to="/login" className={`${styles.navLink} ${styles.loginBtn}`}>
              <FaSignInAlt className={styles.navIcon} /> Đăng nhập
            </Link>
          ) : (
            <>
              <Link to="/profile" className={styles.navLink}>
                <FaAddressBook className={styles.navIcon} /> Hồ sơ
              </Link>
              <Link to="/myCart" className={styles.navLink}>
                <FaShoppingCart className={styles.navIcon} />
                Món đã đặt
                {cartCount > 0 && (
                  <Badge className={styles.cartBadge}>{cartCount}</Badge>
                )}
              </Link>
            </>
          )}
        </Nav>
      </div>
    </header>
  );
}

export default Header;
