import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, InputGroup, FormControl, Spinner, Badge, Modal, Pagination } from 'react-bootstrap';
import { FaSearch, FaTrashAlt, FaStar, FaUserSecret, FaUser, FaUtensils, FaComments } from 'react-icons/fa';
import styles from './FeedbackManagement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// 👇 API ADMIN MỚI
const API_URL = 'https://gustoweb.onrender.com/api/admin/AdminFoodReview';
const ITEMS_PER_PAGE = 7;

const FeedbackManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // State cho Modal xem ảnh
    const [showImageModal, setShowImageModal] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);

    // Lấy danh sách khi vào trang
    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL); // Gọi API GetAll của Admin
            setReviews(res.data);
        } catch (error) {
            console.error('Lỗi tải đánh giá:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- XÓA REVIEW ---
    const handleDelete = async (reviewId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.')) return;

        try {
            await axios.delete(`${API_URL}/${reviewId}`);
            alert('Đã xóa thành công!');
            fetchAllReviews(); // Load lại danh sách
        } catch (error) {
            console.error('Lỗi xóa:', error);
            alert('Xóa thất bại!');
        }
    };

    // --- LOGIC LỌC (Tìm theo Tên món, Tên người dùng, Nội dung) ---
    const filteredReviews = reviews.filter((r) => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            (r.foodName && r.foodName.toLowerCase().includes(lowerTerm)) ||
            (r.dinerName && r.dinerName.toLowerCase().includes(lowerTerm)) ||
            (r.description && r.description.toLowerCase().includes(lowerTerm))
        );
    });

    // --- PHÂN TRANG ---
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Helper: Render sao
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} color={index < rating ? '#ffc107' : '#e4e5e9'} size={14} />
        ));
    };

    // Helper: Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return (
            new Date(dateString).toLocaleDateString('vi-VN') + ' ' + new Date(dateString).toLocaleTimeString('vi-VN')
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>⭐ Quản lý Đánh Giá & Feedback</h3>
            </div>

            {/* THANH TÌM KIẾM */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <InputGroup style={{ maxWidth: '500px' }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Tìm theo món ăn, người dùng hoặc nội dung..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border-start-0 shadow-none"
                    />
                </InputGroup>
                <div className="text-muted small">
                    Tổng: <strong>{filteredReviews.length}</strong> đánh giá
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#ID</th>
                                <th style={{ width: '20%' }}>Món ăn</th>
                                <th style={{ width: '20%' }}>Người dùng</th>
                                <th style={{ width: '15%' }}>Đánh giá</th>
                                <th style={{ width: '25%' }}>Nội dung</th>
                                <th>Ảnh</th>
                                <th className="text-center">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReviews.length > 0 ? (
                                currentReviews.map((r) => (
                                    <tr key={r.reviewId}>
                                        <td className="text-muted">#{r.reviewId}</td>
                                        <td>
                                            <div className="fw-bold text-primary">
                                                <FaUtensils className="me-1 mb-1" /> {r.foodName}
                                            </div>
                                            <small className="text-muted">{formatDate(r.date)}</small>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {r.isAnonymous ? (
                                                    <FaUserSecret size={18} />
                                                ) : (
                                                    <FaUser size={18} className="text-info" />
                                                )}
                                                <span>{r.isAnonymous ? 'Ẩn danh' : r.dinerName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex">{renderStars(r.rating)}</div>
                                            <small className="text-muted fw-bold">{r.rating}/5</small>
                                        </td>
                                        <td>
                                            <p className={styles.comment}>
                                                {r.description || (
                                                    <span className="text-muted fst-italic">Không có nội dung</span>
                                                )}
                                            </p>
                                        </td>
                                        <td>
                                            {r.imageUrl ? (
                                                <img
                                                    src={r.imageUrl}
                                                    alt="review"
                                                    className={styles.reviewThumb}
                                                    onClick={() => {
                                                        setPreviewImage(r.imageUrl);
                                                        setShowImageModal(true);
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-muted small">-</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(r.reviewId)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        Không tìm thấy đánh giá nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                                key={i}
                                active={currentPage === i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}

            {/* MODAL XEM ẢNH */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
                <Modal.Body className="p-0 text-center bg-dark rounded">
                    <img src={previewImage} alt="Full Review" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FeedbackManagement;
