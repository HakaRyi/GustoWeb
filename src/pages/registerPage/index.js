
import React from 'react'
import className from 'classnames/bind'
import styles from './registerPage.module.scss'

//Components
import RegisterForm from '../../components/Forms/RegisterForm'

const cx = className.bind(styles)

function RegisterPage() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('infor-container')}>
        <div className={cx('overlay')}>
            <h3 className={cx('title')}>Book A Table 24/7</h3>
            <p className={cx('desc1')}>Easily book anytime, anywhere with just a few simple steps. No more worrying about running out of tables during peak hours, you are always proactive in every appointment.</p>

            <h3 className={cx('title')}>High Quality Food</h3>
            <p className={cx('desc1')}>Made from fresh ingredients, carefully selected every day, bringing a complete and flavorful culinary experience.</p>

            <h3 className={cx('title')}>Endless Choices</h3>
            <p className={cx('desc1')}>From delicate appetizers to rich main courses or sweet desserts, our diverse menu caters to every taste and preference.</p>
        </div>
        <div className={cx('form-container')}>
            <h2 className={cx('form-title')}>Sign Up</h2>
            <div className={cx('formDescription')}>Ready to start your travel to Food Kingdom? Hope you have the most interesting experiences. Thank you for choossing GUSTO</div>
            <RegisterForm />
            <button className={cx('register-btn')}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
