// src/components/Admin/RestaurantMenuManager.js
import React, { useState, useEffect } from "react";
import styles from "./RestaurantList.module.scss"; // Dùng chung SCSS với trang List
import RestaurantDetail from "./RestaurantDetail";
import { FaSearch } from "react-icons/fa";

const RestaurantMenuManager = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // State tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");

    // Lấy danh sách nhà hàng
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch("https://localhost:7176/api/admin/AdminRestaurantProfile");
                const data = await res.json();
                setRestaurants(data);
            } catch (err) {
                console.error("Lỗi tải danh sách:", err);
            }
        };
        fetchRestaurants();
    }, []);

    // Logic lọc nhà hàng
    const filteredRestaurants = restaurants.filter((r) =>
        (r.fullName && r.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.address && r.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Nếu đang chọn nhà hàng -> Hiện trang Menu & Table
    if (selectedId) {
        return (
            <RestaurantDetail
                restaurantId={selectedId}
                onBack={() => setSelectedId(null)}
            />
        );
    }

    // Nếu chưa chọn -> Hiện danh sách
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2>📋 Chọn nhà hàng để xem Menu & Bàn</h2>
                </div>
            </div>

            {/* 👇 THANH TÌM KIẾM (Đã dùng Class SCSS chuẩn) */}
            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Tìm kiếm nhà hàng theo tên hoặc địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((r) => (
                        <div
                            key={r.accountId}
                            className={styles.card}
                            onClick={() => setSelectedId(r.accountId)}
                        >
                            {/* Card Header chỉ hiện Avatar nếu có (Optional), ở đây ta chỉ hiện Tên cho gọn */}
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    <h3>{r.fullName || "Tên chưa cập nhật"}</h3>
                                    <p>{r.address || "Chưa có địa chỉ"}</p>
                                </div>

                                {/* Nút bấm giờ đã được SCSS lo (class .cardBody button) */}
                                <button>
                                    👉 Xem Chi Tiết Menu/Bàn
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#666", fontStyle: "italic", textAlign: 'center', width: '100%' }}>
                        Không tìm thấy nhà hàng nào...
                    </p>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenuManager;