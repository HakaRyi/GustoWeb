// src/components/common/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import styles from './ToastNotification.module.scss';
import { FaCheckCircle } from 'react-icons/fa';

function ToastNotification({ message, isVisible, onHide }) {
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsHiding(false); // Đảm bảo không bị hide ngay

            const timer = setTimeout(() => {
                setIsHiding(true); // Bắt đầu fade out
                setTimeout(onHide, 400); // Đợi fade out xong mới gọi onHide
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    if (!isVisible && !isHiding) return null;

    return (
        <div className={`${styles.toast} ${isVisible && !isHiding ? styles.show : ''} ${isHiding ? styles.hide : ''}`}>
            <FaCheckCircle className={styles.icon} />
            <span>{message}</span>
        </div>
    );
}

export default ToastNotification;
