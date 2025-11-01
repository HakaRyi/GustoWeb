import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './ForgotPasswordModal.module.scss';
import { customFetch } from '~/config/customFetch';
import ResultModal from '../ResultModal';
import LoadingModal from '../LoadingModal';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [timer, setTimer] = useState(0);

    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval;
        if (isDisabled && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setIsDisabled(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isDisabled, timer]);

    const validationSchema = Yup.object({
        username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        if (isDisabled) return;
        setLoading(true);
        const sendPasswordReset = async () => {
            const res = await customFetch('https://gustoweb.onrender.com/api/Account/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setResult({
                    visible: true,
                    success: true,
                    message: 'Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hợp thư đến',
                });
            } else {
                setResult({
                    visible: true,
                    success: false,
                    message: 'Thông tin không hợp lệ hoặc tài khoản không tồn tại',
                });
            }
            setLoading(false);
        };

        setIsDisabled(true);
        setTimer(60);
        await sendPasswordReset();
        resetForm();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="forgotPasswordModal"
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            key="forgotPasswordBox"
                            className={styles.modal}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 120 }}
                        >
                            <button className={styles.closeBtn} onClick={onClose}>
                                <X size={22} />
                            </button>

                            <h2 className={styles.title}>Quên mật khẩu</h2>
                            <p className={styles.subtitle}>Vui lòng nhập đúng thông tin bạn đã đăng ký trước đó</p>

                            <Formik
                                initialValues={{ username: '', email: '' }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                <Form className={styles.form}>
                                    <label className={styles.label}>Tên đăng nhập:</label>
                                    <Field name="username" className={styles.input} />
                                    <ErrorMessage name="username" component="div" className={styles.error} />

                                    <label className={styles.label}>Email đăng ký tài khoản:</label>
                                    <Field name="email" className={styles.input} />
                                    <ErrorMessage name="email" component="div" className={styles.error} />

                                    <div className={styles.buttonGroup}>
                                        <button
                                            type="button"
                                            className={`${styles.btn} ${styles.btnGreen}`}
                                            onClick={onClose}
                                        >
                                            Đăng Nhập
                                        </button>
                                        <button
                                            type="submit"
                                            className={`${styles.btn} ${styles.btnYellow}`}
                                            disabled={isDisabled}
                                        >
                                            {isDisabled ? `Gửi lại sau ${timer}s` : 'Gửi'}
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <LoadingModal visible={loading} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </>
    );
};

export default ForgotPasswordModal;
