import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    Badge,
    Button,
    Spinner,
    InputGroup,
    FormControl,
    Pagination,
    Modal,
    Form,
    Row,
    Col,
} from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUser, FaStore, FaBan, FaEdit, FaSave } from 'react-icons/fa';
import styles from './BookingManagement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://gustoweb.onrender.com/api/admin/AdminBooking';
const ITEMS_PER_PAGE = 7;

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // 👇 State cho Modal Edit
    const [showModal, setShowModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [formData, setFormData] = useState({
        bookingTime: '',
        status: '',
        tableId: '',
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setBookings(res.data);
        } catch (error) {
            console.error('Lỗi tải Booking:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC EDIT ---
    const handleEdit = (booking) => {
        setEditingBooking(booking);
        setFormData({
            // Format datetime-local: YYYY-MM-DDTHH:mm
            bookingTime: new Date(booking.bookingTime).toISOString().slice(0, 16),
            status: booking.status,
            tableId: booking.tableId || '',
        });
        setShowModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editingBooking) return;

        try {
            const payload = {
                bookingTime: formData.bookingTime,
                status: formData.status,
                tableId: formData.tableId ? parseInt(formData.tableId) : null,
            };

            await axios.put(`${API_URL}/update/${editingBooking.bookingId}`, payload);

            alert('Cập nhật thành công!');
            setShowModal(false);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Lỗi update:', error);
            alert('Cập nhật thất bại!');
        }
    };

    // --- HỦY BOOKING ---
    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc muốn HỦY đơn này?')) return;
        try {
            await axios.put(`${API_URL}/cancel/${id}`);
            alert('Đã hủy thành công!');
            fetchBookings();
        } catch (error) {
            alert('Hủy thất bại!');
        }
    };

    // --- SEARCH & PAGINATION ---
    const filteredData = bookings.filter((b) => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
            b.bookingId?.toString().includes(lower) ||
            b.diner?.fullName?.toLowerCase().includes(lower) ||
            b.restaurant?.fullName?.toLowerCase().includes(lower) ||
            b.status?.toLowerCase().includes(lower)
        );
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || '';
        if (s === 'pending')
            return (
                <Badge bg="warning" text="dark">
                    Chờ xác nhận
                </Badge>
            );
        if (s === 'booked') return <Badge bg="success">Đã đặt</Badge>;
        if (s === 'completed') return <Badge bg="primary">Hoàn thành</Badge>;
        if (s === 'cancelled') return <Badge bg="danger">Đã hủy</Badge>;
        return <Badge bg="secondary">{status}</Badge>;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>📅 Quản lý Đặt Bàn (Bookings)</h3>
            </div>

            <div className={styles.searchBar}>
                <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border-start-0 shadow-none"
                    />
                </InputGroup>
            </div>

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
                                <th>Khách hàng</th>
                                <th>Nhà hàng</th>
                                <th>Bàn</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((b) => (
                                    <tr key={b.bookingId}>
                                        <td className="text-muted fw-bold">#{b.bookingId}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaUser className="text-secondary" />
                                                <span className="fw-medium">
                                                    {b.diner?.fullName || 'Khách vãng lai'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaStore className="text-info" />
                                                <span>{b.restaurant?.fullName || '---'}</span>
                                            </div>
                                        </td>
                                        <td>{b.table?.name || <span className="text-muted">-</span>}</td>
                                        <td>
                                            <div className="text-muted small">
                                                <FaCalendarAlt className="me-1" />{' '}
                                                {new Date(b.bookingTime).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(b.status)}</td>
                                        <td className="text-center">
                                            {/* Nút Sửa */}
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(b)}
                                            >
                                                <FaEdit />
                                            </Button>

                                            {/* Nút Hủy */}
                                            {['pending', 'booked'].includes(b.status?.toLowerCase()) && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleCancel(b.bookingId)}
                                                >
                                                    <FaBan />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        Không tìm thấy dữ liệu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination className="justify-content-center mt-4">
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

            {/* 👇 MODAL CHỈNH SỬA BOOKING */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>✏️ Chỉnh sửa Booking #{editingBooking?.bookingId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian đặt</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={formData.bookingTime}
                                onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã Bàn (Table ID)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="VD: 10"
                                        value={formData.tableId}
                                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                                    />
                                    <Form.Text className="text-muted">Nhập ID bàn mới nếu muốn đổi</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        <FaSave className="me-2" />
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BookingManagement;
