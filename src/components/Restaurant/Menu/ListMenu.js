import React, { useEffect, useState, useCallback } from 'react';
import { customFetch } from '~/config/customFetch';
import CardMenu from './CardMenu';
import styles from './ListMenu.module.scss';

const ListMenu = ({ searchTerm, filterOptions, onSuccess }) => {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customFetch('https://localhost:7176/api/RestaurantMenu/getByMyRestaurant', {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Lỗi khi lấy danh sách món ăn');
            const data = await res.json();
            setMenus(data);
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

    useEffect(() => {
        let filtered = menus.filter((m) => m.foodName?.toLowerCase().includes(searchTerm.toLowerCase()));

        // ✅ Nếu không chọn filter nào → hiển thị tất cả
        if (!filterOptions.food && !filterOptions.drink && !filterOptions.recommended) {
            setFilteredMenus(filtered);
            return;
        }

        filtered = filtered.filter((m) => {
            const isFood = m.type?.toLowerCase() === 'đồ ăn';
            const isDrink = m.type?.toLowerCase() === 'đồ uống';
            const isRecommended = m.isRecommended === true;

            // ✅ Lọc theo các checkbox được chọn (logic OR)
            return (
                (filterOptions.food && isFood) ||
                (filterOptions.drink && isDrink) ||
                (filterOptions.recommended && isRecommended)
            );
        });

        setFilteredMenus(filtered);
        setCurrentPage(1);
    }, [menus, searchTerm, filterOptions]);

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
                <p>Không tìm thấy món nào.</p>
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

                    <div className={styles.pagination}>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                            ‹
                        </button>
                        <span>
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                            ›
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListMenu;
