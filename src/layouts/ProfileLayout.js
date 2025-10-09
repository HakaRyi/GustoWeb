import React from 'react'

import classNames from 'classnames/bind'
import style from './ProfileLayout.module.scss'

//Components:
import Header from '~/components/GlobalStyle/Header'
import { Outlet } from 'react-router-dom'
import ProfileSideBar from '~/components/SideBars/ProfileSideBar'

const cx = classNames.bind(style)
function ProfileLayout() {
  return (
    <div>
      <div className={cx("container")}>
        <Header />
        <main className={cx('main-content')}>
          <ProfileSideBar className={cx('sidebar')} />
          <div className={cx('content')}>
             <Outlet />
          </div>
        </main>
    </div>
    </div>
  )
}

export default ProfileLayout
