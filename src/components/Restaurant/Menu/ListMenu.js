import React, { useEffect, useState, useCallback } from 'react';
import { customFetch } from '~/config/customFetch';
import CardMenu from './CardMenu';
import styles from './ListMenu.module.scss';

const ListMenu = ({ searchTerm, selectedTypes, onlyRecommended, onSuccess }) => {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customFetch('https://gustoweb.onrender.com/api/RestaurantMenu/getByMyRestaurant');
            if (!res.ok) throw new Error('Lỗi khi lấy danh sách món ăn');
            const data = await res.json();
            setMenus(data || []);
        } catch (error) {
            console.error('Fetch menus failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus();
        if (onSuccess) onSuccess(fetchMenus);
    }, [fetchMenus, onSuccess]);

    // Lọc theo tìm kiếm + loại món + đề xuất
    useEffect(() => {
        let filtered = menus;

        // 1. Tìm kiếm theo tên
        if (searchTerm.trim()) {
            filtered = filtered.filter((m) => m.foodName?.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // 2. Lọc theo loại món (nếu có chọn)
        if (selectedTypes && selectedTypes.length > 0) {
            filtered = filtered.filter((m) => selectedTypes.includes(m.type));
        }

        // 3. Chỉ hiển thị món đề xuất
        if (onlyRecommended) {
            filtered = filtered.filter((m) => m.isRecommended === true);
        }

        setFilteredMenus(filtered);
        setCurrentPage(1);
    }, [menus, searchTerm, selectedTypes, onlyRecommended]);

    const handleDeleteSuccess = (foodId) => {
        setMenus((prev) => prev.filter((m) => m.foodId !== foodId));
    };

    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMenus = filteredMenus.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return <div className={styles.loading}>Đang tải danh sách món ăn...</div>;

    return (
        <div className={styles.listMenuContainer}>
            {filteredMenus.length === 0 ? (
                <p className={styles.noResult}>Không tìm thấy món ăn nào phù hợp.</p>
            ) : (
                <>
                    <div className={styles.menuGrid}>
                        {currentMenus.map((menu) => (
                            <CardMenu
                                key={menu.foodId}
                                menu={menu}
                                onDeleteSuccess={handleDeleteSuccess}
                                onSuccess={fetchMenus}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                                Previous
                            </button>
                            <span>
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListMenu;
