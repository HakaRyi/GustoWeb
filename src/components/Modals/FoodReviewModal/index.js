// ReviewModal.js
import React from 'react';
import { X, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Star as StarOutline, Star as StarFilled } from 'lucide-react';
import styles from './FoodReviewModal.module.scss';

// Component ReviewItem không cần thay đổi, nó đã hoạt động đúng
const ReviewItem = ({ review }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            stars.push(
                <StarOutline
                    key={i}
                    size={16}
                    className={`${styles.star} ${isFilled ? styles.filled : ''}`}
                    fill={isFilled ? 'currentColor' : 'none'}
                    stroke="currentColor"
                />,
            );
        }
        return stars;
    };
    const avatarUrl = 'https://i.pravatar.cc/150?u=' + review.dinerId;
    return (
        <div className={styles.reviewItem}>
            <img src={avatarUrl} alt={review.dinerName} className={styles.reviewAvatar} />
            <div className={styles.reviewContent}>
                <div className={styles.reviewHeader}>
                    <span className={styles.reviewAuthor}>{review.dinerName}</span>
                    <span className={styles.reviewTime}>{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.reviewRating}>{renderStars(review.rating)}</div>
                <p className={styles.reviewText}>{review.description}</p>
                {review.imageUrl && <img src={review.imageUrl} alt="Review media" className={styles.reviewMedia} />}
                <div className={styles.reviewActions}>
                    <button className={styles.actionBtn}>
                        <ThumbsUp size={16} />
                        <span>0</span>
                    </button>
                    <button className={styles.actionBtn}>
                        <ThumbsDown size={16} />
                        <span>0</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component chính
const ReviewModal = ({ isOpen, onClose, foodItem }) => {
    if (!isOpen || !foodItem) {
        return null;
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Đánh giá: {foodItem.name}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        Thoát
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.filterSection}>
                        <label htmlFor="filter">Lọc</label>
                        <select id="filter" className={styles.reviewFilter}>
                            <option value="latest">Gần nhất</option>
                            <option value="highest">Đánh giá cao</option>
                            <option value="lowest">Đánh giá thấp</option>
                        </select>
                    </div>

                    <div className={styles.reviewsList}>
                        {foodItem.reviews && foodItem.reviews.length > 0 ? (
                            foodItem.reviews.map((review) => (
                                <ReviewItem key={review.reviewId || review.id} review={review} />
                            ))
                        ) : (
                            <div className={styles.noReviewsMessage}>
                                <p>Chưa có đánh giá nào cho món ăn này.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
