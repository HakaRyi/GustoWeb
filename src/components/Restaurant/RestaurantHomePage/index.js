import React, { useEffect, useState } from 'react';
import style from './RestaurantHomePage.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

import CurrentBooking from './CurrentBooking';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';
import HistoryBooking from './HistoryBooking';

function RestaurantHomePage() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('current');

    const fetchProfile = async () => {
        try {
            setLoadingVisible(true);
            const response = await customFetch('https://localhost:7176/api/Account/get-me', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
        } finally {
            setLoadingVisible(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className={style.container}>
            {/* Header */}
            <div className={style.header}>
                <h1 className={style.restaurantName}>{profileData?.fullName || 'Tên Nhà Hàng'}</h1>

                {/* Thanh điều hướng */}
                <div className={style.navBar}>
                    <div
                        className={`${style.navBtn} ${activeTab === 'current' ? style.active : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Current
                    </div>
                    <div
                        className={`${style.navBtn} ${activeTab === 'history' ? style.active : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </div>
                </div>
            </div>

            {/* Nội dung động */}
            <div className={style.navContent}>
                <AnimatePresence mode="wait">
                    {activeTab === 'current' ? (
                        <motion.div
                            key="current"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <CurrentBooking />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <HistoryBooking restaurantId={profileData?.restaurantId} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
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
