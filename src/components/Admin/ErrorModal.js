// src/components/Admin/ErrorModal.js
import React from "react";
import styles from "./ErrorModal.module.scss";

const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h4>⚠️ Lỗi</h4>
                <div className={styles.content}>
                    {message.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
