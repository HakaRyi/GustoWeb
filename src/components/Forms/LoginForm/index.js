import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import className from 'classnames/bind';
import styles from './loginform.module.scss';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/route';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { customFetch } from '~/config/customFetch';
const cx = className.bind(styles);

function LoginForm() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValues = {
        userName: '',
        password: '',
    };
    const validationSchema = Yup.object({
        userName: Yup.string().required('Required'),
        password: Yup.string()
            .matches(
                /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                'Password must be at least 8 characters long and include at least one number and one special character.',
            )
            .required('Required'),
    });

    const handleSubmit = async (values) => {
        try {
            setLoadingVisible(true);
            const loginData = {
                userName: values.userName,
                password: values.password,
            };
            const loginResponse = await fetch('https://gustoweb.onrender.com/api/Account/signIn', {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            if (loginResponse.ok) {
                console.log('đăng nhập thành công với user:', values.userName);
                dispatch(loginSuccess({ user: { username: values.userName } }));
                setLoadingVisible(false);
                navigate(routes.home);
            } else {
                setLoadingVisible(false);
                setResult({ visible: true, success: false, message: 'Sai tài khoản hoặc mật khẩu' });
            }
        } catch (loginError) {
            setLoadingVisible(false);
            setResult({ visible: true, success: false, message: loginError });
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoadingVisible(true);
            console.log('🔐 Google Success:', credentialResponse);

            const response = await customFetch('https://gustoweb.onrender.com/api/Account/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    idToken: credentialResponse.credential,
                }),
            });

            if (response.ok) {
                console.log('✅ Google login thành công!');

                // Lấy thông tin user từ Google (hoặc từ API response)
                const googleUser = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                const userData = {
                    username: googleUser.email,
                    email: googleUser.email,
                    fullName: googleUser.name,
                };

                dispatch(loginSuccess({ user: userData }));
                setLoadingVisible(false);
                navigate(routes.home);
            } else {
                throw new Error('Google login failed');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setLoadingVisible(false);
            setResult({
                visible: true,
                success: false,
                message: 'Đăng nhập Google thất bại!',
            });
        }
    };
    const handleGoogleError = () => {
        console.log('Google login error');
        setResult({
            visible: true,
            success: false,
            message: 'Đăng nhập Google thất bại!',
        });
    };
    return (
        <div className={cx('form-wrapper')}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                <Form className={cx('form')}>
                    <label className={styles.label} htmlFor="userName">
                        Username
                    </label>
                    <Field type="text" id="userName" name="userName" />
                    <ErrorMessage name="userName" component="div" className={cx('error')} />
                    <br />
                    <label className={styles.label} htmlFor="password">
                        Password
                    </label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage name="password" component="div" className={cx('error')} />
                    <br />
                    <button type="submit">Login</button>
                </Form>
            </Formik>
            <div className={cx('google-login-divider')}>
                <span>OR</span>
            </div>

            <div className={cx('google-login-container')}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    size="large"
                    text="sign_in_with"
                    shape="rectangular"
                    logo_alignment="left"
                    width="100%"
                    type="standard"
                />
            </div>
            <LoadingModal visible={loadingVisible} message="Đồ ăn đang đươc chuẩn bị..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default LoginForm;
