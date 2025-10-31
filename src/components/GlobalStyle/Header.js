import React, { useEffect } from 'react';
import styles from '../../styles/Header.module.scss';
import routes from '~/config/route';
import { Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
                const res = await fetch('https://gustoweb.onrender.com/api/Account/get-me', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const userData = await res.json();
                    console.log('Auto login từ cookie:', userData);
                    console.log('user có role là:', user?.account?.roleId);
                    dispatch(setUser(userData));
                } else if (res.status === 401) {
                    console.log('Chưa đăng nhập (401)');
                    dispatch(logoutSuccess());
                } else if (res.status === 403) {
                    console.log('Không có quyền truy cập (403)');
                    dispatch(logoutSuccess());
                } else {
                    console.warn('Lỗi khi gọi /get-me:', res.status);
                    dispatch(logoutSuccess());
                }
            } catch (err) {
                console.error('Không thể kết nối tới backend:', err.message);
                dispatch(logoutSuccess());
            }
        };
        fetchUser();
    }, [dispatch]);

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
                    <Link to="/" className={styles.navLink} title="Trang chủ">
                        <FaHome className={styles.navIcon} />
                        <span className={styles.navText}>Trang chủ</span>
                    </Link>
                    <Link to="/about" className={styles.navLink} title="Về chúng tôi">
                        <FaInfoCircle className={styles.navIcon} />
                        <span className={styles.navText}>Về chúng tôi</span>
                    </Link>
                    <Link to="/contact" className={styles.navLink} title="Liên hệ">
                        <FaPaperPlane className={styles.navIcon} />
                        <span className={styles.navText}>Liên hệ</span>
                    </Link>

                    {!isAuthenticated ? (
                        <Link to={routes.login} className={`${styles.navLink} ${styles.loginBtn}`} title="Đăng nhập">
                            <FaSignInAlt className={styles.navIcon} />
                            <span className={styles.navText}>Đăng nhập</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/restaurants" className={styles.navLink} title="Đặt món ngay">
                                <FaShoppingCart className={styles.navIcon} />
                                <span className={styles.navText}>Đặt món ngay</span>
                                {cartCount > 0 && <Badge className={styles.cartBadge}>{cartCount}</Badge>}
                            </Link>
                            <Link to={profileRoute} className={styles.navLink} title="Hồ sơ">
                                <FaAddressBook className={styles.navIcon} />
                                <span className={styles.navText}>Hồ sơ</span>
                            </Link>
                        </>
                    )}
                </Nav>
            </div>
        </header>
    );
}

export default Header;
