import React, { useEffect, useState } from 'react';
import style from './RestaurantHomePage.module.scss';

import CurrentBooking from './CurrentBooking';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';

function RestaurantHomePage() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [profileData, setProfileData] = useState(null);

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
            <div className={style.header}>{profileData?.fullName || ''}</div>
            <div className={style.bodyContent}>
                <div className={style.navBar}>
                    <div className={style.navBtn}>Current</div>
                    <div className={style.navBtn}>History</div>
                </div>
                <div className={style.navContent}>
                    <CurrentBooking />
                </div>
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
