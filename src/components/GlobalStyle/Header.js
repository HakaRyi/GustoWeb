import React, { useEffect } from 'react';
import styles from '../../styles/Header.module.scss';
import routes from '~/config/route';
import { Nav, Badge } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';
import { FaHome, FaInfoCircle, FaAddressBook, FaPaperPlane, FaShoppingCart, FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess, setUser } from '~/redux/authSlice';

const logo = process.env.PUBLIC_URL + '/LOGOGUSTO.png';

function Header({ cartCount = 0 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // ✅ Khi app load, tự check user từ cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost:7176/api/Account/get-me", {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          console.log("Auto login từ cookie:", userData);
          console.log("user có role là:", user?.account?.roleId);
          dispatch(setUser(userData));
        } else if (res.status === 401) {
          console.log("Chưa đăng nhập (401)");
          dispatch(logoutSuccess());
        } else if (res.status === 403) {
          console.log("Không có quyền truy cập (403)");
          dispatch(logoutSuccess());
        } else {
          console.warn("Lỗi khi gọi /get-me:", res.status);
          dispatch(logoutSuccess());
        }
      } catch (err) {
        console.error("Không thể kết nối tới backend:", err.message);
        dispatch(logoutSuccess());
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleLogout = async () => {
    console.log("Đang logout...");
    try {
      console.log("Đã logout với user", user?.account?.userName);
      await fetch("https://localhost:7176/api/Account/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout backend lỗi:", e);
    } finally {
      dispatch(logoutSuccess());
      navigate("/login");
    }
  };

  // Xác định route cho "Hồ sơ" dựa trên role
  const profileRoute = user?.account?.roleId === 2 ? routes.resProfile : routes.profile;

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <Link to="/">
            <img src={logo} alt="Gusto Logo" className={styles.logoImg} />
          </Link>
        </div>

        <Nav className={styles.navbar}>
          <Link to="/" className={styles.navLink}>
            <FaHome className={styles.navIcon} /> Trang chủ
          </Link>
          <Link to="/about" className={styles.navLink}>
            <FaInfoCircle className={styles.navIcon} /> Về chúng tôi
          </Link>
          <Link to="/contact" className={styles.navLink}>
            <FaPaperPlane className={styles.navIcon} /> Liên hệ
          </Link>

          {!isAuthenticated ? (
            <Link to={routes.login} className={`${styles.navLink} ${styles.loginBtn}`}>
              <FaSignInAlt /> Đăng nhập
            </Link>
          ) : (
            <>
              <Link to={profileRoute} className={styles.navLink}>
                <FaAddressBook /> Hồ sơ
              </Link>
              <Link to="/myCart" className={styles.navLink}>
                <FaShoppingCart /> Món đã đặt
                {cartCount > 0 && <Badge className={styles.cartBadge}>{cartCount}</Badge>}
              </Link>
              <button onClick={handleLogout} className={styles.navLink}>Đăng xuất</button>
            </>
          )}
        </Nav>
      </div>
    </header>
  );
}

export default Header;
