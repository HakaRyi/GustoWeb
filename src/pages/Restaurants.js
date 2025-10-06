import React, { useState } from "react";
import ListRestaurant from "../components/GlobalStyle/ListRestaurant";
import styles from "../styles/Restaurants.module.scss";
import { FiSearch } from "react-icons/fi";
const Restaurants = () => {
  const [filters, setFilters] = useState([]); // lưu mảng filter
  const [search, setSearch] = useState("");

  const filterOptions = [
    "Highest rated restaurant",
    "New",
    "Near your house",
    "Opened",
    "Closed",
  ];

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value) // bỏ nếu đã chọn
        : [...prev, value] // thêm nếu chưa có
    );
  };

  return (
    <div className={styles.restaurantsPage}>
      {/* --- Sidebar filter --- */}
      <aside className={styles.filterPanel}>
        {filterOptions.map((f, idx) => (
          <label key={idx} className={styles.filterOption}>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={filters.includes(f)}
                onChange={() => toggleFilter(f)}
              />
              <span className={styles.slider}></span>
            </div>
            <span className={styles.filterText}>{f}</span>
          </label>
        ))}
      </aside>

      {/* --- Main content --- */}
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Find Your Place!</h1>

        {/* Search box */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className={styles.searchIcon} />
        </div>

        {/* Restaurant list */}
        <ListRestaurant filters={filters} search={search} />
      </main>
    </div>
  );
};

export default Restaurants;