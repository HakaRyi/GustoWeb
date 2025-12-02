import React from 'react';
import { useLocation } from 'react-router-dom';
import ResProfileMenu from '~/components/RestaurantDetail/ResProfileMenu';
import MenuRestaurant from '~/components/RestaurantDetail/MenuRestaurant';
import styles from './RestaurantDetail.module.scss';

function RestaurantDetail() {
    const location = useLocation();
    const { id } = location.state || {};

    if (!id) return <div>Không tìm thấy thông tin nhà hàng.</div>;

    return (
        <div className={styles.restaurantDetailContainer}>
            <ResProfileMenu id={id} />
            <MenuRestaurant id={id} />
        </div>
    );
}

export default RestaurantDetail;
