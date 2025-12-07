import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Badge, Spinner, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { FaTrashAlt, FaReply, FaSearch, FaEnvelope, FaEnvelopeOpenText } from 'react-icons/fa';
import styles from './ContactManagement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://gustoweb.onrender.com/api/admin/AdminContact';
const ITEMS_PER_PAGE = 7;

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State cho Modal xem chi tiết & trả lời
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setContacts(res.data);
        } catch (error) {
            console.error('Lỗi tải liên hệ:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC LỌC ---
    const filteredContacts = contacts.filter((c) => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
            (c.fullName && c.fullName.toLowerCase().includes(lower)) ||
            (c.email && c.email.toLowerCase().includes(lower)) ||
            (c.content && c.content.toLowerCase().includes(lower))
        );
    });

    // --- PHÂN TRANG ---
    const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- XÓA ---
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin nhắn này không?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert('Đã xóa thành công!');
            fetchContacts();
            if (showModal) setShowModal(false);
        } catch (error) {
            console.error('Lỗi xóa:', error);
            alert('Xóa thất bại!');
        }
    };

    // --- MỞ MODAL XEM CHI TIẾT ---
    const handleViewDetail = (contact) => {
        setSelectedContact(contact);
        setReplyMessage(''); // Reset form trả lời
        setShowModal(true);
    };

    // --- GỬI TRẢ LỜI (Giả lập hoặc gọi API gửi mail) ---
    const handleSendReply = () => {
        if (!replyMessage.trim()) {
            alert('Vui lòng nhập nội dung trả lời!');
            return;
        }

        // Tại đây bạn có thể gọi API gửi mail (nếu Backend hỗ trợ)
        // Ví dụ: axios.post(`${API_URL}/reply`, { email: selectedContact.email, message: replyMessage })

        alert(`Đã gửi phản hồi đến: ${selectedContact.email}\nNội dung: ${replyMessage}`);
        setShowModal(false);
    };

    // Helper: Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>📬 Quản lý Liên hệ & Khiếu nại</h3>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <InputGroup style={{ maxWidth: '500px' }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Tìm theo tên, email, nội dung..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border-start-0 shadow-none"
                    />
                </InputGroup>

                {/* Badge số lượng tin nhắn (Giả sử tổng tin nhắn là chưa đọc nếu chưa có field status) */}
                <Button variant="primary" className="position-relative">
                    <FaEnvelope className="me-2" /> Hộp thư đến
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {filteredContacts.length}
                        <span className="visually-hidden">tin nhắn</span>
                    </span>
                </Button>
            </div>

            {/* Bảng dữ liệu */}
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
                                <th>Người gửi</th>
                                <th>Email</th>
                                <th style={{ width: '40%' }}>Nội dung</th>
                                <th>Thời gian</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentContacts.length > 0 ? (
                                currentContacts.map((c) => (
                                    <tr key={c.id} onClick={() => handleViewDetail(c)} style={{ cursor: 'pointer' }}>
                                        <td className="text-muted">#{c.id}</td>
                                        <td className="fw-bold">{c.fullName || 'Ẩn danh'}</td>
                                        <td className="text-primary">{c.email}</td>
                                        <td>
                                            <div className={styles.messagePreview}>{c.content}</div>
                                        </td>
                                        <td className="text-muted small">{formatDate(c.timestamp)}</td>
                                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleViewDetail(c)}
                                                title="Trả lời"
                                            >
                                                <FaReply />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(c.id)}
                                                title="Xóa"
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        Hộp thư trống.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Phân trang */}
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

            {/* MODAL CHI TIẾT & TRẢ LỜI */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="text-dark"> {/* Thêm text-dark cho tiêu đề */}
                        <FaEnvelopeOpenText className="me-2 text-primary" />
                        Chi tiết tin nhắn #{selectedContact?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContact && (
                        <>
                            {/* 👇 SỬA Ở ĐÂY: Thêm text-dark để ép chữ màu đen trên nền xám */}
                            <div className="mb-4 p-3 bg-light rounded border text-dark">
                                <div className="d-flex justify-content-between mb-2">
                                    <strong className="text-dark">
                                        Từ: {selectedContact.fullName} &lt;{selectedContact.email}&gt;
                                    </strong>
                                    <span className="text-muted small">{formatDate(selectedContact.timestamp)}</span>
                                </div>
                                <hr className="my-2" />
                                {/* 👇 Thêm text-dark vào thẻ p nội dung */}
                                <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedContact.content}
                                </p>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-primary">
                                        <FaReply className="me-1" /> Phản hồi lại:
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder={`Nhập nội dung trả lời gửi đến ${selectedContact.email}...`}
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        autoFocus
                                        className="text-dark" // Đảm bảo chữ khi gõ cũng màu đen
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete(selectedContact?.id)}>
                        <FaTrashAlt className="me-1" /> Xóa tin này
                    </Button>
                    <div className="ms-auto">
                        <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleSendReply}>
                            <FaReply className="me-1" /> Gửi phản hồi
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContactManagement;