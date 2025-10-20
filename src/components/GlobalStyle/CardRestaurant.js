import React from 'react';

import { useNavigate } from 'react-router-dom';
import styles from '../../styles/CardRestaurant.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CardRestaurant = ({ restaurant, view = 'list' }) => {
    const cardClasses = cx('card', {
        'grid-view': view === 'grid',
    });
    const navigate = useNavigate();

    const createSlug = (name) =>
        name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

    const handleClick = () => {
        const slug = createSlug(restaurant.name);
        navigate(`/restaurants/${slug}`, { state: { id: restaurant.id } });
    };
    return (
        <div className={styles.cardContainer} onClick={handleClick}>
            <div className={cardClasses}>
                {restaurant.isNew && <span className={styles.badge}>NEW</span>}
                <div className={styles.imageBox}>
                    <img src={restaurant.image ?? restaurant.avatarUrl} alt={restaurant.name} />
                </div>
                <div className={styles.info}>
                    <h3 className={styles.name}>{restaurant.name}</h3>

                    <div className={styles.rating}>
                        {'★'.repeat(restaurant.rating)}
                        <span className={styles.grayStar}>{'★'.repeat(5 - restaurant.rating)}</span>
                    </div>

                    <p className={styles.address}>{restaurant.address}</p>

                    <div className={styles.statusRow}>
                        <span
                            className={`${styles.statusDot} ${restaurant.isOpen ? styles.open : styles.closed}`}
                        ></span>
                        <span className={styles.statusText}>{restaurant.isOpen ? 'Đang mở' : 'Đóng cửa'}</span>
                        <span className={styles.time}>🕓 {restaurant.time}</span>
                    </div>

                    <button className={styles.btn}>Order Now!</button>
                </div>
            </div>
        </div>
    );
};

export default CardRestaurant;
