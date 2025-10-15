import React, { useState } from 'react';
import styles from './MenuCard.module.scss';
import ModalChooseOrder from '../RestaurantDetail/ModalChooseOrder';

function MenuCard({ item, restaurantId }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = () => setSelectedItem(item);
    const closeModal = () => setSelectedItem(null);

    return (
        <>
            <div className={styles.menuCard} onClick={openModal}>
                <img src={item.foodUrl} alt={item.name} className={styles.menuImage} />
                <div className={styles.menuInfo}>
                    <div className={styles.textGroup}>
                        <h4 className={styles.menuName}>{item.name}</h4>
                        <p className={styles.menuPrice}>{item.price.toLocaleString()} VND</p>
                    </div>
                    <button className={styles.viewReviewsButton}>View Reviews</button>
                </div>
            </div>

            {selectedItem && (
                <ModalChooseOrder menuId={selectedItem.foodId} restaurantId={restaurantId} onClose={closeModal} />
            )}
        </>
    );
}

export default MenuCard;
