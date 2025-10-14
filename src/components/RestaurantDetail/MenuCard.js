import React from 'react';
import styles from './MenuCard.module.scss';

function MenuCard({ item }) {
    return (
        <div className={styles.menuCard}>
            <img src={item.foodUrl} alt={item.name} className={styles.menuImage} />
            <div className={styles.menuInfo}>
                <div className={styles.textGroup}>
                    <h4 className={styles.menuName}>{item.name}</h4>
                    <p className={styles.menuPrice}>{item.price.toLocaleString()} VND</p>
                </div>
                <button className={styles.viewReviewsButton}>View Reviews</button>
            </div>
        </div>
    );
}

export default MenuCard;
