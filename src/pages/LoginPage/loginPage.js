import React from 'react'
import className from 'classnames/bind'
import styles from './loginPage.module.scss'

//Components:
import LoginForm from '../../components/Forms/LoginForm'

const cx = className.bind(styles)


function LoginPage() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("overlay")}>
        <div className={cx("container")}>
          <div className={cx("header")}>
            <h2>Welcome to <span>Gusto</span></h2>
          </div>
          <div className={cx("content")}>
            <LoginForm />
            <div className={cx("links")}>
              <p><a href="#" className={cx("forgot")}>Forgot Password</a></p>
              <div className={cx("google")}>
              <p>
                This is your first time?{" "}
                <a href="#" className={cx("register")}>Register</a>
              </p>
                Or continue with <span className={cx("google-icon")}>G</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
