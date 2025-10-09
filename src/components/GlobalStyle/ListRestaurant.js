import React, { useEffect, useState } from "react";
import CardRestaurant from "./CardRestaurant";
import styles from "../../styles/ListRestaurant.module.scss";
import { customFetch } from "~/config/customFetch"; // Đường dẫn đến file chứa customFetch

const ListRestaurant = ({ filters, search }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {  
      try {
        setLoading(true);

        const res = await customFetch("https://localhost:7176/api/RestaurantProfile/getAllResPro", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        //map data backend -> format CardRestaurant
        let formatted = data.map((r) => ({
          id: r.accountId,
          name: r.fullName,
          address: r.address,
          image: r.avatarUrl || "https://via.placeholder.com/300x200?text=No+Image",
          time: r.openHour || "N/A",
          isOpen: true, //tạm set true
          isNew: true, 
          rating: 5,    
        }));

        // Search
        if (search) {
          formatted = formatted.filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Filter
        if (filters.includes("New")) {
          formatted = formatted.filter((r) => r.isNew);
        }
        if (filters.includes("Opened")) {
          formatted = formatted.filter((r) => r.isOpen);
        }
        if (filters.includes("Closed")) {
          formatted = formatted.filter((r) => !r.isOpen);
        }

        setRestaurants(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhà hàng:", err);
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
