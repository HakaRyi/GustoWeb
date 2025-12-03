import React, { useEffect, useState } from 'react';
import style from './RestaurantHomePage.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import CurrentBooking from './CurrentBooking';
import HistoryBooking from './HistoryBooking';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';

function RestaurantHomePage() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [bestSeller, setBestSeller] = useState('Đang tải món hot...');

    // Thêm state cho doanh thu
    const [revenue, setRevenue] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // tháng hiện tại (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchProfile = async () => {
        try {
            setLoadingVisible(true);
            const response = await customFetch('https://gustoweb.onrender.com/api/Account/get-me', {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Lấy profile thất bại');
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            setResult({ visible: true, success: false, message: 'Không thể tải thông tin nhà hàng 😢' });
        } finally {
            setLoadingVisible(false);
        }
    };
    const fetchBestSeller = async () => {
        try {
            const response = await customFetch('https://gustoweb.onrender.com/api/RestaurantProfile/getBestSeller', {
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Không lấy được món bán chạy');

            const data = await response.json();
            // API trả về: { "bestSeller": "Trà Sữa Trân Châu" } hoặc { "revenue": "Phở Bò" } → mình xử lý cả 2 trường hợp
            const name = data.bestSeller || data.revenue || 'Chưa có món nào nổi bật';
            setBestSeller(name);
        } catch (error) {
            console.error('Lỗi lấy best seller:', error);
            setBestSeller('Chưa có dữ liệu');
        }
    };
    // Hàm gọi API doanh thu
    const fetchRevenue = async (month, year) => {
        try {
            setRevenue(null); // reset để hiện loading
            const response = await customFetch(
                `https://gustoweb.onrender.com/api/RestaurantProfile/getMyRevenue/${month}/${year}`,
                { credentials: 'include' },
            );

            if (!response.ok) throw new Error('Lấy doanh thu thất bại');

            const data = await response.json();
            setRevenue(data.revenue);
        } catch (error) {
            console.error(error);
            setRevenue(0);
            setResult({ visible: true, success: false, message: 'Không thể tải doanh thu tháng này' });
        }
    };

    // Gọi khi load trang + khi đổi tháng/năm
    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profileData) {
            fetchRevenue(selectedMonth, selectedYear);
        }
    }, [profileData, selectedMonth, selectedYear]);
    useEffect(() => {
        if (profileData) {
            fetchRevenue(selectedMonth, selectedYear);
            fetchBestSeller(); // GỌI Ở ĐÂY
        }
    }, [profileData, selectedMonth, selectedYear]);
    // Format tiền tệ Việt Nam
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '...';
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <div className={style.container}>
            {/* Header */}
            <div className={style.header}>
                <h1 className={style.restaurantName}>{profileData?.fullName || 'Tên Nhà Hàng'}</h1>
                <div className={style.statsRow}>
                    {/* Doanh thu nổi bật */}
                    <div className={style.revenueBox}>
                        <div className={style.revenueLabel}>Doanh thu tháng</div>
                        <div className={style.revenueAmount}>{formatCurrency(revenue)}</div>

                        {/* Chọn tháng năm */}
                        <div className={style.monthSelector}>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className={style.monthSelect}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Tháng {i + 1}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className={style.yearInput}
                                min="2020"
                                max="2030"
                            />
                        </div>
                    </div>
                    <div className={style.bestSellerBox}>
                        <div className={style.bestSellerLabel}>Món được yêu thích nhất</div>
                        <div className={style.bestSellerName}>{bestSeller}</div>
                    </div>
                </div>
                {/* Thanh điều hướng */}
                <div className={style.navBar}>
                    <div
                        className={`${style.navBtn} ${activeTab === 'current' ? style.active : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Đơn gần đây
                    </div>
                    <div
                        className={`${style.navBtn} ${activeTab === 'history' ? style.active : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử
                    </div>
                </div>
            </div>

            {/* Nội dung */}
            <div className={style.navContent}>
                <AnimatePresence mode="wait">
                    {activeTab === 'current' ? (
                        <motion.div key="current" /* animation */>
                            <CurrentBooking />
                        </motion.div>
                    ) : (
                        <motion.div key="history" /* animation */>
                            <HistoryBooking restaurantId={profileData?.account?.id} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <LoadingModal visible={loadingVisible} message="Đang tải dữ liệu nhà hàng..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default RestaurantHomePage;
