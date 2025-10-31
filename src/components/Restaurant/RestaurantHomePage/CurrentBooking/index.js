import React, { useState, useEffect } from 'react';
import styles from './CurrentBooking.module.scss';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';
import OrderModal from '~/components/Modals/OrderModal';

const API_BASE = 'https://gustoweb.onrender.com/api/Booking';
const CurrentBooking = () => {
    const [bookings, setBookings] = useState([]);

    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const fetchBookings = async () => {
        try {
            setLoadingVisible(true);
            var res = await customFetch(`${API_BASE}/undone`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
        } finally {
            setLoadingVisible(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleAction = async (id, nextStatus) => {
        try {
            setLoadingVisible(true);
            var res = await customFetch(`${API_BASE}/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nextStatus),
            });
            if (!res.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
            setBookings((prev) =>
                nextStatus === 'Done'
                    ? prev.filter((b) => b.id !== id) // Done thì xoá khỏi danh sách
                    : prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)),
            );
            fetchBookings();
        } catch (error) {
            setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
        } finally {
            setLoadingVisible(false);
        }
    };

    const columns = [
        { title: 'Booked', status: 'booked', actionLabel: 'Ready', next: 'Available' },
        { title: 'Available', status: 'available', actionLabel: 'Done', next: 'Done' },
    ];

    //Xử lý cho modal:
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleOpen = (booking, order) => {
        setSelectedBooking(booking);
        setOrder(order);
        setOpen(true);
    };

    // callback when modal updates order
    const onUpdated = (updated) => {
        // refresh data list or update state
        console.log('Updated by modal:', updated);
        fetchBookings();
        // optionally close modal
        setOpen(false);
    };

    console.log('Bookings:', bookings);

    return (
        <div className={styles.wrapper}>
            <div className={styles.columns}>
                {columns.map((col) => (
                    <div key={col.title} className={styles.column}>
                        <h2 className={styles.columnTitle}>{col.title}</h2>
                        <div className={styles.list}>
                            {bookings
                                .filter((b) => b.status === col.status)
                                .map((b) => (
                                    <div
                                        key={b.bookingId}
                                        className={styles.card}
                                        onClick={() => handleOpen(b, b.orders[0])}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={styles.info}>
                                            <div className={styles.avatar}>{b.diner.avatarUrl}</div>
                                            <div className={styles.details}>
                                                <div className={styles.topRow}>
                                                    <span className={styles.name}>{b.diner.fullName}</span>
                                                    <span className={styles.date}>
                                                        {new Date(b.bookingTime).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className={styles.subInfo}>
                                                    {b.orders[0].orderDetails.length} món
                                                </div>
                                                <div className={styles.table}>{b.table.name}</div>
                                            </div>
                                        </div>

                                        {col.next && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAction(b.bookingId, col.next);
                                                }}
                                                className={styles.actionBtn}
                                            >
                                                {col.actionLabel}
                                            </button>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
            <OrderModal
                isOpen={open}
                onClose={() => setOpen(false)}
                order={order}
                booking={selectedBooking}
                apiBase="https://gustoweb.onrender.com/api/Booking"
                onUpdated={onUpdated} // nếu bạn có wrapper fetch
            />
        </div>
    );
};

export default CurrentBooking;
