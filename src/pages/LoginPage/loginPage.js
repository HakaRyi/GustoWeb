import React, { useState } from 'react'
import axios from 'axios'
import className from 'classnames/bind'
import styles from './loginPage.module.scss'
import routes from '~/config/route'

//Components:
import LoginForm from '../../components/Forms/LoginForm'
import { Link, useNavigate } from 'react-router-dom'


const cx = className.bind(styles)


function LoginPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://localhost:7176/api/Auth/login", {
        userName: username,
        password: password
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        alert("Đăng nhập thành công!");

        if (res.data.role === "Admin") nav('/admin');
        else nav(routes.home);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("overlay")}>
        <div className={cx("container")}>
          <div onClick={() => nav(routes.home)} className={cx("header")}>
            <h2>Welcome to <span>Gusto</span></h2>
          </div>
          <div className={cx("content")}>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className={cx("input-group")}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div className={cx("input-group")}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>
                Login
              </button>
            </form>

            <div className={cx("links")}>
              <p><a href="#" className={cx("forgot")}>Forgot Password</a></p>
              <div className={cx("google")}>
                <p>
                  This is your first time?{" "}
                  <div onClick={() => nav(routes.register)} className={cx("register")}>Register</div>
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
