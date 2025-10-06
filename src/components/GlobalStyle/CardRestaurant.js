import React from "react";
import styles from "../../styles/CardRestaurant.module.scss";

const CardRestaurant = ({ restaurant }) => {
  return (
    <div className={styles.card}>
      {restaurant.isNew && <span className={styles.badge}>NEW</span>}
      <div className={styles.imageBox}>
        <img src={restaurant.image} alt={restaurant.name} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{restaurant.name}</h3>

        <div className={styles.rating}>
          {"⭐".repeat(restaurant.rating)}
          <span className={styles.grayStar}>
            {"⭐".repeat(5 - restaurant.rating)}
          </span>
        </div>

        <p className={styles.address}>{restaurant.address}</p>

        <div className={styles.statusRow}>
          <span
            className={`${styles.statusDot} ${
              restaurant.isOpen ? styles.open : styles.closed
            }`}
          ></span>
          <span className={styles.statusText}>
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
          <span className={styles.time}>🕓 {restaurant.time}</span>
        </div>

        <button className={styles.btn}>Order Now!</button>
      </div>
    </div>
  );
};

export default CardRestaurant;
