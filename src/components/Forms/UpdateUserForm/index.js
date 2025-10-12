import classNames from 'classnames/bind'
import style from './UpdateUserForm.module.scss'
import { Formik, Form, Field , ErrorMessage} from 'formik'
import * as Yup from 'yup'
import ImageUploader from '~/components/Cloundinary/ImageUploader'

import React, { useState } from 'react'
import { customFetch } from '~/config/customFetch'
import LoadingModal from '~/components/Modals/LoadingModal'
import ResultModal from '~/components/Modals/ResultModal'

const cx = classNames.bind(style)

function UpdateUserForm({initialValues, onProfileReload, isEditing, imgFile }) {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: "" });
    if (!initialValues) return null;

    const validationSchema = Yup.object({
      phone: Yup.string()
        .nullable()
        .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),

      age: Yup.number()
        .nullable()
        .min(18, "Tuổi phải từ 18 trở lên")
        .max(100, "Tuổi không được vượt quá 100"),

      address: Yup.string()
        .nullable()
        .min(5, "Địa chỉ quá ngắn"),

      gender: Yup.string()
        .nullable()
        .oneOf(["Male", "Female", "Other"], "Giới tính không hợp lệ"),

      email: Yup.string()
        .nullable()
        .email("Email không hợp lệ"),

      job: Yup.string()
        .nullable()
        .min(2, "Tên công việc quá ngắn"),

      description: Yup.string()
        .nullable()
        .min(10, "Mô tả quá ngắn"),
    });

    const handleSubmit = async (values) => {
    if (!isEditing) return
    try {
      setLoadingVisible(true);
      let imageUrl = initialValues.avatarUrl; // mặc định lấy ảnh cũ
      if (imgFile) {
        imageUrl = await ImageUploader(imgFile);
      }

    // Gắn link ảnh vào values
      const updatedValues = { ...values, avatarUrl: imageUrl };
      console.log("Submitting values:", updatedValues);
      const res = await customFetch("https://localhost:7176/api/DinerProfile", {
        method: "PUT",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      // Reload lại profile từ server
      if (onProfileReload) await onProfileReload();

      setResult({
        visible: true,
        success: true,
        message: "Cập nhật profile thành công 🍱",
      });
    } catch (ex) {
      console.error(ex);
      setResult({
        visible: true,
        success: false,
        message: "Cập nhật profile thất bại 😢",
      });
    } finally {
      setLoadingVisible(false);
    }
  };
  return (
    <div className={cx('wrapper')}>
        <div className={cx('form-wrapper')}>
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
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

              <button
                type="submit"
                className={cx("submitBtn")}
                style={{ visibility: isEditing ? "visible" : "hidden" }}
              >
                Lưu thông tin
              </button>

            </Form>
            </Formik>
        </div>
        <LoadingModal visible={loadingVisible} message="Đang cập nhật dữ liệu..." />
        <ResultModal
        visible={result.visible}
        success={result.success}
        message={result.message}
        onClose={() => setResult((s) => ({ ...s, visible: false }))}
        />
        </div>
    )
}

export default UpdateUserForm
