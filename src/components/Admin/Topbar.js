import React from "react";
import styles from "./Topbar.module.scss";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.logo}>GUSTO Admin</div>
        <div className={styles.searchBox}>
          <FaSearch className={styles.icon} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.iconWrapper}>
          <FaBell />
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.avatar}>
          <FaUserCircle size={28} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
