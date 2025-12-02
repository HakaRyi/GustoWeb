import React, { useEffect, useState } from 'react';
import styles from './ProfileResLayout.module.scss';
import { customFetch } from '~/config/customFetch';
import ImageUploader from '../Cloundinary/ImageUploader';
import { FaEdit, FaSave, FaTimes, FaCamera, FaStar, FaHeart } from 'react-icons/fa';

const ProfileRestaurantLayout = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // State cho danh sách người thích
    const [likers, setLikers] = useState([]);
    const [showLikersModal, setShowLikersModal] = useState(false);
    const [loadingLikers, setLoadingLikers] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await customFetch('https://gustoweb.onrender.com/api/RestaurantProfile/getByMyRestaurant');
                if (!res.ok) throw new Error('Lỗi khi lấy hồ sơ nhà hàng');

                const data = await res.json();
                if (data?.openAt) data.openAt = data.openAt.substring(0, 5);
                if (data?.closeAt) data.closeAt = data.closeAt.substring(0, 5);

                setProfile(data);
                setFormData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Fetch danh sách người đã thích
    const fetchLikers = async () => {
        if (likers.length > 0) {
            setShowLikersModal(true);
            return;
        }

        setLoadingLikers(true);
        try {
            const res = await customFetch('https://gustoweb.onrender.com/api/Favourite/GetAccountsLikeRes');
            if (!res.ok) throw new Error('Không thể lấy danh sách người thích');

            const data = await res.json();
            // Loại bỏ trùng lặp theo accountId
            const uniqueDiners = Array.from(new Map(data.map((item) => [item.diner.accountId, item.diner])).values());
            setLikers(uniqueDiners);
            setShowLikersModal(true);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách người thích:', err);
            alert('Không thể tải danh sách người thích');
        } finally {
            setLoadingLikers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > 250) {
            alert('Mô tả không được vượt quá 250 ký tự!');
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const avatarUrl = await ImageUploader(file);
            setFormData((prev) => ({ ...prev, avatarUrl }));
        } catch (error) {
            console.error('Upload avatar failed:', error);
            alert('Tải ảnh lên thất bại!');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!profile?.accountId) return alert('Không tìm thấy ID nhà hàng!');

        const fixedFormData = {
            ...formData,
            openAt: formData.openAt ? `${formData.openAt}:00` : null,
            closeAt: formData.closeAt ? `${formData.closeAt}:00` : null,
        };

        try {
            const res = await customFetch(
                `https://gustoweb.onrender.com/api/RestaurantProfile/updateProfile/${profile.accountId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fixedFormData),
                },
            );
            if (!res.ok) throw new Error('Lỗi cập nhật: ' + res.status);
            setProfile(formData);
            setEditing(false);
            alert('Cập nhật thành công!');
        } catch (error) {
            console.error(error);
            alert('Cập nhật thất bại!');
        }
    };

    if (loading) return <div className={styles.loading}>Đang tải thông tin...</div>;

    return (
        <>
            <div className={styles.restaurantProfileContainer}>
                {/* Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={
                                formData.avatarUrl ||
                                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg'
                            }
                            alt={formData.fullName}
                            className={styles.avatar}
                        />
                        {editing && (
                            <label className={styles.avatarUploadBtn}>
                                <FaCamera className={styles.btnIcon} />
                                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                                {uploading ? 'Đang tải...' : 'Thay ảnh'}
                            </label>
                        )}
                    </div>

                    <div className={styles.headerInfo}>
                        <h2>{formData.fullName || 'Nhà hàng của tôi'}</h2>
                        <p>{formData.address || 'Chưa có địa chỉ'}</p>
                        <p className={styles.description}>{formData.description || ''}</p>

                        {/* Rating */}
                        <div className={styles.rating}>
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`${styles.starIcon} ${
                                        i < Math.round(formData.rating || 0) ? styles.filledStar : styles.emptyStar
                                    }`}
                                />
                            ))}
                            <span className={styles.ratingText}>{formData.rating?.toFixed(1) || 0}</span>
                        </div>

                        {/* Nút xem người đã thích */}
                        <button onClick={fetchLikers} className={styles.likersBtn} disabled={loadingLikers}>
                            <FaHeart className={styles.heartIcon} />
                            <span>
                                {loadingLikers
                                    ? 'Đang tải...'
                                    : likers.length > 0
                                    ? `${likers.length} người đã thích`
                                    : 'Xem người đã thích'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className={styles.profileActions}>
                    {!editing ? (
                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => setEditing(true)}>
                            <FaEdit className={styles.btnIcon} /> Chỉnh sửa
                        </button>
                    ) : (
                        <>
                            <button
                                className={`${styles.actionBtn} ${styles.saveBtn}`}
                                onClick={handleSave}
                                disabled={uploading}
                            >
                                <FaSave className={styles.btnIcon} /> Lưu
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                onClick={() => {
                                    setFormData(profile);
                                    setEditing(false);
                                }}
                            >
                                <FaTimes className={styles.btnIcon} /> Hủy
                            </button>
                        </>
                    )}
                </div>

                {/* Form chỉnh sửa thông tin */}
                <div className={styles.profileForm}>
                    {/* Tên + Địa chỉ */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Tên nhà hàng</span>
                            <input
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Địa chỉ</span>
                            <input
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    {/* Mô tả */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Mô tả</span>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                maxLength={250}
                                className={styles.formInput}
                                style={{ height: '100px', resize: 'vertical' }}
                            />
                            {editing && (
                                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
                                    {formData.description?.length || 0}/250 ký tự
                                </p>
                            )}
                        </label>
                    </div>

                    {/* Số điện thoại & Email */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Số điện thoại</span>
                            <input
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Email</span>
                            <input
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    {/* Facebook & TikTok */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Facebook URL</span>
                            <input
                                name="facebookUrl"
                                value={formData.facebookUrl || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>TikTok URL</span>
                            <input
                                name="tiktokUrl"
                                value={formData.tiktokUrl || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    {/* Giờ mở/đóng cửa */}
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Giờ mở cửa</span>
                            <input
                                type="time"
                                name="openAt"
                                value={formData.openAt || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Giờ đóng cửa</span>
                            <input
                                type="time"
                                name="closeAt"
                                value={formData.closeAt || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            <span className={styles.labelText}>Thời gian ngồi cho phép (phút)</span>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Modal hiển thị người đã thích */}
            {showLikersModal && (
                <div className={styles.likersOverlay} onClick={() => setShowLikersModal(false)}>
                    <div className={styles.likersModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.likersHeader}>
                            <h3>Người đã thích nhà hàng</h3>
                            <button onClick={() => setShowLikersModal(false)} className={styles.closeModalBtn}>
                                ×
                            </button>
                        </div>
                        <div className={styles.likersList}>
                            {likers.length > 0 ? (
                                likers.map((diner) => (
                                    <div key={diner.accountId} className={styles.likerItem}>
                                        <img
                                            src={
                                                diner.avatarUrl ||
                                                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg'
                                            }
                                            alt={diner.fullName}
                                            className={styles.likerAvatar}
                                        />
                                        <span className={styles.likerName}>{diner.fullName || 'Khách vãng lai'}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#888', padding: '30px 20px', margin: 0 }}>
                                    Chưa có ai thích nhà hàng này
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileRestaurantLayout;
