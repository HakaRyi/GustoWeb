import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import style from './FavouritePage.module.scss';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';
import CardRestaurant from '~/components/GlobalStyle/CardRestaurant';
import LoadingModal from '~/components/Modals/LoadingModal'; // Giả sử bạn có component này
import EmptyState from '~/components/EmptyState'; // Và component này
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';

const cx = classNames.bind(style);

function FavouritePage() {
    const [result, setResult] = useState({ visible: false, success: false, message: '' });

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useSelector((state) => state.auth); // Lấy thông tin user từ Redux

    const fetchFavourites = async () => {
        try {
            setLoading(true);
            var res = await customFetch('https://gustoweb.onrender.com/api/Favourite/diner', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
                return;
            }
            const data = await res.json();
            console.log(data);
            setRestaurants(data);
        } catch (err) {
            setError('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFavourites();
    }, [user]); // Chạy lại khi user thay đổi

    const handleUnlike = (restaurantId) => {
        // Optimistic UI: Cập nhật UI trước khi gọi API

        const unlikeRestaurant = async () => {
            try {
                var res = await customFetch(`https://gustoweb.onrender.com/api/Favourite/${restaurantId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
                    setResult({ visible: true, success: true, message: 'Đã bỏ thích nhà hàng.' });
                } else {
                    setResult({ visible: true, success: false, message: 'Không thể bỏ thích. Vui lòng thử lại.' });
                }
            } catch (err) {
                setError('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
                fetchFavourites();
            }
            console.log(`Unliked restaurant with id: ${restaurantId}`);
        };

        unlikeRestaurant();
    };

    if (error) {
        return (
            <div className={cx('container')}>
                <div className={cx('error-message')}>{error}</div>
            </div>
        );
    }

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>Nhà Hàng Yêu Thích</h1>
                <p>Bạn đã lưu {restaurants.length} nhà hàng</p>
            </div>

            {/* Thanh công cụ: Search, Filter, Sort */}
            <div className={cx('toolbar')}>
                <div className={cx('search-bar')}>
                    <FaSearch className={cx('search-icon')} />
                    <input type="text" placeholder="Tìm kiếm trong danh sách yêu thích..." />
                </div>
                <div className={cx('actions')}>
                    <button className={cx('action-btn')}>
                        <BsFilterLeft /> Lọc
                    </button>
                    <select className={cx('sort-select')}>
                        <option value="newest">Mới nhất</option>
                        <option value="rating">Đánh giá cao nhất</option>
                        <option value="name_asc">Tên A-Z</option>
                    </select>
                </div>
            </div>

            {restaurants.length === 0 ? (
                <EmptyState message="Bạn chưa có nhà hàng yêu thích nào." actionText="Khám phá ngay" actionLink="/" />
            ) : (
                <div className={cx('list-container')}>
                    {restaurants.map((item) => (
                        <div className={cx('restaurant-wrapper')} key={item.id}>
                            <CardRestaurant restaurant={item} view="grid" />
                            <button
                                className={cx('unlike-btn')}
                                onClick={() => handleUnlike(item.accountId)}
                                title="Bỏ thích"
                            >
                                <FaHeart className={cx('unlike-icon')} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <LoadingModal visible={loading} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </div>
    );
}

export default FavouritePage;
