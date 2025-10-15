import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '~/config/customFetch';
import { FaStar } from 'react-icons/fa';
import styles from './ResProfileMenu.module.scss';
import ModalMyPreOrder from '~/components/RestaurantDetail/modalMyPreOrder';
const logo = process.env.PUBLIC_URL + '/LOGOGUSTO2.png';

function ResProfileMenu({ id }) {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [orders, setOrders] = useState([
        {
            id: 1,
            name: 'Combo sườn cây đặc biệt',
            taste: 'Không cay',
            price: 35000,
            quantity: 1,
            image: 'https://mms.img.susercontent.com/vn-11134513-7r98o-ltvugbcq37d93f@resize_ss1242x600!@crop_w1242_h600_cT',
        },
        {
            id: 2,
            name: 'Thumbs up',
            taste: '',
            price: 10000,
            quantity: 2,
            image: 'https://cdn.tgdd.vn/Products/Images//3226/307599/bhx/files/-8100-1686888701_860x0.jpg',
        },
    ]);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleUpdateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setOrders(orders.map((o) => (o.id === id ? { ...o, quantity: newQty } : o)));
    };

    const handleRemoveItem = (id) => {
        setOrders(orders.filter((o) => o.id !== id));
    };

    const handleLikeClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Logic cho hành động "Like" sẽ được thêm sau
        console.log('Like button clicked');
    };

    const handlePreOrderClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await customFetch(`https://localhost:7176/api/RestaurantProfile/getById/${id}`);
            const data = await response.json();
            setProfile(data);
        };
        fetchProfile();
    }, [id]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div className={styles.resProfileMenu}>
            <div className={styles.profileHeader}>
                <img src={profile.avatarUrl || logo} alt={profile.fullName} className={styles.profileAvatar} />
                <div className={styles.profileInfo}>
                    <h1 className={styles.profileName}>{profile.fullName}</h1>

                    <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`${styles.starIcon} ${
                                    i < Math.round(profile.rating || 0) ? styles.filledStar : styles.emptyStar
                                }`}
                            />
                        ))}
                        <span className={styles.ratingText}>{profile.rating?.toFixed(1) || 0}</span>
                    </div>

                    <p className={styles.profileAddress}>{profile.address}</p>
                    <p className={styles.profileDescription}>{profile.description}</p>

                    <div className={styles.profileActions}>
                        <button className={styles.likeButton} onClick={handleLikeClick}>
                            ❤ Like
                        </button>
                        <button className={styles.preOrderButton} onClick={handlePreOrderClick}>
                            My Pre-Order
                        </button>
                    </div>
                    <ModalMyPreOrder
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        orders={orders}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>
            </div>
        </div>
    );
}

export default ResProfileMenu;
