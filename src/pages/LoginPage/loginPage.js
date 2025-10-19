import React, { useState } from 'react';
import className from 'classnames/bind';
import styles from './loginPage.module.scss';
import routes from '~/config/route';

//Components:
import LoginForm from '../../components/Forms/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '~/components/Modals/ForgotPasswordModal';

const cx = className.bind(styles);

function LoginPage() {
    const nav = useNavigate();
    const [showForgotModal, setShowForgotModal] = useState(false);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('overlay')}>
                <div className={cx('container')}>
                    <div onClick={() => nav(routes.home)} className={cx('header')}>
                        <h2>
                            Welcome to <span>Gusto</span>
                        </h2>
                    </div>
                    <div className={cx('content')}>
                        <LoginForm />
                        <div className={cx('links')}>
                            <div>
                                {/* Khi bấm Forgot Password → mở modal */}
                                <div
                                    className={cx('forgot')}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowForgotModal(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Forgot Password
                                </div>
                            </div>
                            <div className={cx('google')}>
                                <div>
                                    This is your first time?{' '}
                                    <div onClick={() => nav(routes.register)} className={cx('register')}>
                                        Register
                                    </div>
                                </div>
                                Or continue with <span className={cx('google-icon')}>G</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
        </div>
    );
}

export default LoginPage;
