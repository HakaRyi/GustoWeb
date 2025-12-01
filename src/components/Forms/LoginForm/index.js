import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import className from "classnames/bind";
import styles from "./loginform.module.scss";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import routes from "~/config/route";

const cx = className.bind(styles);

function LoginForm() {
  const navigate = useNavigate();

  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    userName: Yup.string().required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
        "Password must be at least 8 characters long and include at least one number and one special character."
      )
      .required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      const loginData = {
        userName: values.userName,
        password: values.password,
      };

      const response = await fetch("https://localhost:7176/api/Account/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();

        // Giả sử API trả về dạng:
        // { token: "...", role: 3, userName: "admin" }
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.userName);

        // Kiểm tra role để điều hướng
        if (data.role === 3) {
          navigate(routes.admin);
        } else {
          navigate(routes.home);
        }
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className={cx("form-wrapper")}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={cx("form")}>
          <label htmlFor="userName">Username</label>
          <Field type="text" id="userName" name="userName" />
          <ErrorMessage name="userName" component="div" className={cx("error")} />
          <br />
          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" className={cx("error")} />
          <br />
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
