import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './Form.module.scss'; // Dùng chung file style cho cả 2 form
import { customFetch } from '~/config/customFetch';
import ResultModal from '~/components/Modals/ResultModal';

const cx = classNames.bind(styles);

function ChangePasswordForm() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const initialValues = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
        newPassword: Yup.string()
            .required('Vui lòng nhập mật khẩu mới')
            .matches(
                /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                'Mật khẩu phải có ít nhất 8 ký tự, 1 số và 1 ký tự đặc biệt.',
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
            .required('Vui lòng xác nhận mật khẩu mới'),
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        // TODO: Gọi API đổi mật khẩu ở đây
        const changePassword = async () => {
            try {
                setLoadingVisible(true);
                var res = await customFetch(`https://localhost:7176/api/Account/change-password`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                if (res.ok) {
                    setResult({ visible: true, success: true, message: 'Đổi mật khẩu thành công' });
                    setSubmitting(false);
                    resetForm();
                } else {
                    setResult({ visible: true, success: false, message: 'Mật Khẩu hiện tại không chính xác' });
                    setSubmitting(false);
                }
            } catch (err) {
                setResult({ visible: true, success: false, message: 'Mật Khẩu hiện tại không chính xác' });
            } finally {
                setLoadingVisible(false);
            }
        };

        changePassword();
    };

    return (
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className={cx('form')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                            <Field
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                className={cx('form-field')}
                            />
                            <ErrorMessage name="currentPassword" component="div" className={cx('error-message')} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <Field type="password" id="newPassword" name="newPassword" className={cx('form-field')} />
                            <ErrorMessage name="newPassword" component="div" className={cx('error-message')} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={cx('form-field')}
                            />
                            <ErrorMessage name="confirmPassword" component="div" className={cx('error-message')} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className={cx('submit-button')}>
                            {isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                        </button>
                    </Form>
                )}
            </Formik>
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </>
    );
}

export default ChangePasswordForm;
