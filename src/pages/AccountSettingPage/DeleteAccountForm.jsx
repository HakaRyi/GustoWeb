import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './Form.module.scss'; // Dùng chung file style

const cx = classNames.bind(styles);

function DeleteAccountForm() {
    const initialValues = {
        password: '',
        confirm: false,
    };

    const validationSchema = Yup.object({
        password: Yup.string().required('Vui lòng nhập mật khẩu để xác nhận'),
        confirm: Yup.boolean().oneOf([true], 'Bạn phải đồng ý với điều khoản để tiếp tục'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        // TODO: Gọi API xóa tài khoản ở đây
        console.log('Xóa tài khoản với:', values);

        // Giả lập gọi API
        setTimeout(() => {
            alert('Tài khoản đã được xóa vĩnh viễn!');
            setSubmitting(false);
            // TODO: Dispatch action logout và chuyển hướng về trang chủ
        }, 1000);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className={cx('form')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="password">Nhập mật khẩu của bạn để xác nhận</label>
                        <Field type="password" id="password" name="password" className={cx('form-field')} />
                        <ErrorMessage name="password" component="div" className={cx('error-message')} />
                    </div>
                    <div className={cx('form-group', 'checkbox-group')}>
                        <Field type="checkbox" id="confirm" name="confirm" className={cx('checkbox')} />
                        <label htmlFor="confirm" className={cx('checkbox-label')}>
                            Tôi hiểu rằng hành động này không thể hoàn tác và tôi muốn xóa tài khoản của mình.
                        </label>
                        <ErrorMessage name="confirm" component="div" className={cx('error-message')} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className={cx('submit-button', 'danger-button')}>
                        {isSubmitting ? 'Đang xử lý...' : 'Xóa tài khoản của tôi'}
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default DeleteAccountForm;
