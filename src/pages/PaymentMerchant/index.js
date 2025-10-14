import React from 'react';
import style from './PaymentMerchant.module.scss';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '~/config/customFetch';
import routes from '~/config/route';

function PaymentMerchantRequest({ destinationUrl }) {
    const navigate = useNavigate();
    const BankInfoSchema = Yup.object().shape({
        // Đổi tên các trường để khớp với initialValues và <Field>
        bankAccountName: Yup.string().min(2, 'Tên quá ngắn!').required('Vui lòng nhập tên chủ tài khoản'),
        bank: Yup.string().required('Vui lòng nhập tên ngân hàng'),
        bankNo: Yup.string()
            .matches(/^[0-9]+$/, 'Số tài khoản chỉ được chứa chữ số')
            .min(8, 'Số tài khoản không hợp lệ!')
            .required('Vui lòng nhập số tài khoản'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        // Giả lập việc gọi API để lưu thông tin
        const uploadBankAccount = async () => {
            try {
                const res = await customFetch('https://localhost:7176/api/PaymentMerchant', {
                    method: 'POST',
                    headers: {
                        Accept: '*/*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (res.ok) navigate(routes.resProfile);
            } catch (ex) {
            } finally {
                setSubmitting(false);
            }
        };
        uploadBankAccount();
    };
    return (
        <div className={style.wrapper}>
            <div className={style.overlay}>
                <div className={style.container}>
                    <h2 className={style.title}>Cập nhật thông tin thanh toán</h2>
                    <p className={style.description}>
                        Những thông tin này cần chính xác tuyệt đối để đảm bảo quyền lợi thanh toán của bạn.
                    </p>

                    <Formik
                        initialValues={{
                            bankAccountName: '',
                            bank: '',
                            bankNo: '',
                        }}
                        validationSchema={BankInfoSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className={style.form}>
                                <div className={style.formGroup}>
                                    <label htmlFor="bankAccountName">Tên chủ tài khoản</label>
                                    <Field
                                        id="bankAccountName"
                                        name="bankAccountName"
                                        placeholder="Ví dụ: NGUYEN VAN A"
                                        className={style.input}
                                    />
                                    <ErrorMessage name="bankAccountName" component="div" className={style.error} />
                                </div>

                                <div className={style.formGroup}>
                                    <label htmlFor="bank">Tên Ngân Hàng</label>
                                    <Field
                                        id="bank"
                                        name="bank"
                                        placeholder="Ví dụ: Techcombank"
                                        className={style.input}
                                    />
                                    <ErrorMessage name="bank" component="div" className={style.error} />
                                </div>

                                <div className={style.formGroup}>
                                    <label htmlFor="bankNo">Số Tài Khoản</label>
                                    <Field
                                        id="bankNo"
                                        name="bankNo"
                                        type="text"
                                        placeholder="Nhập số tài khoản ngân hàng"
                                        className={style.input}
                                    />
                                    <ErrorMessage name="bankNo" component="div" className={style.error} />
                                </div>

                                <div className={style.buttonGroup}>
                                    <button
                                        type="button"
                                        className={`${style.button} ${style.backButton}`}
                                        onClick={() => navigate(-1)}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`${style.button} ${style.submitButton}`}
                                    >
                                        {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default PaymentMerchantRequest;
