import React, { useEffect, useState, useCallback } from "react";
import { customFetch } from "~/config/customFetch";
import CardLayout from "./CardLayout";
import styles from "./ListLayout.module.scss";

const ListLayout = ({ onSuccess }) => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLayouts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await customFetch(
        "https://localhost:7176/api/RestaurantLayout/getByMyRestaurant",
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách bố cục");
      const data = await res.json();
      setLayouts(data);
    } catch (error) {
      console.error("Fetch layouts failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLayouts();
    if (onSuccess) {
      onSuccess(fetchLayouts);
    }
  }, [fetchLayouts, onSuccess]);

  const handleDeleteSuccess = (layoutId) => {
    setLayouts(layouts.filter((layout) => layout.layoutId !== layoutId));
  };

  if (loading) return <div className={styles.loading}>Đang tải danh sách bố cục...</div>;

  return (
    <div className={styles.listLayoutContainer}>
      {layouts.length === 0 ? (
        <p>Chưa có bố cục nào.</p>
      ) : (
        layouts.map((layout) => (
          <CardLayout
            key={layout.layoutId}
            layout={layout}
            onDeleteSuccess={handleDeleteSuccess}
            onSuccess={fetchLayouts}
          />
        ))
      )}
    </div>
  );
};

export default ListLayout;