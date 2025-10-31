import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import style from './HistoryBooking.module.scss';
import { customFetch } from '~/config/customFetch';
import { format } from 'date-fns';
import OrderModal from '~/components/Modals/OrderModal';

const API_BASE = 'https://gustoweb.onrender.com/api/Booking';

function HistoryBooking({ restaurantId }) {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(false);

    // Load toàn bộ booking
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await customFetch(`https://gustoweb.onrender.com/api/Booking/resBooking`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setBookings(data);
            setFilteredBookings(filterByDate(data, selectedDate));
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu booking:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [restaurantId]);

    // Hàm lọc theo ngày
    const filterByDate = (list, date) => {
        return list.filter((b) => {
            const bookingDate = b.bookingTime?.split('T')[0];
            return bookingDate === date;
        });
    };

    const handleFilter = () => {
        setFilteredBookings(filterByDate(bookings, selectedDate));
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'done':
                return style.statusDone;
            case 'available':
                return style.statusAvailable;
            case 'pending':
                return style.statusPending;
            default:
                return '';
        }
    };

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
        // optionally close modal
        setOpen(false);
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <div className={style.filter}>
                    <label>Ngày</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={style.datePicker}
                    />
                    <button onClick={handleFilter} className={style.filterBtn}>
                        Lọc
                    </button>
                </div>
            </div>

            <div className={style.stats}>
                <span>
                    Số đơn: <b>{filteredBookings.length}</b>
                </span>
                <span>
                    Doanh thu:{' '}
                    <b className={style.revenue}>
                        {filteredBookings.reduce((sum, b) => sum + (b.orders[0].finalPrice || 0), 0).toLocaleString()}{' '}
                        VND
                    </b>
                </span>
            </div>

            <div className={style.table}>
                <div className={style.tableHeader}>
                    <div>Mã Đơn Hàng</div>
                    <div>Số Món</div>
                    <div>Giá</div>
                    <div>Trạng Thái</div>
                </div>

                <AnimatePresence>
                    {loading ? (
                        <motion.div
                            key="loading"
                            className={style.loading}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            Đang tải dữ liệu...
                        </motion.div>
                    ) : filteredBookings.length === 0 ? (
                        <motion.div
                            key="empty"
                            className={style.empty}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            Không có đơn nào trong ngày này.
                        </motion.div>
                    ) : (
                        filteredBookings.map((b) => (
                            <motion.div
                                key={b.bookingId}
                                className={style.tableRow}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => handleOpen(b, b.orders[0])}
                                style={{ cursor: 'pointer' }}
                            >
                                <div>{b.bookingCode || b.bookingId}</div>
                                <div>{b.orders[0].orderDetails.length || 0}</div>
                                <div>{(b.orders[0].finalPrice || 0).toLocaleString()}</div>
                                <div className={getStatusClass(b.status)}>{b.status}</div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
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
}

export default HistoryBooking;
