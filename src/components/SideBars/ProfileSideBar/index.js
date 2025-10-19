import classNames from 'classnames/bind';
import style from './ProfileSideBar.module.scss';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCog, faHeart, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaGratipay } from 'react-icons/fa';
import { customFetch } from '~/config/customFetch';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';

const cx = classNames.bind(style);

function ProfileSideBar() {
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const logoutApi = async () => {
        try {
            setLoading(true);
            var res = await customFetch(`https://localhost:7176/api/Account/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                setResult({
                    visible: true,
                    success: false,
                    message: 'Đăng xuất không thành công, vui lòng liên hệ với nhân viên kỹ thuật',
                });
            }
            navigate('/');
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutApi();
    };
    return (
        <div className={cx('sidebar-wrapper')}>
            <NavLink to="/profile" end className={({ isActive }) => cx('sidebar-item', { active: isActive })}>
                <FontAwesomeIcon icon={faUser} />
            </NavLink>
            <NavLink to="/profile/bkh" className={({ isActive }) => cx('sidebar-item', { active: isActive })}>
                <FontAwesomeIcon icon={faClockRotateLeft} />
            </NavLink>
            <NavLink to="/profile/favourites" className={({ isActive }) => cx('sidebar-item', { active: isActive })}>
                <FontAwesomeIcon icon={faHeart} />
            </NavLink>
            <NavLink to="/profile/settings" className={({ isActive }) => cx('sidebar-item', { active: isActive })}>
                <FontAwesomeIcon icon={faCog} />
            </NavLink>
            <div onClick={handleLogout} className={({ isActive }) => cx('sidebar-item', { active: isActive })}>
                <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <LoadingModal visible={loading} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default ProfileSideBar;
