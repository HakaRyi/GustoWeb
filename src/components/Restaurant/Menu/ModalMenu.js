import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalMenu.module.scss';
import { customFetch } from '~/config/customFetch';
import ImageUploader from '~/components/Cloundinary/ImageUploader';
import { FaTimes, FaCamera, FaPlus, FaTrash, FaEdit, FaSave, FaBan } from 'react-icons/fa';

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
    const [tasteName, setTasteName] = useState('');
    const [tastes, setTastes] = useState([]);
    const [tasteLoading, setTasteLoading] = useState({ add: false, edit: {}, delete: {} });
    const [isTasteSectionOpen, setIsTasteSectionOpen] = useState(false);
    const [editingTaste, setEditingTaste] = useState(null);
    const [optionalName, setOptionalName] = useState('');
    const [optionalPrice, setOptionalPrice] = useState('');
    const [optionals, setOptionals] = useState([]);
    const [optionalLoading, setOptionalLoading] = useState({ add: false, edit: {}, delete: {} });
    const [isOptionalSectionOpen, setIsOptionalSectionOpen] = useState(false);
    const [editingOptional, setEditingOptional] = useState(null);

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
            fetchTastes();
            fetchOptionals();
        }
    }, [isUpdate, menu]);

    const fetchTastes = async () => {
        if (!isUpdate || !menu?.foodId) return;
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Taste/menu/${menu.foodId}`, {
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

    const fetchOptionals = async () => {
        if (!isUpdate || !menu?.foodId) return;
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Optional/menu/${menu.foodId}`, {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Lấy danh sách tùy chọn thất bại');
            const data = await res.json();
            setOptionals(data);
        } catch (error) {
            console.error('Fetch optionals failed:', error);
            alert('Lấy danh sách tùy chọn thất bại!');
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
        setTasteLoading((prev) => ({ ...prev, add: true }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Taste/${menu.foodId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tasteName }),
            });
            if (!res.ok) throw new Error('Thêm khẩu vị thất bại');
            console.log('Thêm khẩu vị thành công!');
            setTasteName('');
            fetchTastes();
        } catch (error) {
            console.error('Add taste failed:', error);
            alert('Thêm khẩu vị thất bại!');
        } finally {
            setTasteLoading((prev) => ({ ...prev, add: false }));
        }
    };

    const handleOptionalSubmit = async (e) => {
        e.preventDefault();
        if (!isUpdate || !menu?.foodId || !optionalName.trim() || !optionalPrice) return;
        setOptionalLoading((prev) => ({ ...prev, add: true }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Optional/${menu.foodId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: optionalName, price: parseFloat(optionalPrice) }),
            });
            if (!res.ok) throw new Error('Thêm tùy chọn thất bại');
            console.log('Thêm tùy chọn thành công!');
            setOptionalName('');
            setOptionalPrice('');
            fetchOptionals();
        } catch (error) {
            console.error('Add optional failed:', error);
            alert('Thêm tùy chọn thất bại!');
        } finally {
            setOptionalLoading((prev) => ({ ...prev, add: false }));
        }
    };

    const handleEditTaste = (taste) => {
        setEditingTaste({ id: taste.id, name: taste.taste1 });
    };

    const handleEditOptional = (optional) => {
        setEditingOptional({ id: optional.id, name: optional.name, price: optional.price });
    };

    const handleSaveEditTaste = async (tasteId) => {
        if (!editingTaste || !editingTaste.name.trim()) return;
        setTasteLoading((prev) => ({ ...prev, edit: { ...prev.edit, [tasteId]: true } }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Taste/${tasteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingTaste.name }),
            });
            if (!res.ok) throw new Error('Cập nhật khẩu vị thất bại');
            console.log('Cập nhật khẩu vị thành công!');
            setEditingTaste(null);
            fetchTastes();
        } catch (error) {
            console.error('Update taste failed:', error);
            alert('Cập nhật khẩu vị thất bại!');
        } finally {
            setTasteLoading((prev) => ({ ...prev, edit: { ...prev.edit, [tasteId]: false } }));
        }
    };

    const handleSaveEditOptional = async (optionalId) => {
        if (!editingOptional || !editingOptional.name.trim() || !editingOptional.price) return;
        setOptionalLoading((prev) => ({ ...prev, edit: { ...prev.edit, [optionalId]: true } }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Optional/${optionalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editingOptional.name,
                    price: parseFloat(editingOptional.price),
                }),
            });
            if (!res.ok) throw new Error('Cập nhật tùy chọn thất bại');
            console.log('Cập nhật tùy chọn thành công!');
            setEditingOptional(null);
            fetchOptionals();
        } catch (error) {
            console.error('Update optional failed:', error);
            alert('Cập nhật tùy chọn thất bại!');
        } finally {
            setOptionalLoading((prev) => ({ ...prev, edit: { ...prev.edit, [optionalId]: false } }));
        }
    };

    const handleDeleteTaste = async (tasteId) => {
        setTasteLoading((prev) => ({ ...prev, delete: { ...prev.delete, [tasteId]: true } }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Taste/${tasteId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Xóa khẩu vị thất bại');
            const result = await res.json();
            if (result) {
                console.log('Xóa khẩu vị thành công!');
                fetchTastes();
            } else {
                throw new Error('Xóa khẩu vị thất bại');
            }
        } catch (error) {
            console.error('Delete taste failed:', error);
            alert('Xóa khẩu vị thất bại!');
        } finally {
            setTasteLoading((prev) => ({ ...prev, delete: { ...prev.delete, [tasteId]: false } }));
        }
    };

    const handleDeleteOptional = async (optionalId) => {
        setOptionalLoading((prev) => ({ ...prev, delete: { ...prev.delete, [optionalId]: true } }));
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/Optional/${optionalId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Xóa tùy chọn thất bại');
            const result = await res.json();
            if (result) {
                console.log('Xóa tùy chọn thành công!');
                fetchOptionals();
            } else {
                throw new Error('Xóa tùy chọn thất bại');
            }
        } catch (error) {
            console.error('Delete optional failed:', error);
            alert('Xóa tùy chọn thất bại!');
        } finally {
            setOptionalLoading((prev) => ({ ...prev, delete: { ...prev.delete, [optionalId]: false } }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isUpdate
                ? `https://gustoweb.onrender.com/api/RestaurantMenu/updateMenu/${menu.foodId}`
                : 'https://gustoweb.onrender.com/api/RestaurantMenu/createMenu';
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
                                <option value="Cà phê">Cà phê</option>
                                <option value="Đá Xay">Đá Xay</option>
                                <option value="Trà Sữa">Trà Sữa</option>
                                <option value="Trà Trái Cây">Trà Trái Cây</option>
                                <option value="Phở">Phở</option>
                                <option value="Bún Bò">Bún Bò</option>
                                <option value="Cơm">Cơm</option>
                                <option value="Gà">Gà</option>
                                <option value="Bò">Bò</option>
                                <option value="Cháo">Cháo</option>
                                <option value="Bánh Mì">Bánh Mì</option>
                                <option value="Combo">Combo</option>
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
                                                    disabled={tasteLoading.add}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.addTasteBtn}
                                                    onClick={handleTasteSubmit}
                                                    disabled={tasteLoading.add || !tasteName.trim()}
                                                >
                                                    <FaPlus /> {tasteLoading.add ? 'Đang thêm...' : 'Thêm'}
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
                                                        {editingTaste && editingTaste.id === taste.id ? (
                                                            <div className={styles.editTasteWrapper}>
                                                                <input
                                                                    type="text"
                                                                    value={editingTaste.name}
                                                                    onChange={(e) =>
                                                                        setEditingTaste({
                                                                            ...editingTaste,
                                                                            name: e.target.value,
                                                                        })
                                                                    }
                                                                    className={styles.formInput}
                                                                    disabled={tasteLoading.edit[taste.id]}
                                                                />
                                                                <div className={styles.tasteActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.saveTasteBtn}
                                                                        onClick={() => handleSaveEditTaste(taste.id)}
                                                                        disabled={
                                                                            tasteLoading.edit[taste.id] ||
                                                                            !editingTaste.name.trim()
                                                                        }
                                                                    >
                                                                        <FaSave />{' '}
                                                                        {tasteLoading.edit[taste.id]
                                                                            ? 'Đang lưu...'
                                                                            : 'Lưu'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.cancelTasteBtn}
                                                                        onClick={() => setEditingTaste(null)}
                                                                        disabled={tasteLoading.edit[taste.id]}
                                                                    >
                                                                        <FaBan /> Hủy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className={styles.tasteName}>{taste.taste1}</span>
                                                                <div className={styles.tasteActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.editTasteBtn}
                                                                        onClick={() => handleEditTaste(taste)}
                                                                        disabled={tasteLoading.delete[taste.id]}
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.deleteTasteBtn}
                                                                        onClick={() => handleDeleteTaste(taste.id)}
                                                                        disabled={tasteLoading.delete[taste.id]}
                                                                    >
                                                                        <FaTrash />{' '}
                                                                        {tasteLoading.delete[taste.id]
                                                                            ? 'Đang xóa...'
                                                                            : ''}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Phần tùy chọn (chỉ hiển thị khi cập nhật) */}
                    {isUpdate && (
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            {!isOptionalSectionOpen ? (
                                <button
                                    type="button"
                                    className={styles.openOptionalBtn}
                                    onClick={() => setIsOptionalSectionOpen(true)}
                                >
                                    <FaPlus /> Thêm tùy chọn
                                </button>
                            ) : (
                                <div className={styles.optionalSection}>
                                    <button
                                        className={styles.closeOptionalBtn}
                                        onClick={() => setIsOptionalSectionOpen(false)}
                                    >
                                        <FaTimes />
                                    </button>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>
                                            Thêm tùy chọn:
                                            <div className={styles.optionalInputWrapper}>
                                                <input
                                                    type="text"
                                                    value={optionalName}
                                                    onChange={(e) => setOptionalName(e.target.value)}
                                                    placeholder="Nhập tên tùy chọn (VD: Thịt thêm)"
                                                    className={styles.formInput}
                                                    disabled={optionalLoading.add}
                                                />
                                                <input
                                                    type="number"
                                                    value={optionalPrice}
                                                    onChange={(e) => setOptionalPrice(e.target.value)}
                                                    placeholder="Nhập giá (VNĐ)"
                                                    className={styles.formInput}
                                                    min="0"
                                                    disabled={optionalLoading.add}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.addOptionalBtn}
                                                    onClick={handleOptionalSubmit}
                                                    disabled={
                                                        optionalLoading.add || !optionalName.trim() || !optionalPrice
                                                    }
                                                >
                                                    <FaPlus /> {optionalLoading.add ? 'Đang thêm...' : 'Thêm'}
                                                </button>
                                            </div>
                                        </label>
                                    </div>
                                    {optionals.length > 0 && (
                                        <div className={styles.optionalList}>
                                            <h4 className={styles.optionalListTitle}>Danh sách tùy chọn</h4>
                                            <div className={styles.optionalGrid}>
                                                {optionals.map((optional) => (
                                                    <div key={optional.id} className={styles.cardOptional}>
                                                        {editingOptional && editingOptional.id === optional.id ? (
                                                            <div className={styles.editOptionalWrapper}>
                                                                <input
                                                                    type="text"
                                                                    value={editingOptional.name}
                                                                    onChange={(e) =>
                                                                        setEditingOptional({
                                                                            ...editingOptional,
                                                                            name: e.target.value,
                                                                        })
                                                                    }
                                                                    className={styles.formInput}
                                                                    disabled={optionalLoading.edit[optional.id]}
                                                                />
                                                                <input
                                                                    type="number"
                                                                    value={editingOptional.price}
                                                                    onChange={(e) =>
                                                                        setEditingOptional({
                                                                            ...editingOptional,
                                                                            price: e.target.value,
                                                                        })
                                                                    }
                                                                    className={styles.formInput}
                                                                    min="0"
                                                                    disabled={optionalLoading.edit[optional.id]}
                                                                />
                                                                <div className={styles.optionalActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.saveOptionalBtn}
                                                                        onClick={() =>
                                                                            handleSaveEditOptional(optional.id)
                                                                        }
                                                                        disabled={
                                                                            optionalLoading.edit[optional.id] ||
                                                                            !editingOptional.name.trim() ||
                                                                            !editingOptional.price
                                                                        }
                                                                    >
                                                                        <FaSave />{' '}
                                                                        {optionalLoading.edit[optional.id]
                                                                            ? 'Đang lưu...'
                                                                            : 'Lưu'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.cancelOptionalBtn}
                                                                        onClick={() => setEditingOptional(null)}
                                                                        disabled={optionalLoading.edit[optional.id]}
                                                                    >
                                                                        <FaBan /> Hủy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className={styles.optionalName}>
                                                                    {optional.title}
                                                                    <br /> {optional.price} VNĐ
                                                                </span>
                                                                <div className={styles.optionalActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.editOptionalBtn}
                                                                        onClick={() => handleEditOptional(optional)}
                                                                        disabled={optionalLoading.delete[optional.id]}
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.deleteOptionalBtn}
                                                                        onClick={() =>
                                                                            handleDeleteOptional(optional.id)
                                                                        }
                                                                        disabled={optionalLoading.delete[optional.id]}
                                                                    >
                                                                        <FaTrash />{' '}
                                                                        {optionalLoading.delete[optional.id]
                                                                            ? 'Đang xóa...'
                                                                            : ''}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
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
