import React, { useState } from 'react';
import styles from './MenuCard.module.scss';
import ModalChooseOrder from '../RestaurantDetail/ModalChooseOrder';
import ReviewModal from '../Modals/FoodReviewModal';
import { customFetch } from '~/config/customFetch';

function MenuCard({ item, restaurantId }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [food, setSelectedFood] = useState(null);

    const handleOpenReviewModal = async (foodData) => {
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/FoodReview/ByFood/${foodData.foodId}`, {
                method: 'GET',
            });
            if (res.ok) {
                const reviews = await res.json();
                const foodWithReviews = {
                    name: foodData.name,
                    reviews: reviews || [],
                };
                setSelectedFood(foodWithReviews);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching food reviews:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFood(null);
    };

    const openModal = () => setSelectedItem(item);
    const closeModal = () => setSelectedItem(null);

    return (
        <>
            <div className={styles.menuCard} onClick={openModal}>
                {item.isRecommended && <span className={styles.recommendedBadge}>Đề xuất</span>}
                <img src={item.foodUrl} alt={item.name} className={styles.menuImage} />
                <div className={styles.menuInfo}>
                    <div className={styles.textGroup}>
                        <h4 className={styles.menuName}>{item.name}</h4>
                        <p className={styles.menuPrice}>{item.price.toLocaleString()} VND</p>
                    </div>
                    <button
                        className={styles.viewReviewsButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal(item);
                        }}
                    >
                        View Reviews
                    </button>
                </div>
            </div>

            {selectedItem && (
                <ModalChooseOrder menuId={selectedItem.foodId} restaurantId={restaurantId} onClose={closeModal} />
            )}
            <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} foodItem={food} />
        </>
    );
}

export default MenuCard;
