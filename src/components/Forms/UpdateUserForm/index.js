import classNames from 'classnames/bind'
import style from './UpdateUserForm.module.scss'
import { Formik, Form, Field , ErrorMessage} from 'formik'
import * as Yup from 'yup'

import React from 'react'

const cx = classNames.bind(style)

function UpdateUserForm() {
    const initialValues = {
        phone: '0357732955',
        age: 28,
        address: 'Binh Thanh, Ho Chi Minh',
        gender: 'Female',
        email: 'gusto.cpn@gmail.com',
        job: 'Software Engineering',
        description: 'Hi my name is Haiju Moon from Gusto'
    }

    const validationSchema = Yup.object({
        phone: Yup.string()
            .required("Số điện thoại là bắt buộc")
            .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),

        age: Yup.number()
            .required("Tuổi là bắt buộc")
            .min(18, "Tuổi phải từ 18 trở lên")
            .max(100, "Tuổi không được vượt quá 100"),

        address: Yup.string()
            .required("Địa chỉ là bắt buộc")
            .min(5, "Địa chỉ quá ngắn"),

        gender: Yup.string()
            .required("Giới tính là bắt buộc")
            .oneOf(["Male", "Female", "Other"], "Giới tính không hợp lệ"),

        email: Yup.string()
            .required("Email là bắt buộc")
            .email("Email không hợp lệ"),

        job: Yup.string()
            .required("Công việc là bắt buộc")
            .min(2, "Tên công việc quá ngắn"),

        description: Yup.string()
            .required("Mô tả là bắt buộc")
            .min(10, "Mô tả quá ngắn"),
        });
  return (
    <div className={cx('wrapper')}>
        <div className={cx('form-wrapper')}>
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            // onSubmit={handleSubmit}
            >
            <Form className={cx("form")}>

                <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                    <label htmlFor="phone">📞 Phone</label>
                    <Field id="phone" name="phone" type="text" />
                    <ErrorMessage name="phone" component="div" className={cx("error")} />
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="age">🎂 Age</label>
                    <Field id="age" name="age" type="number" />
                    <ErrorMessage name="age" component="div" className={cx("error")} />
                </div>
                </div>

                <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                    <label htmlFor="address">🏠 Address</label>
                    <Field id="address" name="address" type="text" />
                    <ErrorMessage name="address" component="div" className={cx("error")} />
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="gender">⚧ Gender</label>
                    <Field as="select" id="gender" name="gender">
                    <option value="">-- Select gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className={cx("error")} />
                </div>
                </div>

                <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                    <label htmlFor="email">📧 Email</label>
                    <Field id="email" name="email" type="email" />
                    <ErrorMessage name="email" component="div" className={cx("error")} />
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="job">💼 Job</label>
                    <Field id="job" name="job" type="text" />
                    <ErrorMessage name="job" component="div" className={cx("error")} />
                </div>
                </div>

                <div className={cx("form-group")}>
                <label htmlFor="description">📝 Description</label>
                <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Giới thiệu ngắn gọn về bạn..."
                />
                <ErrorMessage name="description" component="div" className={cx("error")} />
                </div>

                <button type="submit" className={cx("submitBtn")}>Lưu thông tin</button>
            </Form>
            </Formik>
        </div>
        </div>
        )
        }

export default UpdateUserForm
