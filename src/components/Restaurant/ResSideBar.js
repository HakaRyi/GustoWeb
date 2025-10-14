import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { logoutSuccess } from '~/redux/authSlice';
import styles from './ResSideBar.module.scss';
import { FaUtensils, FaTable, FaCogs, FaSignOutAlt, FaIdCard, FaBars, FaArrowLeft, FaCreditCard } from 'react-icons/fa';

const ResSideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true); // Trạng thái mở rộng/thu gọn

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://localhost:7176/api/Account/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Logout failed');

            Cookies.remove('AccessToken');
            Cookies.remove('RefreshToken');
            dispatch(logoutSuccess());
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove('AccessToken');
            Cookies.remove('RefreshToken');
            dispatch(logoutSuccess());
            navigate('/login');
        }
    };

    return (
        <div className={`${styles.resSidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            <button className={styles.toggleBtn} onClick={toggleSidebar}>
                {isExpanded ? <FaArrowLeft /> : <FaBars />}
            </button>
            <NavLink to="" end className={({ isActive }) => `${styles.resMenuItem} ${isActive ? styles.active : ''}`}>
                <FaIdCard className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Hồ sơ</span>}
            </NavLink>
            <NavLink to="layout" className={({ isActive }) => `${styles.resMenuItem} ${isActive ? styles.active : ''}`}>
                <FaCogs className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Quản lý bố cục</span>}
            </NavLink>
            <NavLink to="menu" className={({ isActive }) => `${styles.resMenuItem} ${isActive ? styles.active : ''}`}>
                <FaUtensils className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Quản lý menu</span>}
            </NavLink>
            <NavLink to="table" className={({ isActive }) => `${styles.resMenuItem} ${isActive ? styles.active : ''}`}>
                <FaTable className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Quản lý bàn</span>}
            </NavLink>
            <NavLink
                to="integratePaymentAccount"
                className={({ isActive }) => `${styles.resMenuItem} ${isActive ? styles.active : ''}`}
            >
                <FaCreditCard className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Tích hợp tài khoản ngân hàng</span>}
            </NavLink>
            <button className={styles.resLogoutBtn} onClick={handleLogout}>
                <FaSignOutAlt className={styles.resIcon} />
                {isExpanded && <span className={styles.resMenuText}>Đăng xuất</span>}
            </button>
        </div>
    );
};

export default ResSideBar;
