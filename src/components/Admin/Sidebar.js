// src/components/Admin/Sidebar.js
import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import { FaUtensils, FaChartPie, FaUserFriends, FaSignOutAlt, FaConciergeBell, FaComments, FaMoneyBillWave, FaEnvelope, FaCalendarCheck } from "react-icons/fa";

const Sidebar = ({ onMenuChange }) => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: <FaChartPie />, label: "Biểu Đồ" },
    { id: "restaurants", icon: <FaUtensils />, label: "Quản Lý Nhà Hàng" },
    { id: "menu-tables", icon: <FaConciergeBell />, label: "Quản lý Thực Đơn & Bàn" },
    { id: "booking", icon: <FaCalendarCheck />, label: "Quản lý đặt chổ" },
    { id: "users", icon: <FaUserFriends />, label: "Người dùng" },
    { id: "feedback", icon: <FaComments />, label: "Phản hồi" },
    { id: "transactions", icon: <FaMoneyBillWave />, label: "Giao dịch" },
    { id: "contact", icon: <FaEnvelope />, label: "Liên hệ & Hỗ trợ" },
    { id: "logout", icon: <FaSignOutAlt />, label: "Đăng xuất" },
  ];

  const handleClick = (id) => {
    setActive(id);
    if (onMenuChange) onMenuChange(id);
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>🍴 GUSTO Admin</h2>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`${styles.menuItem} ${active === item.id ? styles.active : ""}`}
            onClick={() => handleClick(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;