import React, { useEffect, useState, useCallback } from "react";
import { customFetch } from "~/config/customFetch";
import CardMenu from "./CardMenu";
import styles from "./ListMenu.module.scss";

const ListMenu = ({ onSuccess }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await customFetch(
        "https://localhost:7176/api/RestaurantMenu/getByMyRestaurant",
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách món ăn");
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Fetch menus failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    if (onSuccess) {
      onSuccess(fetchMenus);
    }
  }, [fetchMenus, onSuccess]);

  const handleDeleteSuccess = (foodId) => {
    setMenus(menus.filter((menu) => menu.foodId !== foodId));
  };

  if (loading) return <div className={styles.loading}>Đang tải danh sách món ăn...</div>;

  return (
    <div className={styles.listMenuContainer}>
      {menus.length === 0 ? (
        <p>Chưa có món ăn nào.</p>
      ) : (
        menus.map((menu) => (
          <CardMenu
            key={menu.foodId}
            menu={menu}
            onDeleteSuccess={handleDeleteSuccess}
            onSuccess={fetchMenus}
          />
        ))
      )}
    </div>
  );
};

export default ListMenu;