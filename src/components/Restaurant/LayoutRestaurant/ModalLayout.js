import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Thêm import này
import styles from './ModalLayout.module.scss';
import { customFetch } from '~/config/customFetch';
import ImageUploader from '~/components/Cloundinary/ImageUploader';
import { FaTimes, FaCamera } from 'react-icons/fa';

const ModalLayout = ({ isOpen, onClose, layout, isUpdate, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        layoutUrl: '',
        description: '',
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isUpdate && layout) {
            setFormData({
                name: layout.name || '',
                layoutUrl: layout.layoutImgUrl || '',
                description: layout.description || '',
            });
        }
    }, [isUpdate, layout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const layoutUrl = await ImageUploader(file);
            setFormData((prev) => ({ ...prev, layoutUrl }));
            console.log('Ảnh đã được tải lên!');
        } catch (error) {
            console.error('Upload image failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isUpdate
                ? `https://gustoweb.onrender.com/api/RestaurantLayout/updateLayout/${layout.layoutId}`
                : 'https://gustoweb.onrender.com/api/RestaurantLayout/createLayout';

            const res = await customFetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Thao tác thất bại!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Sử dụng createPortal để render modal vào body
    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FaTimes />
                </button>

                <h3>{isUpdate ? 'Cập nhật bố cục' : 'Tạo bố cục mới'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>
                            Tên bố cục:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Hình ảnh:
                            <div className={styles.imagePreview}>
                                <img
                                    src={
                                        formData.layoutUrl || 'https://cdn-icons-png.flaticon.com/512/1663/1663945.png'
                                    }
                                    alt="Layout preview"
                                    className={styles.previewImage}
                                />
                                <label className={styles.uploadBtn}>
                                    <FaCamera />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={uploading}
                                        hidden
                                    />
                                    {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                                </label>
                            </div>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Mô tả:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </label>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={uploading}>
                        {isUpdate ? 'Cập nhật' : 'Tạo'}
                    </button>
                </form>
            </div>
        </div>,
        document.body, // Render modal vào body
    );
};

export default ModalLayout;
