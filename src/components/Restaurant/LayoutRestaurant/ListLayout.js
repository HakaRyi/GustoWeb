import React, { useEffect, useState, useCallback } from 'react';
import { customFetch } from '~/config/customFetch';
import CardLayout from './CardLayout';
import styles from './ListLayout.module.scss';

const ListLayout = ({ onSuccess }) => {
    const [layouts, setLayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const layoutsPerPage = 6;

    const fetchLayouts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customFetch('https://localhost:7176/api/RestaurantLayout/getByMyRestaurant', {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Lỗi khi lấy danh sách bố cục');
            const data = await res.json();
            setLayouts(data);
        } catch (error) {
            console.error('Fetch layouts failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLayouts();
        if (onSuccess) {
            onSuccess(fetchLayouts);
        }
    }, [fetchLayouts, onSuccess]);

    const handleDeleteSuccess = (layoutId) => {
        setLayouts((prev) => prev.filter((layout) => layout.layoutId !== layoutId));
    };

    // Pagination
    const totalPages = Math.ceil(layouts.length / layoutsPerPage);
    const startIndex = (currentPage - 1) * layoutsPerPage;
    const currentLayouts = layouts.slice(startIndex, startIndex + layoutsPerPage);

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

    if (loading) return <div className={styles.loading}>Đang tải danh sách bố cục...</div>;

    return (
        <div className={styles.listLayoutWrapper}>
            <div className={styles.listLayoutContainer}>
                {currentLayouts.length === 0 ? (
                    <p>Chưa có bố cục nào.</p>
                ) : (
                    currentLayouts.map((layout) => (
                        <CardLayout
                            key={layout.layoutId}
                            layout={layout}
                            onDeleteSuccess={handleDeleteSuccess}
                            onSuccess={fetchLayouts}
                        />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        ← Trước
                    </button>
                    <span>
                        Trang {currentPage}/{totalPages}
                    </span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        Sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListLayout;
