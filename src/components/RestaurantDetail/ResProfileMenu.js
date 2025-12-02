import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '~/config/customFetch';
import { FaStar, FaMapMarkedAlt, FaChevronDown, FaChevronUp, FaHeart } from 'react-icons/fa';
import DirectionMap from '../Maps/DirectionMap';
import styles from './ResProfileMenu.module.scss';
import ModalMyPreOrder from '~/components/RestaurantDetail/modalMyPreOrder';
const logo = process.env.PUBLIC_URL + '/LOGOGUSTO2.png';

const MAP_BG_IMAGE = 'https://media.wired.com/photos/59269cd37034dc5f91dec26e/master/pass/GoogleMapTA.jpg';

function ResProfileMenu({ id }) {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
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
    const [showMap, setShowMap] = useState(false);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleUpdateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setOrders(orders.map((o) => (o.id === id ? { ...o, quantity: newQty } : o)));
    };

    const handleRemoveItem = (id) => {
        setOrders(orders.filter((o) => o.id !== id));
    };

    const handleLikeClick = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            if (!isLiked) {
                // LIKE
                const response = await customFetch('https://gustoweb.onrender.com/api/Favourite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ restaurantId: id }),
                });

                if (response.ok) {
                    setIsLiked(true);
                }
            } else {
                // UNLIKE
                const response = await customFetch(`https://gustoweb.onrender.com/api/Favourite/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsLiked(false);
                }
            }
        } catch (err) {
            console.log('Like error:', err);
        }
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
            const response = await customFetch(`https://gustoweb.onrender.com/api/RestaurantProfile/getById/${id}`);
            const data = await response.json();
            setProfile(data);
        };
        const fetchIsLiked = async () => {
            try {
                const response = await customFetch(`https://gustoweb.onrender.com/api/Favourite/isLiked/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setIsLiked(data.result);
            } catch (err) {
                console.log('Error checking liked:', err);
            }
        };
        fetchProfile();
        fetchIsLiked();
    }, [id]);

    if (!profile) return <div>Loading...</div>;

    return (
        <>
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
                                <FaHeart className={`${styles.heartIcon} ${isLiked ? styles.liked : ''}`} />
                                <span className={styles.likeText}>{isLiked ? 'Đã thích' : 'Thích'}</span>
                            </button>
                            <button className={styles.preOrderButton} onClick={handlePreOrderClick}>
                                Xem đơn hàng của bạn
                            </button>
                        </div>
                        <ModalMyPreOrder
                            restaurantId={id}
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            orders={orders}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.mapButtonWrapper} onClick={() => setShowMap(!showMap)}>
                <div className={styles.mapBackground} style={{ backgroundImage: `url('${MAP_BG_IMAGE}')` }}></div>
                <div className={styles.mapOverlay}></div>
                <div className={styles.mapContent}>
                    <FaMapMarkedAlt size={24} />
                    <span>{showMap ? 'Ẩn bản đồ' : 'Chỉ đường đến đây'}</span>
                    {showMap ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            {showMap && (
                <div className={styles.mapContainer}>
                    <DirectionMap restaurantAddress={profile.address} />
                </div>
            )}
        </>
    );
}

export default ResProfileMenu;
