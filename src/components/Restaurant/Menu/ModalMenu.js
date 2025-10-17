import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalMenu.module.scss';
import { customFetch } from '~/config/customFetch';
import ImageUploader from '~/components/Cloundinary/ImageUploader';
import { FaTimes, FaCamera, FaPlus } from 'react-icons/fa';

const ModalMenu = ({ isOpen, onClose, menu, isUpdate, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        oldPrice: 0,
        discountPercent: 0,
        startDiscount: '',
        endDiscount: '',
        isRecommended: false,
        status: true,
        type: 'Đồ ăn',
        foodUrl: '',
        description: '',
    });
    const [uploading, setUploading] = useState(false);
    const [tasteName, setTasteName] = useState(''); // Trạng thái cho input khẩu vị
    const [tastes, setTastes] = useState([]); // Danh sách khẩu vị
    const [tasteLoading, setTasteLoading] = useState(false); // Loading khi thêm khẩu vị
    const [isTasteSectionOpen, setIsTasteSectionOpen] = useState(false); // Trạng thái mở phần khẩu vị

    useEffect(() => {
        if (isUpdate && menu) {
            setFormData({
                name: menu.foodName || '',
                price: menu.price || 0,
                oldPrice: menu.oldPrice || 0,
                discountPercent: menu.discountPercent || 0,
                startDiscount: menu.startDiscount ? menu.startDiscount.split('T')[0] : '',
                endDiscount: menu.endDiscount ? menu.endDiscount.split('T')[0] : '',
                isRecommended: menu.isRecommended || false,
                status: menu.status || true,
                type: menu.type || 'Đồ ăn',
                foodUrl: menu.foodImgUrl || '',
                description: menu.description || '',
            });
            // Gọi API lấy danh sách khẩu vị
            fetchTastes();
        }
    }, [isUpdate, menu]);

    const fetchTastes = async () => {
        if (!isUpdate || !menu?.foodId) return;
        try {
            const res = await customFetch(`https://localhost:7176/api/Taste/menu/${menu.foodId}`, {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Lấy danh sách khẩu vị thất bại');
            const data = await res.json();
            setTastes(data);
        } catch (error) {
            console.error('Fetch tastes failed:', error);
            alert('Lấy danh sách khẩu vị thất bại!');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const foodUrl = await ImageUploader(file);
            setFormData((prev) => ({ ...prev, foodUrl }));
            console.log('Ảnh đã được tải lên!');
        } catch (error) {
            console.error('Upload image failed:', error);
            alert(error.message || 'Tải ảnh lên thất bại!');
        } finally {
            setUploading(false);
        }
    };

    const handleTasteSubmit = async (e) => {
        e.preventDefault();
        if (!isUpdate || !menu?.foodId || !tasteName.trim()) return;
        setTasteLoading(true);
        try {
            const res = await customFetch(`https://localhost:7176/api/Taste/${menu.foodId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tasteName }),
            });
            if (!res.ok) throw new Error('Thêm khẩu vị thất bại');
            console.log('Thêm khẩu vị thành công!');
            setTasteName(''); // Xóa input sau khi thêm
            fetchTastes(); // Làm mới danh sách khẩu vị
        } catch (error) {
            console.error('Add taste failed:', error);
            alert('Thêm khẩu vị thất bại!');
        } finally {
            setTasteLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isUpdate
                ? `https://localhost:7176/api/RestaurantMenu/updateMenu/${menu.foodId}`
                : 'https://localhost:7176/api/RestaurantMenu/createMenu';
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                oldPrice: parseFloat(formData.oldPrice),
                discountPercent: parseFloat(formData.discountPercent),
                startDiscount: formData.startDiscount || null,
                endDiscount: formData.endDiscount || null,
            };
            const res = await customFetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`${isUpdate ? 'Cập nhật' : 'Tạo'} món thất bại`);
            console.log(`${isUpdate ? 'Cập nhật' : 'Tạo'} món thành công!`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(`${isUpdate ? 'Update' : 'Create'} menu failed:`, error);
            alert(`${isUpdate ? 'Cập nhật' : 'Tạo'} món thất bại!`);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className={styles.modalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FaTimes />
                </button>
                <h3>{isUpdate ? 'Cập nhật món ăn' : 'Tạo món ăn mới'}</h3>
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>
                            Loại món:
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className={styles.formInput}
                            >
                                <option value="Đồ ăn">Đồ ăn</option>
                                <option value="Đồ uống">Đồ uống</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Tên món:
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
                            Giá (VNĐ):
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Giá cũ (VNĐ):
                            <input
                                type="number"
                                name="oldPrice"
                                value={formData.oldPrice}
                                onChange={handleChange}
                                min="0"
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            % Giảm giá:
                            <input
                                type="number"
                                name="discountPercent"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Ngày bắt đầu giảm giá:
                            <input
                                type="date"
                                name="startDiscount"
                                value={formData.startDiscount}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Ngày kết thúc giảm giá:
                            <input
                                type="date"
                                name="endDiscount"
                                value={formData.endDiscount}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Đề xuất:
                            <input
                                type="checkbox"
                                name="isRecommended"
                                checked={formData.isRecommended}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Trạng thái (Hoạt động):
                            <input
                                type="checkbox"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>
                            Hình ảnh:
                            <div className={styles.imagePreview}>
                                <img
                                    src={formData.foodUrl || 'https://static.thenounproject.com/png/1092662-200.png'}
                                    alt="Menu preview"
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
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
                    {/* Phần khẩu vị (chỉ hiển thị khi cập nhật) */}
                    {isUpdate && (
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            {!isTasteSectionOpen ? (
                                <button
                                    type="button"
                                    className={styles.openTasteBtn}
                                    onClick={() => setIsTasteSectionOpen(true)}
                                >
                                    <FaPlus /> Thêm khẩu vị
                                </button>
                            ) : (
                                <div className={styles.tasteSection}>
                                    <button
                                        className={styles.closeTasteBtn}
                                        onClick={() => setIsTasteSectionOpen(false)}
                                    >
                                        <FaTimes />
                                    </button>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>
                                            Thêm khẩu vị:
                                            <div className={styles.tasteInputWrapper}>
                                                <input
                                                    type="text"
                                                    value={tasteName}
                                                    onChange={(e) => setTasteName(e.target.value)}
                                                    placeholder="Nhập tên khẩu vị (VD: Cay)"
                                                    className={styles.formInput}
                                                    disabled={tasteLoading}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.addTasteBtn}
                                                    onClick={handleTasteSubmit}
                                                    disabled={tasteLoading || !tasteName.trim()}
                                                >
                                                    <FaPlus /> {tasteLoading ? 'Đang thêm...' : 'Thêm'}
                                                </button>
                                            </div>
                                        </label>
                                    </div>
                                    {tastes.length > 0 && (
                                        <div className={styles.tasteList}>
                                            <h4 className={styles.tasteListTitle}>Danh sách khẩu vị</h4>
                                            <div className={styles.tasteGrid}>
                                                {tastes.map((taste) => (
                                                    <div key={taste.id} className={styles.cardTaste}>
                                                        <span className={styles.tasteName}>{taste.taste1}</span>
                                                        {/* <span className={styles.tasteMenuId}>
                                                            Menu ID: {taste.restaurantMenuId}
                                                        </span> */}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Nút submit luôn ở dưới cùng */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <button
                            type="submit"
                            className={`${styles.submitBtn} ${styles.fullWidth}`}
                            disabled={uploading}
                        >
                            {isUpdate ? 'Cập nhật' : 'Tạo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};

export default ModalMenu;
