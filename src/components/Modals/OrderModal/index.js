import React, { useEffect, useMemo, useState } from 'react';
import styles from './OrderModal.module.scss';

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - order: object (order data)
 *      {
 *         id,
 *         tableName or table: { name } or string,
 *         bookingTime, // ISO string
 *         timeRange, // optional: "10:30 - 12:00"
 *         orderCode, // e.g. "G-001"
 *         customerName,
 *         customerPhone,
 *         status, // "Booked" | "Available" | "Done"...
 *         items: [
 *           { id, name, price, quantity, note }
 *         ]
 *      }
 * - apiBase: string (base url), optional
 * - onUpdated: function(updatedOrder) optional callback after successful update
 * - customFetch: function (url, init) optional, default window.fetch
 */
const OrderModal = ({
    isOpen,
    onClose,
    order = null,
    apiBase = 'https://gustoweb.onrender.com/api/Booking',
    onUpdated,
    booking = null,
    customFetch = fetch,
}) => {
    const [loading, setLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e) => {
            if (e.key === 'Escape') {
                onClose && onClose();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // compute total
    const total = useMemo(() => {
        if (!order?.orderDetails || !Array.isArray(order.orderDetails)) return 0;
        return order.orderDetails.reduce((s, it) => s + Number(it.foodPrice || 0), 0) + 3000; // + them 3k phi dich vu cua app
    }, [order]);

    if (!isOpen) return null;

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('vi-VN');
        } catch {
            return iso;
        }
    };

    const formatTime = (iso) => {
        try {
            return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const handleComplete = async () => {
        if (!order?.orderId) return;
        setLoading(true);
        setResultMsg(null);

        try {
            const res = await customFetch(`${apiBase}/status/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify('Available'),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                setResultMsg({ ok: false, text: text || 'Cập nhật trạng thái thất bại' });
            } else {
                const data = await res.json().catch(() => null);
                onUpdated && onUpdated({ ...order, status: 'Available', serverResponse: data });
                setResultMsg({ ok: true, text: 'Đã chuyển trạng thái sang Ready' });
            }
        } catch (err) {
            console.error(err);
            setResultMsg({ ok: false, text: 'Lỗi kết nối' });
        } finally {
            setLoading(false);
        }
    };

    const handleDone = async () => {
        if (!order?.orderId) return;
        setLoading(true);
        setResultMsg(null);

        try {
            const res = await customFetch(`${apiBase}/status/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify('Done'),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                setResultMsg({ ok: false, text: text || 'Cập nhật trạng thái thất bại' });
            } else {
                const data = await res.json().catch(() => null);
                onUpdated && onUpdated({ ...order, status: 'Done', serverResponse: data });
                setResultMsg({ ok: true, text: 'Đã hoàn thành order' });
            }
        } catch (err) {
            console.error(err);
            setResultMsg({ ok: false, text: 'Lỗi kết nối' });
        } finally {
            setLoading(false);
        }
    };

    const phone = booking.diner.phone || '';

    return (
        <div className={styles.overlay} onClick={() => onClose && onClose()}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleBlock}>
                        <div className={styles.tableName}>{booking.table.name || 'Bàn'}</div>
                        <div className={styles.dateBlock}>
                            <div className={styles.date}>{formatDate(booking.startTime)}</div>
                            <div className={styles.time}>{order?.timeRange || `${formatTime(booking.startTime)} `}</div>
                        </div>
                    </div>

                    <button className={styles.closeBtn} onClick={onClose}>
                        X
                    </button>
                </div>

                <div className={styles.meta}>
                    <div className={styles.orderCode}>Order : {order?.orderId || '—'}</div>
                    <div className={styles.customer}>
                        <div className={styles.customerName}>{booking.diner.fullName || 'Khách'}</div>
                        {phone ? (
                            <a className={styles.phone} href={`tel:${phone}`}>
                                {phone}
                            </a>
                        ) : null}
                    </div>
                </div>

                <div className={styles.itemsWrapper}>
                    <div className={styles.itemsHeader}>
                        <div>Tên món:</div>
                        <div>Giá</div>
                        <div>Số lượng</div>
                        <div>Đơn giá</div>
                    </div>

                    <div className={styles.itemsList}>
                        {Array.isArray(order?.orderDetails) && order.orderDetails.length > 0 ? (
                            order.orderDetails.map((it) => (
                                <div key={it.orderDetailId} className={styles.itemRow}>
                                    <div className={styles.itemName}>
                                        <div className={styles.itemTitle}>{it.food.name}</div>
                                        {/* {it.note && <div className={styles.itemNote}>Note: {it.note}</div>} */}
                                    </div>
                                    <div className={styles.itemPrice}>
                                        {Number(it.food.price).toLocaleString('vi-VN')}
                                    </div>
                                    <div className={styles.itemQty}>{it.numberOfFood}</div>
                                    <div className={styles.itemTotal}>
                                        {it.foodPrice ? it.foodPrice.toLocaleString('vi-VN') : '0'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noItems}>Chưa có món</div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerLeft}>
                        {order?.status === 'Booked' ? (
                            <button className={styles.primaryBtn} onClick={handleComplete} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Hoàn Thành'}
                            </button>
                        ) : (
                            <button className={`${styles.primaryBtn} ${styles.disabled}`} disabled>
                                Hoàn Thành
                            </button>
                        )}
                    </div>
                    <div className={styles.footerRight}>
                        <div className={styles.totalLabel}>Total:</div>
                        <div className={styles.totalValue}>{total.toLocaleString('vi-VN')} VND</div>
                        {/* Optional Done button (if you want separate Done action) */}
                        {booking.status === 'Available' && (
                            <button className={styles.doneBtn} onClick={handleDone} disabled={loading}>
                                {loading ? 'Đang...' : 'Done'}
                            </button>
                        )}
                    </div>
                </div>

                {resultMsg && (
                    <div className={resultMsg.ok ? styles.resultOk : styles.resultError} style={{ marginTop: 8 }}>
                        {resultMsg.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderModal;
