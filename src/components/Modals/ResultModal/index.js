// ResultModal.jsx
import React from "react";
import styles from "./ResultModal.module.scss";

export default function ResultModal({ visible = false, success = true, message = "", onClose }) {
  if (!visible) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          {success ? (
            <div className={styles.success}>
              {/* smiling bowl SVG */}
              <svg viewBox="0 0 64 64" className={styles.icon}>
                <ellipse cx="32" cy="30" rx="24" ry="10" fill="#fff" />
                <path d="M8 30c0 13 10 22 24 22s24-9 24-22" fill="#ffd54a" />
                <circle cx="22" cy="26" r="2.5" fill="#6b2b00"/>
                <circle cx="42" cy="26" r="2.5" fill="#6b2b00"/>
                <path d="M22 38c4 4 16 4 20 0" stroke="#6b2b00" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          ) : (
            <div className={styles.fail}>
              {/* broken cookie SVG */}
              <svg viewBox="0 0 64 64" className={styles.icon}>
                <circle cx="32" cy="32" r="22" fill="#f8bbd0"/>
                <path d="M25 25 L33 33 L26 40" stroke="#8b3b3b" strokeWidth="2" fill="none"/>
                <circle cx="22" cy="24" r="2.5" fill="#6b2b00"/>
                <circle cx="38" cy="30" r="2.5" fill="#6b2b00"/>
              </svg>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.title}>{success ? "Thành công!" : "Thất bại"}</div>
          <div className={styles.message}>{message}</div>

          <div className={styles.actions}>
            <button className={styles.closeBtn} onClick={onClose}>
              {success ? "Tuyệt quá" : "Thử lại"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
