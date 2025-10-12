import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './BookingHistory.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareLeft, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { customFetch } from '~/config/customFetch';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import FeedbackModal from '~/components/Modals/FeedbackModal';

function BookingHistory() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [bookings, setBookings] = useState([]);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [modalBooking, setModalBooking] = useState(null);
    const [modalOrder, setModalOrder] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoadingVisible(true);
                var res = await customFetch('https://localhost:7176/api/DinerProfile/my-bookings', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
                const data = await res.json();
                console.log(data);
                setBookings(data);
            } catch (error) {
                setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
            } finally {
                setLoadingVisible(false);
            }
        };

        fetchBooking();
    }, []);

    //UI Logic
    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const formatCurrency = (value) => {
        try {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        } catch (e) {
            return value;
        }
    };

    const openFeedbackModal = (booking, order) => {
        setModalBooking(booking);
        setModalOrder(order);
        setFeedbackModalVisible(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalVisible(false);
        setModalBooking(null);
        setModalOrder(null);
    };

    const onFeedbackSaved = (savedData) => {
        // savedData: server trả về feedback hoặc payload đã gửi
        setBookings((prev) =>
            prev.map((b) => {
                if (b.bookingId === (modalBooking?.bookingId ?? modalBooking?.id)) {
                    const newB = { ...b };
                    // cập nhật foodReviews nếu server trả về feedbacks
                    if (savedData?.feedbacks) {
                        // gộp/ghi đè foodReviews
                        newB.foodReviews = savedData.feedbacks.map((f, i) => ({
                            reviewId: f.reviewId ?? null,
                            foodId: f.itemId ?? f.foodId,
                            rating: f.rating,
                            description: f.comment ?? f.description ?? '',
                            date: new Date().toISOString(),
                        }));
                    }

                    if (modalOrder) {
                        newB.orders = (newB.orders || []).map((o) => {
                            if (o.orderId === (modalOrder.orderId ?? modalOrder.id)) {
                                return { ...o, status: 'Feedbacked' };
                            }
                            return o;
                        });
                    }
                    return newB;
                }
                return b;
            }),
        );
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <div className={style.title}>Booking History</div>
                <div className={style.logout}>
                    <FontAwesomeIcon icon={faCaretSquareLeft} />
                </div>
            </div>

            <div className={style.contentWrapper}>
                {bookings.length === 0 && !loadingVisible && <div className={style.empty}>Chưa có booking nào.</div>}

                {bookings.map((booking) => {
                    const bookingId = booking.bookingId;
                    const createdAt = booking.createdAt ?? '';
                    const restaurant = booking.restaurant ?? {};
                    const bookingStatus = booking.status ?? ''; // ex: "Confirmed"

                    // For UI we show each order inside booking (một booking có thể có nhiều orders)
                    const orders = Array.isArray(booking.orders) ? booking.orders : [];

                    return (
                        <div className={style.historyItem} key={bookingId}>
                            <div className={style.imgContainer}>
                                <img
                                    className={style.avartar}
                                    src={
                                        restaurant.avatarUrl ??
                                        'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg'
                                    }
                                    alt="restaurantAvt"
                                />
                            </div>

                            <div className={style.bookInfor}>
                                <div className={style.restaurantName}>{restaurant.fullName ?? 'Nhà hàng'}</div>
                                <div className={style.restaurantAdress}>{restaurant.address ?? ''}</div>
                                <div className={style.bookingDate}>
                                    {createdAt ? new Date(createdAt).toLocaleString('vi-VN') : ''}
                                </div>

                                {/* Render each order inside booking */}
                                <div className={style.ordersList}>
                                    {orders.map((order) => {
                                        const orderId = order.orderId;
                                        const orderStatus = order.status ?? '';
                                        const totalPrice = order.totalPrice ?? 0;

                                        // derive whether booking/order already has foodReviews (global location is booking.foodReviews)
                                        const reviewFoodIds = new Set(
                                            (order.foodReviews ?? [])
                                                .map((r) => r.foodId ?? r.food?.foodId)
                                                .filter(Boolean),
                                        );

                                        // determine if any orderDetail's foodId exists in reviewFoodIds
                                        const hasFeedbacked = (order.orderDetails ?? []).some((d) =>
                                            reviewFoodIds.has(d.foodId ?? d.food?.foodId),
                                        );

                                        // Display status text mapping
                                        const statusText =
                                            bookingStatus === 'Confirmed'
                                                ? 'Booked'
                                                : orderStatus === 'Completed'
                                                ? 'Hoàn tất'
                                                : hasFeedbacked
                                                ? 'Feedbacked'
                                                : orderStatus ?? '';

                                        return (
                                            <div className={style.orderCard} key={orderId}>
                                                <div className={style.orderHeader}>
                                                    <div>
                                                        <div className={style.orderLabel}>Order #{orderId}</div>
                                                        <div className={style.orderDate}>
                                                            {order.date
                                                                ? new Date(order.date).toLocaleString('vi-VN')
                                                                : ''}
                                                        </div>
                                                    </div>

                                                    <div className={style.rowBetween}>
                                                        <div className={style.bookingStatusBtn}>
                                                            {orderStatus === 'Completed'
                                                                ? hasFeedbacked
                                                                    ? 'Hoàn thành'
                                                                    : 'Feedback'
                                                                : statusText}
                                                        </div>

                                                        {/* Expand button to show order details */}
                                                        <button
                                                            className={style.expandBtn}
                                                            onClick={() => toggleExpand(orderId)}
                                                        >
                                                            <span>
                                                                {expandedIds.has(orderId)
                                                                    ? 'Ẩn chi tiết'
                                                                    : 'Xem chi tiết'}
                                                            </span>
                                                            <FontAwesomeIcon
                                                                icon={faCircleChevronDown}
                                                                className={expandedIds.has(orderId) ? style.rotate : ''}
                                                            />
                                                        </button>

                                                        {/* Feedback action button (nút ấn được) */}
                                                        {(orderStatus === 'Completed' ||
                                                            orderStatus === 'Feedbacked') && (
                                                            <button
                                                                className={style.feedbackActionBtn}
                                                                onClick={() => openFeedbackModal(booking, order)}
                                                            >
                                                                {hasFeedbacked ? 'Cập nhật Feedback' : 'Feedback'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* details panel */}
                                                <div
                                                    className={`${style.detailsPanel} ${
                                                        expandedIds.has(orderId) ? style.open : ''
                                                    }`}
                                                >
                                                    {Array.isArray(order.orderDetails) &&
                                                    order.orderDetails.length > 0 ? (
                                                        <>
                                                            {order.orderDetails.map((d) => {
                                                                const qty = d.numberOfFood ?? d.qty ?? 1;
                                                                const price = d.food?.price ?? 0;
                                                                const subtotal = Number(qty) * Number(price || 0);
                                                                const foodName = d.food?.name ?? 'Món ăn';
                                                                const img =
                                                                    d.food?.foodUrl ??
                                                                    'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg';

                                                                return (
                                                                    <div
                                                                        className={style.dishRow}
                                                                        key={
                                                                            d.orderDetailId ?? `${orderId}-${d.foodId}`
                                                                        }
                                                                    >
                                                                        <img
                                                                            className={style.dishImg}
                                                                            src={img}
                                                                            alt={foodName}
                                                                        />
                                                                        <div className={style.dishMeta}>
                                                                            <div className={style.dishName}>
                                                                                {foodName}
                                                                            </div>
                                                                            <div className={style.dishQty}>
                                                                                Số lượng: {qty}
                                                                            </div>
                                                                        </div>
                                                                        <div className={style.dishPrice}>
                                                                            {formatCurrency(subtotal)}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}

                                                            <div className={style.totalsRow}>
                                                                <div className={style.totalLabel}>Tổng</div>
                                                                <div className={style.totalValue}>
                                                                    {formatCurrency(totalPrice)}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className={style.noDetails}>Không có chi tiết đơn.</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />

            <FeedbackModal
                visible={feedbackModalVisible}
                booking={modalBooking}
                order={modalOrder}
                onClose={closeFeedbackModal}
                onSaved={onFeedbackSaved}
            />
        </div>
    );
}

export default BookingHistory;
