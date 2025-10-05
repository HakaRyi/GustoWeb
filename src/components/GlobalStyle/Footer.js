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
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className={styles.footerCopy}>
          <p>&copy; {new Date().getFullYear()} Gusto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
