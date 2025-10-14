import React, { useState, useEffect } from 'react';
import { customFetch } from '~/config/customFetch';
import { FaStar } from 'react-icons/fa';
import styles from './ResProfileMenu.module.scss';

function ResProfileMenu({ id }) {
    const [profile, setProfile] = useState(null);

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
                <img src={profile.avatarUrl} alt={profile.fullName} className={styles.profileAvatar} />
                <div className={styles.profileInfo}>
                    <h1 className={styles.profileName}>{profile.fullName}</h1>

                    {/* ⭐ Rating đẹp như trong ProfileResLayout */}
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
                        <button className={styles.likeButton}>❤ Like</button>
                        <button className={styles.preOrderButton}>My Pre-Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResProfileMenu;
