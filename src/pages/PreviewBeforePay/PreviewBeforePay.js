import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PreviewBeforePay.module.scss';

function PreviewBeforePay() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        orderId = null, // 🟢 cần có orderId để gọi API thanh toán
        orders = [],
        restaurantName = '',
        total = 0,
        restaurantId = null,
        startTime = '',
        endTime = '',
        numPeople = 1,
        note = '',
        selectedTable = '',
    } = location.state || {};

    const [provisionalFee, setProvisionalFee] = useState(total);
    const [feesApply, setFeesApply] = useState(3000);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [error, setError] = useState(null);
    const [showFeeTooltip, setShowFeeTooltip] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!restaurantId) {
            setError('Không tìm thấy ID nhà hàng. Vui lòng thử lại.');
            return;
        }
        setProvisionalFee(total);
        setFinalTotal(total + feesApply - discount);
    }, [total, feesApply, discount, restaurantId]);

    const handleBack = () => navigate(-1);

    // 🟢 Gọi API /api/Order/pay/{orderId}
    const handleDone = async () => {
        if (!orderId) {
            alert('Không tìm thấy mã đơn hàng.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://gustoweb.onrender.com/api/Order/pay/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi gọi API: ${response.status}`);
            }

            const data = await response.json();

            if (data.checkoutUrl) {
                // 🟢 Chuyển hướng người dùng đến trang thanh toán PayOS
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('Không nhận được checkoutUrl từ server.');
            }
        } catch (err) {
            console.error('Lỗi khi tạo link thanh toán:', err);
            setError('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.previewPage}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={handleBack}>
                    Quay lại
                </button>
                <h2 className={styles.title}>XEM TRƯỚC THANH TOÁN</h2>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.content}>
                <div className={styles.leftColumn}>
                    <h3 className={styles.sectionTitle}>{restaurantName}</h3>
                    <div className={styles.bookingInfo}>
                        <h4>Thông tin đặt bàn</h4>
                        <p>
                            <strong>Thời gian:</strong>{' '}
                            {startTime && endTime
                                ? `${new Date(startTime).toLocaleString('vi-VN')} - ${new Date(endTime).toLocaleString(
                                      'vi-VN',
                                  )}`
                                : 'Chưa chọn thời gian'}
                        </p>
                        <p>
                            <strong>Bàn:</strong> {selectedTable || 'Chưa chọn bàn'}
                        </p>
                        <p>
                            <strong>Số người:</strong> {numPeople}
                        </p>
                        <p>
                            <strong>Ghi chú:</strong> {note || 'Không có ghi chú'}
                        </p>
                    </div>

                    <div className={styles.orderSection}>
                        <h4 className={styles.sectionTitle}>Danh sách món</h4>
                        <div className={styles.orderList}>
                            {orders.length === 0 ? (
                                <p className={styles.noItems}>Chưa có món nào trong đơn hàng.</p>
                            ) : (
                                orders.map((item) => (
                                    <div key={item.id} className={styles.orderItem}>
                                        <img src={item.image} alt={item.name} className={styles.foodImg} />
                                        <div className={styles.foodInfo}>
                                            <p className={styles.foodName}>{item.name}</p>
                                            <p className={styles.foodDetails}>
                                                {[item.taste, ...(item.optionals || [])].filter(Boolean).join(', ')}
                                            </p>
                                            <p className={styles.foodPrice}>
                                                {item.price.toLocaleString()}đ × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.summary}>
                        <h4 className={styles.sectionTitle}>Tóm tắt thanh toán</h4>
                        <div className={styles.summaryRow}>
                            <span>Tạm tính</span>
                            <span>{provisionalFee.toLocaleString()}đ</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <div className={styles.feeWithTooltip}>
                                <span>Phí áp dụng</span>
                                <div
                                    className={styles.tooltipIcon}
                                    onMouseEnter={() => setShowFeeTooltip(true)}
                                    onMouseLeave={() => setShowFeeTooltip(false)}
                                >
                                    ?
                                    {showFeeTooltip && (
                                        <div className={styles.tooltipContent}>
                                            <h4>Phí dịch vụ hệ thống</h4>
                                            <p>Phí này bao gồm:</p>
                                            <ul>
                                                <li>• Duy trì và vận hành hệ thống đặt bàn</li>
                                                <li>• Hỗ trợ kỹ thuật 24/7</li>
                                                <li>• Dịch vụ chăm sóc khách hàng</li>
                                                <li>• Bảo mật thông tin đặt hàng</li>
                                                <li>• Kết nối với nhà hàng đối tác</li>
                                            </ul>
                                            <p>
                                                Phí giúp đảm bảo trải nghiệm đặt hàng mượt mà và an toàn cho quý khách.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span>{feesApply.toLocaleString()}đ</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Giảm giá</span>
                            <span>-{discount.toLocaleString()}đ</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Tổng cộng</span>
                            <span>{finalTotal.toLocaleString()}đ</span>
                        </div>
                        <button className={styles.doneBtn} onClick={handleDone} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreviewBeforePay;
