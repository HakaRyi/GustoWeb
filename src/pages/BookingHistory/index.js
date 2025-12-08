import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './BookingHistory.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareLeft, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { customFetch } from '~/config/customFetch';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import FeedbackModal from '~/components/Modals/FeedbackModal';
import ReviewModal from '~/components/Modals/FoodReviewModal';

function BookingHistory() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [bookings, setBookings] = useState([]);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [modalBooking, setModalBooking] = useState(null);
    const [modalOrder, setModalOrder] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const handleOpenModal = (foodData) => {
        const foodReview = async (foodId) => {
            try {
                setLoadingVisible(true);
                const res = await customFetch(`https://gustoweb.onrender.com/api/FoodReview/ByFood/${foodId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    const foodForModal = {
                        name: foodData.name,
                        reviews: data || [],
                    };
                    console.log('Food reviews:', foodForModal);
                    setSelectedFood(foodForModal);
                    setIsModalOpen(true);
                }
            } catch (error) {
                setResult({ visible: true, success: false, message: 'Không thể tải đánh giá món ăn' });
            } finally {
                setLoadingVisible(false);
            }
        };
        foodReview(foodData.foodId);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFood(null);
    };
    const fetchBooking = async () => {
        try {
            setLoadingVisible(true);
            var res = await customFetch('https://gustoweb.onrender.com/api/DinerProfile/my-bookings', {
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
    useEffect(() => {
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

    const onFeedbackSaved = async () => {
        closeFeedbackModal();
        await fetchBooking();
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <div className={style.title}>Lịch sử đặt hàng</div>
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
                    const bookingStatus = booking.status ?? '';

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
                                        const totalPrice = (order.totalPrice ?? 0) + 3000;
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
                                            bookingStatus === 'booked'
                                                ? 'Booked'
                                                : orderStatus === 'done'
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
                                                            {bookingStatus === 'done'
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
                                                        {bookingStatus === 'booked' ? (
                                                            <div className={style.preparingText}>
                                                                Nhà hàng đang chuẩn bị món ăn...
                                                            </div>
                                                        ) : bookingStatus === 'done' ? (
                                                            <button
                                                                className={style.feedbackActionBtn}
                                                                onClick={() => openFeedbackModal(booking, order)}
                                                            >
                                                                {hasFeedbacked ? 'Cập nhật Feedback' : 'Feedback'}
                                                            </button>
                                                        ) : null}
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
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => handleOpenModal(d.food)}
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
                                                                            {Array.isArray(d.optionals) &&
                                                                                d.optionals.length > 0 && (
                                                                                    <div
                                                                                        className={style.optionalsBlock}
                                                                                    >
                                                                                        <div
                                                                                            className={
                                                                                                style.optionalTitle
                                                                                            }
                                                                                        >
                                                                                            Toppings:
                                                                                        </div>
                                                                                        <ul
                                                                                            className={
                                                                                                style.optionalsList
                                                                                            }
                                                                                        >
                                                                                            {d.optionals.map((op) => (
                                                                                                <li
                                                                                                    key={op.id}
                                                                                                    className={
                                                                                                        style.optionalItem
                                                                                                    }
                                                                                                >
                                                                                                    {op.title}
                                                                                                    {op.price > 0
                                                                                                        ? ` (+${formatCurrency(
                                                                                                              op.price,
                                                                                                          )})`
                                                                                                        : ''}
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                        {Array.isArray(d.tastes) &&
                                                                            d.tastes.length > 0 && (
                                                                                <div className={style.tastesBlock}>
                                                                                    <div className={style.tasteTitle}>
                                                                                        Hương vị:
                                                                                    </div>
                                                                                    <ul className={style.tastesList}>
                                                                                        {d.tastes.map((t) => (
                                                                                            <li
                                                                                                key={t.id}
                                                                                                className={
                                                                                                    style.tasteItem
                                                                                                }
                                                                                            >
                                                                                                {t.taste1}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            )}
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
            <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} foodItem={selectedFood} />
        </div>
    );
}

export default BookingHistory;
