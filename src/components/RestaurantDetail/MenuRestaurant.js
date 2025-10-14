import React, { useState, useEffect } from 'react';
import MenuCard from '~/components/RestaurantDetail/MenuCard';
import { customFetch } from '~/config/customFetch';
import styles from './MenuRestaurant.module.scss';

function MenuRestaurant({ id }) {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const response = await customFetch(`https://localhost:7176/api/RestaurantMenu/getByResMenu/${id}`);
            const data = await response.json();
            setMenuItems(data);
        };
        fetchMenu();
    }, [id]);

    return (
        <div className={styles.menuRestaurant}>
            <h2 className={styles.menuTitle}>MENU</h2>
            <div className={styles.menuCategories}>
                {['Đồ uống', 'Đồ ăn'].map((category) => (
                    <div key={category} className={styles.menuCategory}>
                        <h3 className={styles.categoryTitle}>{category.toUpperCase()}</h3>
                        <div className={styles.categoryItems}>
                            {menuItems
                                .filter((item) => item.type === category)
                                .map((item) => (
                                    <MenuCard key={item.foodId} item={item} />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuRestaurant;
