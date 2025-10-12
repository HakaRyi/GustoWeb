import React, { useState } from "react";
import ListRestaurant from "../components/GlobalStyle/ListRestaurant";
import styles from "../styles/Restaurants.module.scss";
import { FiSearch, FiFilter } from "react-icons/fi";

const Restaurants = () => {
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filterOptions = [
    "Đánh giá cao",
    "Mới",
    "Gần đây",
    "Đang mở",
    "Đã đóng",
  ];

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.filterContainer}`)) {
      setShowFilterPanel(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.restaurantsPage}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Find Your Place!</h1>

        <div className={styles.searchFilterContainer}>
          {/* Ô tìm kiếm */}
          

          {/* Nút bộ lọc */}
          <div className={styles.filterContainer}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilterPanel((prev) => !prev)}
            >
              <FiFilter className={styles.filterIcon} />
              Bộ lọc
            </button>

            {showFilterPanel && (
              <div className={styles.filterDropdown}>
                <h4 className={styles.filterTitle}>Chọn tiêu chí lọc</h4>
                <div className={styles.filterList}>
                  {filterOptions.map((f, idx) => (
                    <label key={idx} className={styles.filterItem}>
                      <input
                        type="checkbox"
                        checked={filters.includes(f)}
                        onChange={() => toggleFilter(f)}
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className={styles.searchIcon} />
          </div>
        </div>

        <ListRestaurant filters={filters} search={search} />
      </main>
    </div>
  );
};

export default Restaurants;
