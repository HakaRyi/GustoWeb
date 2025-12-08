import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { FaUniversity, FaCopy, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import styles from './BankInfoCard.module.scss';

const ADMIN_BANK_API = 'https://localhost:7176/api/admin/AdminPaymentMerchant/get-by-restaurant';

const BankInfoCard = ({ restaurantId }) => {
    const [bankInfo, setBankInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (restaurantId) {
            fetchBankInfo();
        }
    }, [restaurantId]);

    const fetchBankInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${ADMIN_BANK_API}/${restaurantId}`);
            setBankInfo(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setBankInfo(null);
            } else {
                setError('Lỗi kết nối server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className={styles.loadingBox}>
            <Spinner animation="border" size="sm" className="me-2" /> 
            Đang tải dữ liệu...
        </div>
    );

    if (error) return <small className="text-danger ps-2">{error}</small>;

    if (!bankInfo) {
        return (
            <div className={styles.alertBox}>
                <FaExclamationTriangle />
                <div>
                    <strong>Chưa có thông tin</strong>
                    <span className="small">Nhà hàng chưa cập nhật số tài khoản.</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                {/* Header */}
                <div className={styles.header}>
                    <FaUniversity />
                    <h6>Thông tin thanh toán</h6>
                </div>

                {/* Rows */}
                <div className={styles.infoRow}>
                    <span className={styles.label}>Ngân hàng</span>
                    <span className={`${styles.value} ${styles.highlight}`}>
                        {bankInfo.bankName}
                    </span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Chủ tài khoản</span>
                    <span className={`${styles.value} ${styles.uppercase}`}>
                        {bankInfo.accountName}
                    </span>
                </div>

                {/* Account Number Box */}
                <div className={styles.accountBox}>
                    <div>
                        <span className={styles.accLabel}>Số tài khoản</span>
                        <span className={styles.accNumber}>{bankInfo.bankNumber}</span>
                    </div>
                    <button 
                        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                        onClick={() => handleCopy(bankInfo.bankNumber)}
                        title="Sao chép"
                    >
                        {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </div>
                
                <div className={styles.footer}>
                     Cập nhật: {new Date(bankInfo.lastUpdate).toLocaleDateString('vi-VN')}
                </div>
            </div>
        </div>
    );
};

export default BankInfoCard;