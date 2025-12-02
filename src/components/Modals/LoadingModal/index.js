// LoadingModal.jsx
import React from "react";
import styles from "./LoadingModal.module.scss";

export default function LoadingModal({ visible = false, message = "Đang tải dữ liệu..." }) {
  if (!visible) return null;

  return (
    <div className={styles.backdrop} role="status" aria-live="polite">
      <div className={styles.modal}>
        <div className={styles.foodSpin}>
          {/* simple fork+knife svg */}
          <svg viewBox="0 0 64 64" className={styles.icon}>
            <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v24" />
              <path d="M8 6c1.5 3 4 3 6 0" />
              <path d="M20 4v24" />
              <path d="M24 6c-1.5 3-4 3-6 0" />
              <path d="M36 12c0 6 6 10 12 10s12-4 12-10" />
            </g>
          </svg>
        </div>

        <div className={styles.texts}>
          <div className={styles.title}>Xin chờ một chút 🍜</div>
          <div className={styles.message}>{message}</div>
        </div>
      </div>
    </div>
  );
}
