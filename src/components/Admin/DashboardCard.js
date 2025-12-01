import React from "react";
import styles from "./DashboardCard.module.scss";

const DashboardCard = ({ title, value, color, icon }) => {
    return (
        <div className={styles.card} style={{ borderTop: `5px solid ${color}` }}>
            <div className={styles.iconBox} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className={styles.info}>
                <p className={styles.title}>{title}</p>
                <h2 className={styles.value}>{value}</h2>
            </div>
        </div>
    );
};

export default DashboardCard;
