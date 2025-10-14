import React from 'react';
import classNames from 'classnames/bind';
import styles from './AccountSettingPage.module.scss';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';

const cx = classNames.bind(styles);

function AccountSettingsPage() {
    return (
        <div className={cx('container')}>
            <h1 className={cx('page-title')}>Cài đặt Tài khoản</h1>

            <div className={cx('section')}>
                <h2 className={cx('section-title')}>Đổi Mật khẩu</h2>
                <p className={cx('section-description')}>
                    Để bảo mật, mật khẩu của bạn nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc
                    biệt.
                </p>
                <ChangePasswordForm />
            </div>

            <div className={cx('section', 'danger-zone')}>
                <h2 className={cx('section-title')}>Xóa Tài khoản</h2>
                <p className={cx('section-description')}>
                    Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn, bao gồm lịch sử đặt món và danh sách yêu
                    thích, sẽ bị xóa vĩnh viễn.
                </p>
                <DeleteAccountForm />
            </div>
        </div>
    );
}

export default AccountSettingsPage;
