import React, { useEffect, useState } from 'react';
import CardRestaurant from './CardRestaurant';
import styles from '../../styles/ListRestaurant.module.scss';
import { customFetch } from '~/config/customFetch';
const logo = process.env.PUBLIC_URL + '/LOGOGUSTO2.png';

const ListRestaurant = ({ filters, search }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);

                const res = await customFetch('https://gustoweb.onrender.com/api/RestaurantProfile/getAllResPro', {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const data = await res.json();

                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                const formatted = data.map((r) => {
                    const openAt = r.openAt ? r.openAt.slice(0, 5) : 'N/A';
                    const closeAt = r.closeAt ? r.closeAt.slice(0, 5) : 'N/A';
                    const timeStr = `${openAt} - ${closeAt}`;

                    // Xác định nhà hàng đang mở hay đóng
                    let isOpen = false;
                    if (r.openAt && r.closeAt) {
                        const [openHour, openMin] = r.openAt.split(':').map(Number);
                        const [closeHour, closeMin] = r.closeAt.split(':').map(Number);

                        const openTime = openHour * 60 + openMin;
                        const closeTime = closeHour * 60 + closeMin;
                        const currentTime = currentHour * 60 + currentMinute;

                        if (closeTime < openTime) {
                            isOpen = currentTime >= openTime || currentTime < closeTime;
                        } else {
                            isOpen = currentTime >= openTime && currentTime < closeTime;
                        }
                    }

                    // Xác định nhà hàng có phải là mới hay không
                    let isNew = false;
                    if (r.createAt) {
                        const createDate = new Date(r.createAt);
                        const timeDiff = now - createDate; // Khoảng cách thời gian (miliseconds)
                        const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Chuyển sang ngày
                        isNew = daysDiff <= 21; // Mới nếu nhỏ hơn hoặc bằng 21 ngày
                    }

                    // Xử lý rating từ API
                    const rating = r.rating || 0;
                    const fullStars = Math.floor(rating); // Số sao đầy
                    const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars <= 0.7 ? 1 : 0; // Nửa sao nếu phần thập phân từ 0.3 đến 0.7

                    return {
                        id: r.accountId,
                        name: r.fullName,
                        address: r.address,
                        image: r.avatarUrl || logo,
                        time: timeStr,
                        isOpen,
                        isNew,
                        rating: fullStars, // Số sao đầy để hiển thị
                        hasHalfStar, // Cờ để hiển thị nửa sao
                    };
                });

                // Search
                let filtered = formatted;
                if (search) {
                    filtered = filtered.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Filter
                if (filters.includes('Mới')) {
                    filtered = filtered.filter((r) => r.isNew);
                }
                if (filters.includes('Đang mở')) {
                    filtered = filtered.filter((r) => r.isOpen);
                }
                if (filters.includes('Đã đóng')) {
                    filtered = filtered.filter((r) => !r.isOpen);
                }

                setRestaurants(filtered);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách nhà hàng:', err);
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [filters, search]);

    if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

    return (
        <div className={styles.restList_container}>
            {restaurants.length === 0 ? (
                <p className={styles.noResult}>Không tìm thấy nhà hàng nào</p>
            ) : (
                restaurants.map((r) => <CardRestaurant key={r.id} restaurant={r} />)
            )}
        </div>
    );
};

export default ListRestaurant;
