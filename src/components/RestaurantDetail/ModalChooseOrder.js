import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../../config/customFetch';
import styles from './ModalChooseOrder.module.scss';

function ModalChooseOrder({ menuId, restaurantId, onClose }) {
    const [foodDetail, setFoodDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedTaste, setSelectedTaste] = useState('');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [animateClose, setAnimateClose] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Gọi API lấy chi tiết món
    useEffect(() => {
        const fetchFoodDetail = async () => {
            try {
                if (!menuId) throw new Error('Menu ID is missing');
                const res = await customFetch(`https://gustoweb.onrender.com/api/RestaurantMenu/getDetail/${menuId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Fetch failed');
                }
                const data = await res.json();
                setFoodDetail(data);
                if (data.tastes?.length > 0) setSelectedTaste(data.tastes[0].taste1);
            } catch (err) {
                console.error('Error fetching food detail:', err);
                setError('Không thể tải thông tin món ăn.');
            } finally {
                setLoading(false);
            }
        };
        fetchFoodDetail();
    }, [menuId]);

    // Xử lý chọn topping
    const handleToppingToggle = (toppingTitle) => {
        setSelectedToppings((prev) =>
            prev.includes(toppingTitle) ? prev.filter((t) => t !== toppingTitle) : [...prev, toppingTitle],
        );
    };

    // Tính tổng giá
    const totalPrice = foodDetail
        ? (foodDetail.price +
              selectedToppings.reduce((sum, t) => {
                  const topping = foodDetail.optionals.find((o) => o.title === t);
                  return topping ? sum + topping.price : sum;
              }, 0)) *
          quantity
        : 0;

    // Xử lý đóng modal
    const handleClose = () => {
        setAnimateClose(true);
        setTimeout(onClose, 300);
    };

    // Xử lý click overlay
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    // Xử lý thêm Booking và OrderDetail
    const handleAddOrderDetail = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            // Kiểm tra restaurantId
            if (!restaurantId) {
                throw new Error('Vui lòng chọn nhà hàng');
            }

            // let payload = { restaurantId: restaurantId, bookingDate : };

            // Bước 1: Gọi API tạo Booking
            const bookingRes = await customFetch(`https://gustoweb.onrender.com/api/Booking/${restaurantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let bookingData;
            if (!bookingRes.ok) {
                bookingData = await bookingRes.json();
                throw new Error(bookingData.message || `Failed to create booking (status: ${bookingRes.status})`);
            }

            bookingData = await bookingRes.json();
            console.log('Booking response:', bookingData);

            let orderId;

            // Bước 2: Xử lý response từ API Booking
            if (bookingData.result === -1) {
                // Booking đã tồn tại
                if (!bookingData.orderId) {
                    // Nếu không có orderId, gọi API pending
                    const pendingRes = await customFetch(
                        `https://gustoweb.onrender.com/api/Booking/pending/${restaurantId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (!pendingRes.ok) {
                        const errorData = await pendingRes.json();
                        throw new Error(
                            errorData.message || `Failed to fetch pending booking (status: ${pendingRes.status})`,
                        );
                    }

                    const pendingData = await pendingRes.json();
                    console.log('Pending booking response:', pendingData);
                    if (!pendingData || !pendingData.orderId) {
                        throw new Error('No pending booking found');
                    }
                    orderId = pendingData.orderId;
                } else {
                    orderId = bookingData.orderId;
                }
            } else if (bookingData.result === 1) {
                // Booking mới được tạo
                if (!bookingData.orderId) {
                    // Nếu không có orderId, gọi API pending
                    const pendingRes = await customFetch(
                        `https://gustoweb.onrender.com/api/Booking/pending/${restaurantId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (!pendingRes.ok) {
                        const errorData = await pendingRes.json();
                        throw new Error(
                            errorData.message || `Failed to fetch pending booking (status: ${pendingRes.status})`,
                        );
                    }

                    const pendingData = await pendingRes.json();
                    console.log('Pending booking response:', pendingData);
                    if (!pendingData || !pendingData.orderId) {
                        throw new Error('No pending booking found after creation');
                    }
                    orderId = pendingData.orderId;
                } else {
                    orderId = bookingData.orderId;
                }
            } else {
                throw new Error(`Unexpected booking response: ${JSON.stringify(bookingData)}`);
            }

            // Bước 3: Tạo payload cho OrderDetail
            const payload = {
                foodId: menuId,
                optionalIds: selectedToppings
                    .map((title) => foodDetail.optionals.find((o) => o.title === title)?.id)
                    .filter((id) => id !== undefined),
                tasteIds: selectedTaste
                    ? [foodDetail.tastes.find((t) => t.taste1 === selectedTaste)?.id].filter((id) => id !== undefined)
                    : [],
                quantity: quantity,
            };
            console.log('OrderDetail payload:', payload); // Debug payload

            // Bước 4: Gọi API tạo OrderDetail
            const orderDetailRes = await customFetch(
                `https://gustoweb.onrender.com/orders/${orderId}/${menuId}/details`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!orderDetailRes.ok) {
                const errorData = await orderDetailRes.json();
                throw new Error(
                    errorData.message || `Failed to create order detail (status: ${orderDetailRes.status})`,
                );
            }

            // Đóng modal sau khi thành công
            handleClose();
        } catch (err) {
            console.error('Error processing order:', err);
            setError(err.message || 'Không thể thêm món vào đơn hàng. Vui lòng thử lại.');
        }
    };

    // Hiển thị khi đang tải
    if (loading) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <p className={styles.load}>Đang tải...</p>
                </div>
            </div>
        );
    }

    // Hiển thị khi không có dữ liệu
    if (!foodDetail) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <p>Không tìm thấy thông tin món ăn.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={`${styles.modal} ${animateClose ? styles.slideOut : styles.slideIn}`}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ✕
                </button>

                {/* Hiển thị lỗi nếu có */}
                {error && <p className={styles.error}>{error}</p>}

                {/* Header */}
                <div className={styles.heada}>
                    <img src={foodDetail.foodUrl} alt={foodDetail.name} className={styles.image} />
                    <div className={styles.info}>
                        <h3>{foodDetail.name}</h3>
                        <p>{foodDetail.price.toLocaleString()}đ</p>
                    </div>
                </div>

                {/* Content scroll */}
                <div className={styles.contentScroll}>
                    {/* Khẩu vị */}
                    {foodDetail.tastes?.length > 0 && (
                        <div className={styles.section}>
                            <h4>
                                Khẩu vị <span>Pick 1</span>
                            </h4>
                            <div className={styles.options}>
                                {foodDetail.tastes.map((taste) => (
                                    <label key={taste.id} className={styles.option}>
                                        <input
                                            type="radio"
                                            name="taste"
                                            value={taste.taste1}
                                            checked={selectedTaste === taste.taste1}
                                            onChange={() => setSelectedTaste(taste.taste1)}
                                        />
                                        <span>{taste.taste1}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Toppings */}
                    {foodDetail.optionals?.length > 0 && (
                        <div className={styles.section}>
                            <h4>
                                Thêm <span>Optional</span>
                            </h4>
                            <div className={styles.options}>
                                {foodDetail.optionals.map((topping) => (
                                    <label key={topping.id} className={styles.option}>
                                        <input
                                            type="checkbox"
                                            checked={selectedToppings.includes(topping.title)}
                                            onChange={() => handleToppingToggle(topping.title)}
                                        />
                                        <span>{topping.title}</span>
                                        <span className={styles.price}>+ {topping.price.toLocaleString()}đ</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.foota}>
                    <div className={styles.quantity}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button className={styles.addButton} onClick={handleAddOrderDetail}>
                        THÊM - {totalPrice.toLocaleString()}đ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalChooseOrder;
