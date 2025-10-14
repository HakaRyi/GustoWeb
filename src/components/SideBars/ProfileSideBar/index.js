import classNames from 'classnames/bind';
import style from './ProfileSideBar.module.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCog, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { FaGratipay } from 'react-icons/fa';

const cx = classNames.bind(style);

function ProfileSideBar() {
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
        </div>
    );
}

export default ProfileSideBar;
