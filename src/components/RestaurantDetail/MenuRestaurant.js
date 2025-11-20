import React, { useState, useEffect } from 'react';
import MenuCard from '~/components/RestaurantDetail/MenuCard';
import { customFetch } from '~/config/customFetch';
import styles from './MenuRestaurant.module.scss';

function MenuRestaurant({ id }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await customFetch(
                    `https://gustoweb.onrender.com/api/RestaurantMenu/getByResMenu/${id}`,
                );
                const data = await response.json();
                setMenuItems(data || []);
            } catch (error) {
                console.error('Lỗi tải menu:', error);
                setMenuItems([]);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchMenu();
    }, [id]);

    // Tự động lấy danh sách các type duy nhất từ dữ liệu
    const categories = [...new Set(menuItems.map((item) => item.type).filter(Boolean))];

    // Sắp xếp thứ tự hiển thị (tuỳ chọn - bạn có thể custom)
    const sortOrder = {
        'Đồ ăn': 1,
        'Cà phê': 2,
        'Đồ uống': 3,
        'Trà Sữa': 4,
        'Đá Xay': 5,
        'Trà Trái Cây': 6,
        Phở: 7,
        'Bún Bò': 8,
        Cơm: 9,
        Gà: 10,
        Bò: 11,
        Cháo: 12,
        'Bánh Mì': 13,
        Combo: 14,
        Khác: 15,
    };

    const sortedCategories = categories.sort((a, b) => {
        return (sortOrder[a] || 999) - (sortOrder[b] || 999);
    });

    if (loading) {
        return <div className={styles.loading}>Đang tải menu...</div>;
    }

    if (menuItems.length === 0) {
        return <div className={styles.noMenu}>Nhà hàng chưa có món ăn nào</div>;
    }

    return (
        <div className={styles.menuRestaurant}>
            <h2 className={styles.menuTitle}>MENU</h2>

            <div className={styles.menuCategories}>
                {sortedCategories.map((category) => {
                    const itemsInCategory = menuItems.filter((item) => item.type === category);

                    return (
                        <div key={category} className={styles.menuCategory}>
                            <h3 className={styles.categoryTitle}>
                                {category.toUpperCase()}
                                <span className={styles.itemCount}>({itemsInCategory.length} món)</span>
                            </h3>
                            <div className={styles.categoryItems}>
                                {itemsInCategory.map((item) => (
                                    <MenuCard key={item.foodId} item={item} restaurantId={id} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MenuRestaurant;
