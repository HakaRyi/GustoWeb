import { Formik, Form, Field , ErrorMessage} from 'formik'
import React from 'react'
import className from 'classnames/bind'
import styles from './loginform.module.scss'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import routes from '~/config/route'

const cx = className.bind(styles)

function LoginForm() {
  const navigate = useNavigate();

  const initialValues = {
    userName: '',
    password: '',
  }
  const validationSchema = Yup.object({
        userName: Yup.string().required('Required'),
        password: Yup.string().matches(/^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/, 'Password must be at least 8 characters long and include at least one number and one special character.').required('Required'),
      })

  const handleSubmit = async (values) => {
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
  return (
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
        <label htmlFor='password'>Password</label>
        <Field type='password' id='password' name='password' />
        <ErrorMessage name="password" component="div" className={cx('error')} />
        <br />
        <button type='submit'>Login</button>
      </Form>
      </Formik>
    </div>
  )
}

export default LoginForm
