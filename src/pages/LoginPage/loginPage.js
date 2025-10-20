import React, { useState } from 'react';
import className from 'classnames/bind';
import styles from './loginPage.module.scss';
import routes from '~/config/route';
import LoginForm from '../../components/Forms/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '~/components/Modals/ForgotPasswordModal';
import { GoogleOAuthProvider } from '@react-oauth/google';

const cx = className.bind(styles);

function LoginPage() {
    const nav = useNavigate();
    const [showForgotModal, setShowForgotModal] = useState(false);
    const GOOGLE_CLIENT_ID = '920991502317-22vj9rj4iki2cd963qbr4kqjj911dfrd.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                                    {/* ✅ THÊM GOOGLE BUTTON VÀO ĐÂY */}
                                    {/* <div style={{ marginTop: '12px' }}>
                                        Or continue with{' '}
                                        <span style={{ color: '#ea4335', fontWeight: 'bold' }}>Google</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;
