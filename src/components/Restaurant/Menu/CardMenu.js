import React, { useState } from 'react';
import styles from './CardMenu.module.scss';
import { customFetch } from '~/config/customFetch';
import ModalMenu from './ModalMenu';
import { FaEllipsisV } from 'react-icons/fa';

const CardMenu = ({ menu, onDeleteSuccess, onSuccess }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa món này?')) return;
        try {
            const res = await customFetch(
                `https://gustoweb.onrender.com/api/RestaurantMenu/deleteMenu/${menu.foodId}`,
                {
                    method: 'DELETE',
                },
            );
            if (!res.ok) throw new Error('Xóa món thất bại');
            onDeleteSuccess(menu.foodId);
            console.log('Xóa món thành công!');
        } catch (error) {
            console.error('Delete menu failed:', error);
            console.log('Xóa món thất bại!');
        }
    };

    return (
        <div className={styles.cardMenu}>
            <div className={styles.menu}>
                <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FaEllipsisV />
                </button>
                {isMenuOpen && (
                    <div className={styles.menuDropdown}>
                        <button onClick={() => setIsModalOpen(true)}>Cập nhật</button>
                        <button onClick={handleDelete}>Xóa</button>
                    </div>
                )}
            </div>

            <img
                src={menu.foodImgUrl || 'https://via.placeholder.com/300x200'}
                alt={menu.foodName}
                className={styles.menuImage}
            />
            <div className={styles.menuInfo}>
                <h4>{menu.foodName || 'Chưa có tên'}</h4>
                <p>Giá: {menu.price.toLocaleString()} VNĐ</p>
                {menu.discountPercent > 0 && (
                    <p>
                        Giảm giá: {menu.discountPercent}% (Giá cũ: {menu.oldPrice.toLocaleString()} VNĐ)
                    </p>
                )}
                <p>Loại: {menu.type}</p>
                <p>{menu.description || 'Chưa có mô tả'}</p>
                <p>{menu.isRecommended ? 'Đề xuất' : 'Không đề xuất'}</p>
                <p>Trạng thái: {menu.status ? 'Hoạt động' : 'Ngừng bán'}</p>
            </div>

            {isModalOpen && (
                <ModalMenu
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    menu={menu}
                    isUpdate
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
};

export default CardMenu;
