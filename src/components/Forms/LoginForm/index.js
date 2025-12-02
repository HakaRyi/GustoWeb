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
import { jwtDecode } from 'jwt-decode';

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
                body: JSON.stringify(loginData),
            });

            if (loginResponse.ok) {
                const data = await loginResponse.json(); 

             console.log('✅ Server Response:', data);

                // 👇👇👇 XỬ LÝ ĐẶC BIỆT KHI SERVER TRẢ VỀ TRUE 👇👇👇
                if (data === true && values.userName === 'admin') {
                    console.log("🔥 Đăng nhập Admin thành công (Mode: Hardcode)");
                    
                    // Tự tạo dữ liệu giả lập cho Admin
                    localStorage.setItem("token", "fake-admin-token"); 
                    localStorage.setItem("role", "Admin");
                    localStorage.setItem("userName", values.userName);
                    
                    dispatch(loginSuccess({ user: { username: values.userName, role: "Admin" } }));
                    
                    setLoadingVisible(false);
                    navigate('/admin'); // ✈️ Chuyển thẳng Admin
                    return; // Dừng hàm tại đây
                }
                // 👆👆👆 KẾT THÚC XỬ LÝ ĐẶC BIỆT 👆👆👆

                console.log('Đăng nhập thành công với user:', values.userName);
                
                dispatch(loginSuccess({ user: { username: values.userName } }));

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("userName", values.userName);

                setLoadingVisible(false);

                if (data.role === "Admin" || data.role === "admin" || data.role === 3) {
                    console.log("✈️ Role hợp lệ -> Chuyển sang ADMIN");
                    navigate('/admin');
                } else {
                  console.log("🏠 GO TO HOME PAGE");
                    navigate(routes.home);
                }
            } else {
                setLoadingVisible(false);
                setResult({ visible: true, success: false, message: 'Sai tài khoản hoặc mật khẩu' });
            }
        } catch (loginError) {
            setLoadingVisible(false);
            setResult({ visible: true, success: false, message: 'Lỗi kết nối server' });
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoadingVisible(true);

            const response = await customFetch('https://gustoweb.onrender.com/api/Account/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    idToken: credentialResponse.credential,
                }),
            });

            if (!response.ok) {
                throw new Error('Google login failed');
            }


            const googleUser = jwtDecode(credentialResponse.credential);

            const userData = {
                username: googleUser.email,
                email: googleUser.email,
                fullName: googleUser.name,
            };

            dispatch(loginSuccess({ user: userData }));
            setLoadingVisible(false);
            navigate(routes.home);
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
                    <Field type="text" id="userName" name="userName" className={cx('input-control')} />
                    <ErrorMessage name="userName" component="div" className={cx('error')} />
                    <br />
                    <label className={styles.label} htmlFor="password">
                        Password
                    </label>
                    <Field type="password" id="password" name="password" className={cx('input-control')} />
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
                    width="300"
                    type="standard"
                />
            </div>
            
            <LoadingModal visible={loadingVisible} message="Đang đăng nhập..." />
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