import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './EmptyState.module.scss';
import { FaRegCompass } from 'react-icons/fa'; // Icon mặc định

const cx = classNames.bind(style);

function EmptyState({
    message = 'Không tìm thấy dữ liệu.',
    actionText,
    actionLink,
    icon: IconComponent = FaRegCompass, // Sử dụng icon được truyền vào hoặc icon mặc định
}) {
    return (
        <div className={cx('empty-state-container')}>
            <div className={cx('icon-wrapper')}>{IconComponent && <IconComponent className={cx('icon')} />}</div>
            <p className={cx('message')}>{message}</p>
            {actionText && actionLink && (
                <Link to={actionLink} className={cx('action-button')}>
                    {actionText}
                </Link>
            )}
        </div>
    );
}

export default EmptyState;
