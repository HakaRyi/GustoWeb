import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../../config/customFetch';
import styles from './ModalChooseOrder.module.scss';

function ModalChooseOrder({ menuId, restaurantId, onClose, showToast, onAddedToCart }) {
    const [foodDetail, setFoodDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedTaste, setSelectedTaste] = useState('');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [animateClose, setAnimateClose] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
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
        if (!isAuthenticated) return navigate('/login');
        if (isAdding) return;
        setIsAdding(true);
        setError(null);

        try {
            if (!restaurantId || !menuId) throw new Error('Thiếu thông tin');

            // Bước 1: Tạo booking (để đảm bảo có booking)
            await customFetch(`https://gustoweb.onrender.com/api/Booking/${restaurantId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            // Bước 2: LUÔN lấy orderId từ API pending — đây là nguồn tin cậy duy nhất!
            const pendingRes = await customFetch(`https://gustoweb.onrender.com/api/Booking/pending/${restaurantId}`);

            if (!pendingRes.ok) {
                const err = await pendingRes.json();
                throw new Error(err.message || 'Không thể lấy giỏ hàng');
            }

            const pendingData = await pendingRes.json();

            // Nếu không có pending → lỗi nghiêm trọng
            if (!pendingData.orderId) {
                throw new Error('Không tìm thấy giỏ hàng đang chờ. Vui lòng thử lại.');
            }

            const orderId = pendingData.orderId; // CHẮC CHẮN đúng, không thể sai

            // Bước 3: Tạo payload
            const payload = {
                foodId: menuId,
                optionalIds: selectedToppings
                    .map((t) => foodDetail.optionals.find((o) => o.title === t)?.id)
                    .filter(Boolean),
                tasteIds: selectedTaste
                    ? [foodDetail.tastes.find((t) => t.taste1 === selectedTaste)?.id].filter(Boolean)
                    : [],
                quantity,
            };

            // Bước 4: Thêm vào giỏ
            const res = await customFetch(`https://gustoweb.onrender.com/orders/${orderId}/${menuId}/details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Thêm món thất bại');
            }

            showToast('Đã thêm vào giỏ hàng!', true);
            onAddedToCart?.();
            handleClose();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
            console.error(err);
        } finally {
            setIsAdding(false);
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
                                Khẩu vị <span>Chọn 1</span>
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
                                Thêm <span>Chọn nhiều</span>
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
                    <button
                        className={styles.addButton}
                        onClick={handleAddOrderDetail}
                        disabled={isAdding} // ← Quan trọng: vô hiệu hóa khi đang thêm
                        style={isAdding ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    >
                        {isAdding ? 'Đang thêm...' : `THÊM - ${totalPrice.toLocaleString()}đ`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalChooseOrder;
