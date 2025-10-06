import { Formik, Form, Field , ErrorMessage} from 'formik'
import React from 'react'
import className from 'classnames/bind'
import styles from './RegisterForm.module.scss'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import routes from '~/config/route'

const cx = className.bind(styles)

function RegisterForm() {
  const navigate = useNavigate();

    const initialValues = {
      userName: '',
      phone:'',
      password: '',
      confirmPassword:'',
      roleId: 1
    }

    const handleSubmit = async (values) => {
      try{
        const response = await fetch("https://localhost:7176/api/Account/signUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Registration successful:", data);
          try{
              const loginData ={
                userName: values.userName,
                password: values.password
              }
              const loginResponse = await fetch("https://localhost:7176/api/Account/signIn",{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginData),
            });

              if(loginResponse.ok){
                navigate(routes.home);
              }
          }catch(loginError){
            console.error("Login failed:", loginError);
            navigate(routes.login);
          }
        }
      }catch(error){
        alert("Đăng ký thất bại!");
      }
    }

    const validationSchema = Yup.object({
      userName: Yup.string().required('Required'),
      phone: Yup.string().matches(/^[\d]{10,11}$/, 'Phone number is not valid').required('Required'),
      password: Yup.string().matches(/^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/, 'Password must be at least 8 characters long and include at least one number and one special character.').required('Required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password does not match').required('Required'),
    })

  return (
    <div className={cx('wrapper')}>
      <div className={cx('form-wrapper')}>
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        >
            <Form className={cx("form")}>
              <label htmlFor='userName'>Username</label>
              <Field type='text' id='userName' name='userName' />
              <ErrorMessage name="userName" component="div" className={cx('error')} />
              <br />
              <label htmlFor='phone'>Phone</label>
              <Field type='text' id='phone' name='phone'/>
              <ErrorMessage name="phone" component="div" className={cx('error')} />
              <br />
              <label htmlFor='password'>Password</label>
              <Field type='password' id='password' name='password' />
              <ErrorMessage name="password" component="div" className={cx('error')} />
              <br />
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <Field type='password' id='confirmPassword' name='confirmPassword' />
              <ErrorMessage name="confirmPassword" component="div" className={cx('error')} />
              <br />
              <button type='submit'>Sign Up</button>
            </Form>
            </Formik>
          </div>
    </div>
  )
}

export default RegisterForm
