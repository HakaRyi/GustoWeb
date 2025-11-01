import React, { useState } from 'react';
import styles from './CardTable.module.scss';
import { customFetch } from '~/config/customFetch';
import ModalTable from './ModalTable';
import { FaEllipsisV } from 'react-icons/fa';

const CardTable = ({ table, onDeleteSuccess, onSuccess }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa bàn này?')) return;
        try {
            const res = await customFetch(
                `https://gustoweb.onrender.com/api/RestaurantTable/deleteTable/${table.tableId}`,
                { method: 'DELETE' },
            );
            if (!res.ok) throw new Error('Xóa bàn thất bại');
            onDeleteSuccess(table.tableId);
            console.log('Xóa bàn thành công!');
        } catch (error) {
            console.error('Delete table failed:', error);
            console.log('Xóa bàn thất bại!');
        }
    };

    return (
        <div className={styles.cardTable}>
            <div className={styles.tableInfo}>
                <h4>{table.name || 'Chưa có tên'}</h4>
                <p>Số người: {table.personNumber}</p>
                <p>Vị trí: {table.position || 'Chưa có vị trí'}</p>
                <p>Mô tả: {table.description || 'Chưa có mô tả'}</p>
                <p>Trạng thái: {table.status}</p>
                <p>{table.isVip ? 'VIP' : 'Không VIP'}</p>
                <p>Phí tối thiểu: {table.minCharge ? table.minCharge.toLocaleString() : 'Không có'} VNĐ</p>
                <p>Tiền cọc: {table.deposit.toLocaleString()} VNĐ</p>
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
                <ModalTable
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    table={table}
                    isUpdate
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
};

export default CardTable;
