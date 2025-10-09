import React, { useState } from "react";
import ListRestaurant from "../components/GlobalStyle/ListRestaurant";
import styles from "../styles/Restaurants.module.scss";
import { FiSearch } from "react-icons/fi";

const Restaurants = () => {
  const [filters, setFilters] = useState([]);
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
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  };

  return (
    <div className={styles.restaurantsPage}>
      <aside className={styles.filterPanel}>
        {filterOptions.map((f, idx) => (
          <button
            key={idx}
            className={`${styles.filterButton} ${
              filters.includes(f) ? styles.active : ""
            }`}
            onClick={() => toggleFilter(f)}
          >
            {f}
          </button>
        ))}
      </aside>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Find Your Place!</h1>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className={styles.searchIcon} />
        </div>
        <ListRestaurant filters={filters} search={search} />
      </main>
    </div>
  );
};

export default Restaurants;