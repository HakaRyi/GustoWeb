import React, { useState } from 'react';
import styles from './CardLayout.module.scss';
import { customFetch } from '~/config/customFetch';
import ModalLayout from './ModalLayout';
import { FaEllipsisV } from 'react-icons/fa';

const CardLayout = ({ layout, onDeleteSuccess, onSuccess }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa bố cục này?')) return;
        try {
            const res = await customFetch(
                `https://gustoweb.onrender.com/api/RestaurantLayout/deleteLayout/${layout.layoutId}`,
                { method: 'DELETE' },
            );
            if (!res.ok) throw new Error('Xóa bố cục thất bại');
            onDeleteSuccess(layout.layoutId);
            console.log('Xóa bố cục thành công!');
        } catch (error) {
            console.error('Delete layout failed:', error);
            console.log('Xóa bố cục thất bại!');
        }
    };

    return (
        <div className={styles.cardLayout}>
            <img
                src={layout.layoutImgUrl || 'https://cdn-icons-png.flaticon.com/512/272/272415.png'}
                alt={layout.name}
                className={styles.layoutImage}
            />
            <div className={styles.layoutInfo}>
                <h4>{layout.name || 'Chưa có tên'}</h4>
                <p>{layout.description || 'Chưa có mô tả'}</p>
            </div>
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
            {isModalOpen && (
                <ModalLayout
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    layout={layout}
                    isUpdate
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
};

export default CardLayout;
