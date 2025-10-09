import classNames from 'classnames/bind'
import style from './ProfileSideBar.module.scss'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'

const cx = classNames.bind(style)

function ProfileSideBar() {
  return (
    <div className={cx('sidebar-wrapper')}>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cx("sidebar-item", { active: isActive })
        }
      >
        <FontAwesomeIcon icon={faUser} />
      </NavLink>
    </div>
  )
}

export default ProfileSideBar
