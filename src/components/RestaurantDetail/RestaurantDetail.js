import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResProfileMenu from '~/components/RestaurantDetail/ResProfileMenu';
import MenuRestaurant from '~/components/RestaurantDetail/MenuRestaurant';
import ToastNotification from '~/components/RestaurantDetail/ToastNotification';
import styles from './RestaurantDetail.module.scss';

function RestaurantDetail() {
    const location = useLocation();
    const { id } = location.state || {};
    const [toast, setToast] = useState({ show: false, message: '' });
    const [triggerShake, setTriggerShake] = useState(0);

    const handleAddedToCart = () => {
        setTriggerShake((prev) => prev + 1);
    };
    const showToast = (message, highlight = false) => {
        setToast({ show: true, message, highlight });
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // });
    };

    const hideToast = () => {
        setToast({ show: false, message: '' });
    };
    if (!id) return <div>Không tìm thấy thông tin nhà hàng.</div>;

    return (
        <>
            <ToastNotification
                isVisible={toast.show}
                message={toast.message}
                onHide={hideToast}
                highlight={toast.highlight}
            />
            <div className={styles.restaurantDetailContainer}>
                <ResProfileMenu id={id} showToast={showToast} shakeKey={triggerShake} />
                <MenuRestaurant id={id} showToast={showToast} onAddedToCart={handleAddedToCart} />
            </div>
        </>
    );
}

export default RestaurantDetail;
