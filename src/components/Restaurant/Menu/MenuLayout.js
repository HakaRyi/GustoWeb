import React, { useRef, useState } from 'react';
import styles from './MenuLayout.module.scss';
import ListMenu from '~/components/Restaurant/Menu/ListMenu';
import ModalMenu from '~/components/Restaurant/Menu/ModalMenu';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const MenuLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        food: false,
        drink: false,
        recommended: false,
    });
    const refreshListRef = useRef(() => {});

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSuccess = () => refreshListRef.current();

    const toggleFilter = (key) => {
        setFilterOptions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className={styles.menuLayoutContainer}>
            <div className={styles.header}>
                <h3>Quản lý thực đơn</h3>

                <div className={styles.actions}>
                    {/* 🔹 Nút Lọc */}
                    <div className={styles.filterWrapper}>
                        <button
                            className={`${styles.filterBtn} ${showFilter ? styles.active : ''}`}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <FaFilter className={`${styles.filterIcon} ${showFilter ? styles.rotate : ''}`} />
                            Lọc
                        </button>

                        {showFilter && (
                            <div className={styles.filterDropdown}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filterOptions.food}
                                        onChange={() => toggleFilter('food')}
                                    />
                                    Đồ ăn
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filterOptions.drink}
                                        onChange={() => toggleFilter('drink')}
                                    />
                                    Đồ uống
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filterOptions.recommended}
                                        onChange={() => toggleFilter('recommended')}
                                    />
                                    Đề xuất
                                </label>
                            </div>
                        )}
                    </div>

                    {/* 🔹 Ô tìm kiếm */}
                    <div className={styles.searchBox}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm món theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 🔹 Nút tạo món */}
                    <button className={styles.createBtn} onClick={handleOpenModal}>
                        <FaPlus className={styles.btnIcon} /> Tạo món mới
                    </button>
                </div>
            </div>

            {/* ✅ Truyền filterOptions xuống */}
            <ListMenu
                searchTerm={searchTerm}
                filterOptions={filterOptions}
                onSuccess={(fetchMenus) => (refreshListRef.current = fetchMenus)}
            />

            {isModalOpen && <ModalMenu isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={handleSuccess} />}
        </div>
    );
};

export default MenuLayout;
