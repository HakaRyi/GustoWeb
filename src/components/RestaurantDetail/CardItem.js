import React from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './CardItem.module.scss';

function CardItem({ item, onUpdateQuantity, onRemoveItem }) {
    return (
        <div className={styles.card}>
            <img src={item.image} alt={item.name} className={styles.image} />

            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <h4 className={styles.name}>{item.name}</h4>
                    <span className={styles.price}>{item.price.toLocaleString()}đ</span>
                </div>
                <p className={styles.optional}>{item.taste}</p>

                <div className={styles.actions}>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        −
                    </button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
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
