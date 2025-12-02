import React from 'react';
import { IoClose } from 'react-icons/io5';
import { customFetch } from '~/config/customFetch';
import styles from './CardItem.module.scss';

function CardItem({ item, onUpdateQuantity, onRemoveItem }) {
    const handleUpdateQuantity = async (newQty) => {
        if (newQty < 1) return;

        console.log(`DEBUG - Updating quantity for item ${item.id}:`);
        console.log(`  Current quantity: ${item.quantity}`);
        console.log(`  New quantity: ${newQty}`);
        console.log(`  Item price: ${item.price}`);
        console.log(`  Current total: ${item.price * item.quantity}`);
        console.log(`  New total: ${item.price * newQty}`);

        try {
            // ✅ Cập nhật UI ngay lập tức trước khi gọi API
            onUpdateQuantity(item.id, newQty, true); // true = isOptimistic

            // ✅ Gọi API để cập nhật server
            const response = await customFetch(
                `https://gustoweb.onrender.com/api/OrderDetail/updateQuantity/${item.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: newQty }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật số lượng.');
            }

            console.log('DEBUG - API call successful');
            // ✅ Nếu update thành công, xác nhận lại với UI (trong trường hợp có conflict)
            onUpdateQuantity(item.id, newQty, false); // false = not optimistic
        } catch (err) {
            console.error('Error updating quantity:', err);
            alert('Cập nhật số lượng thất bại!');

            // ✅ Rollback về số lượng cũ nếu API fail
            onUpdateQuantity(item.id, item.quantity, false);
        }
    };

    const extras = [item.taste ? item.taste : null, ...(item.optionals?.length > 0 ? item.optionals : [])]
        .filter(Boolean)
        .join(', ');

    return (
        <div className={styles.card}>
            <img
                src={item.image || process.env.PUBLIC_URL + '/LOGOGUSTO2.png'}
                alt={item.name}
                className={styles.image}
            />

            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <h4 className={styles.name}>{item.name}</h4>
                    {/* ✅ FIXED: Hiển thị tổng giá của món này (price * quantity) */}
                    <span className={styles.price}>{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>

                {extras && <p className={styles.extras}>{extras}</p>}

                <div className={styles.actions}>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        −
                    </button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => handleUpdateQuantity(item.quantity + 1)}>
                        +
                    </button>
                </div>
            </div>

            <button className={styles.removeBtn} onClick={() => onRemoveItem(item.id)}>
                <IoClose size={24} />
            </button>
        </div>
    );
}

export default CardItem;
