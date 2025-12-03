import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 1. Import useNavigate
import routes from '~/config/route'; // 👈 2. Import routes để lấy đường dẫn login

import styles from './AdminPage.module.scss';
import Sidebar from '../../components/Admin/Sidebar';
import DashboardCard from '~/components/Admin/DashboardCard';
import FoodTable from '~/components/Admin/FoodTable';
import Chart from '~/components/Admin/Chart';
import RestaurantList from '~/components/Admin/RestaurantList';
import DinerProfileManagement from '~/components/Admin/DinerProfileManagement';
import RestaurantMenuManager from '~/components/Admin/RestaurantMenuManager';
import FeedbackManagement from '~/components/Admin/FeedbackManagement';
import TransactionHistory from '~/components/Admin/TransactionHistory';
import { FaUtensils, FaStore, FaClipboardList, FaComments } from 'react-icons/fa';

const API_DASHBOARD = 'https://gustoweb.onrender.com/api/admin/AdminDashboard';

const AdminPage = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const navigate = useNavigate(); // 👈 3. Khởi tạo navigate

    const [dashboardData, setDashboardData] = useState({
        totalFoods: 0,
        totalRestaurants: 0,
        pendingOrders: 0,
        todayReviews: 0,
        revenueChart: [],
        topSellingFoods: [],
    });

    useEffect(() => {
        if (activeMenu === 'dashboard') {
            fetchDashboardData();
        }
    }, [activeMenu]);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(API_DASHBOARD);
            setDashboardData(res.data);
        } catch (error) {
            console.error('Lỗi tải Dashboard:', error);
        }
    };

    // 👇👇 4. HÀM XỬ LÝ MENU & LOGOUT 👇👇
    const handleMenuChange = (id) => {
        if (id === 'logout') {
            // Xử lý đăng xuất
            const confirmLogout = window.confirm('Bạn có chắc muốn đăng xuất không?');
            if (confirmLogout) {
                // Xóa token
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('AccountID'); // Xóa hết những gì đã lưu

                // Chuyển về trang login
                navigate(routes.login);
            }
        } else {
            // Nếu không phải logout thì chuyển tab bình thường
            setActiveMenu(id);
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* 👇 5. Truyền hàm handleMenuChange vào Sidebar */}
            <Sidebar onMenuChange={handleMenuChange} />

            <div className={styles.mainContent}>
                {activeMenu === 'dashboard' && (
                    <div className={styles.dashboard}>
                        <h1>🍽️ GUSTO Admin Dashboard</h1>

                        <div className={styles.cards}>
                            <DashboardCard
                                title="Tổng Món Ăn"
                                value={dashboardData.totalFoods}
                                color="#FFD166"
                                icon={<FaUtensils />}
                            />
                            <DashboardCard
                                title="Nhà Hàng"
                                value={dashboardData.totalRestaurants}
                                color="#06D6A0"
                                icon={<FaStore />}
                            />
                            <DashboardCard
                                title="Đơn Chờ Xử Lý"
                                value={dashboardData.pendingOrders}
                                color="#EF476F"
                                icon={<FaClipboardList />}
                            />
                            <DashboardCard
                                title="Đánh Giá Hôm Nay"
                                value={dashboardData.todayReviews}
                                color="#118AB2"
                                icon={<FaComments />}
                            />
                        </div>

                        <div className={styles.chartSection}>
                            <h3>Biểu Đồ Doanh Thu Năm {new Date().getFullYear()}</h3>
                            <Chart data={dashboardData.revenueChart} />
                        </div>

                        <div className={styles.tableSection}>
                            <h2>Top Món Ăn Bán Chạy 🍝</h2>
                            <FoodTable data={dashboardData.topSellingFoods} />
                        </div>
                    </div>
                )}

                {activeMenu === 'restaurants' && <RestaurantList />}
                {activeMenu === 'users' && <DinerProfileManagement />}
                {activeMenu === 'menu-tables' && <RestaurantMenuManager />}
                {activeMenu === 'feedback' && <FeedbackManagement />}
                {activeMenu === 'transactions' && <TransactionHistory />}
            </div>
        </div>
    );
};

export default AdminPage;
