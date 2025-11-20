import React, { useRef, useState, useEffect } from 'react';
import styles from './MenuLayout.module.scss';
import ListMenu from '~/components/Restaurant/Menu/ListMenu';
import ModalMenu from '~/components/Restaurant/Menu/ModalMenu';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { customFetch } from '~/config/customFetch';

const MenuLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [onlyRecommended, setOnlyRecommended] = useState(false);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [menus, setMenus] = useState([]); // ← THÊM DÒNG NÀY (quan trọng!)

    const refreshListRef = useRef(() => {});

    // Lấy danh sách món + type
    const fetchMenuData = async () => {
        try {
            const res = await customFetch('https://gustoweb.onrender.com/api/RestaurantMenu/getByMyRestaurant');
            if (res.ok) {
                const data = await res.json();
                setMenus(data || []); // ← Cập nhật menus

                // Tự động lấy các type duy nhất
                const types = [...new Set(data.map((item) => item.type).filter(Boolean))];
                setAvailableTypes(types);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu menu:', error);
            setMenus([]);
            setAvailableTypes([]);
        }
    };

    useEffect(() => {
        fetchMenuData();
    }, []);

    const handleSuccess = () => {
        refreshListRef.current();
        fetchMenuData(); // ← Cập nhật lại cả menus + filter khi thêm/sửa/xóa
    };

    const toggleType = (type) => {
        setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
    };

    return (
        <div className={styles.menuLayoutContainer}>
            <div className={styles.header}>
                <h3>Quản lý thực đơn</h3>
                <div className={styles.actions}>
                    <div className={styles.filterWrapper}>
                        <button
                            className={`${styles.filterBtn} ${showFilter ? styles.active : ''}`}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <FaFilter /> Lọc ({selectedTypes.length + (onlyRecommended ? 1 : 0)})
                        </button>

                        {showFilter && (
                            <div className={styles.filterDropdown}>
                                {availableTypes.map((type) => {
                                    const count = menus.filter((m) => m.type === type).length;
                                    return (
                                        <label key={type}>
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => toggleType(type)}
                                            />
                                            {type} <small>({count} món)</small>
                                        </label>
                                    );
                                })}

                                <hr />

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={onlyRecommended}
                                        onChange={() => setOnlyRecommended(!onlyRecommended)}
                                    />
                                    Chỉ hiển thị món đề xuất
                                </label>
                            </div>
                        )}
                    </div>

                    <div className={styles.searchBox}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Tạo món mới
                    </button>
                </div>
            </div>

            <ListMenu
                searchTerm={searchTerm}
                selectedTypes={selectedTypes}
                onlyRecommended={onlyRecommended}
                onSuccess={(fetch) => (refreshListRef.current = fetch)}
            />

            {isModalOpen && (
                <ModalMenu isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
            )}
        </div>
    );
};

export default MenuLayout;
