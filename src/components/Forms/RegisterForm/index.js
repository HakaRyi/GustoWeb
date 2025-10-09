import { Formik, Form, Field , ErrorMessage} from 'formik'
import React, { useState } from 'react'
import className from 'classnames/bind'
import styles from './RegisterForm.module.scss'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import routes from '~/config/route'
import LoadingModal from '~/components/Modals/LoadingModal'
import ResultModal from '~/components/Modals/ResultModal'

const cx = className.bind(styles)

function RegisterForm() {
  const navigate = useNavigate();
    const [loadingVisible, setLoadingVisible] = useState(false);
  const [result, setResult] = useState({ visible: false, success: false, message: "" });

    const initialValues = {
      userName: '',
      phone:'',
      password: '',
      confirmPassword:'',
      roleId: 1
    }

    const handleSubmit = async (values) => {
      try{
        setLoadingVisible(true)
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
              credentials: "include",
              body: JSON.stringify(loginData),
            });

              if(loginResponse.ok){
                setLoadingVisible(false)
                navigate(routes.home);
              }
          }catch(loginError){
            setResult({ visible: true, success: false, message: loginError });
            navigate(routes.login);
          }
        }
      }catch(error){
        setLoadingVisible(false)
        setResult({ visible: true, success: false, message: "Đăng ký không thành công" });
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
      <LoadingModal visible={loadingVisible} message="Đồ ăn đang đươc chuẩn bị..." />
      <ResultModal
        visible={result.visible}
        success={result.success}
        message={result.message}
        onClose={() => setResult((s) => ({ ...s, visible: false }))}
      />
    </div>
  )
}

export default RegisterForm
