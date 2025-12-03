// src/components/Admin/DinerProfileManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Pagination, Spinner, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FaUserPlus, FaTrashAlt, FaSearch } from 'react-icons/fa';
import styles from './DinerProfileManagement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://gustoweb.onrender.com/api/DinerProfile';
const ITEMS_PER_PAGE = 5;

const DinerProfileManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // State cho phân trang & tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const initialForm = {
        accountId: '',
        fullName: '',
        phone: '',
        age: '',
        avatarUrl: '',
        job: '',
        email: '',
        gender: '',
        address: '',
        tiktokUrl: '',
        description: '',
        facebookUrl: '',
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setProfiles(res.data);
        } catch (error) {
            console.error('❌ Lỗi khi lấy danh sách:', error);
        }
        setLoading(false);
    };

    // --- LOGIC LỌC & TÌM KIẾM ---
    const filteredProfiles = profiles.filter((p) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();

        return (
            (p.fullName && p.fullName.toLowerCase().includes(lowerSearch)) ||
            (p.phone && p.phone.includes(lowerSearch)) ||
            (p.email && p.email.toLowerCase().includes(lowerSearch))
        );
    });

    // --- LOGIC PHÂN TRANG (Dựa trên danh sách đã lọc) ---
    const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleOpen = (profile = null) => {
        setFormData(profile || initialForm);
        setEditMode(!!profile);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            if (!formData.fullName.trim()) {
                alert('Họ tên không được để trống!');
                return;
            }

            const payload = {
                ...formData,
                age: formData.age ? Number(formData.age) : null,
                avatarUrl: formData.avatarUrl?.trim() || 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                tiktokUrl: formData.tiktokUrl?.trim() || 'https://tiktok.com/',
                facebookUrl: formData.facebookUrl?.trim() || 'https://facebook.com/',
            };

            if (!editMode) {
                delete payload.accountId;
            }

            if (editMode) {
                await axios.put(API_URL, payload);
            } else {
                await axios.post(API_URL, payload);
            }

            fetchProfiles();
            handleClose();
        } catch (error) {
            console.error('❌ Lỗi khi lưu:', error.response || error);
            if (error.response?.data?.errors) {
                console.log('📛 Chi tiết lỗi validation:', error.response.data.errors);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa hồ sơ này không?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchProfiles();
            } catch (error) {
                console.error('❌ Lỗi khi xóa:', error);
            }
        }
    };

    // Khi tìm kiếm thay đổi, reset về trang 1
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>🍽️ Quản lý Diner Profiles</h3>
            </div>

            {/* 👇 THANH TÌM KIẾM (MỚI THÊM) */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                            <FaSearch className="text-muted" />
                        </InputGroup.Text>
                        <FormControl
                            placeholder="Tìm kiếm theo Tên, SĐT, Email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-start-0 shadow-none"
                        />
                    </InputGroup>
                </div>
                {/* Nút thêm mới (Optional) */}
                {/* <Button variant="primary" onClick={() => handleOpen()}>
                    <FaUserPlus className="me-2" /> Thêm mới
                </Button> */}
            </div>

            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table hover responsive bordered className="align-middle shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Avatar</th>
                                <th>Họ tên</th>
                                <th>Điện thoại</th>
                                <th>Email</th>
                                <th>Job</th>
                                <th>Gender</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProfiles.length > 0 ? (
                                currentProfiles.map((p) => (
                                    <tr key={p.accountId}>
                                        <td>{p.accountId}</td>
                                        <td>
                                            <img
                                                src={
                                                    p.avatarUrl ||
                                                    'https://cdn-icons-png.flaticon.com/512/1077/1077012.png'
                                                }
                                                alt="avatar"
                                                className={styles.avatar}
                                            />
                                        </td>
                                        <td>{p.fullName}</td>
                                        <td>{p.phone}</td>
                                        <td>{p.email}</td>
                                        <td>{p.job}</td>
                                        <td>{p.gender}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(p.accountId)}
                                            >
                                                <FaTrashAlt /> Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={currentPage === index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}

            {/* Modal giữ nguyên */}
            <Modal
                show={showModal}
                onHide={handleClose}
                centered
                size="lg"
                backdrop="static"
                className={styles.customModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? '✏️ Cập nhật hồ sơ' : '➕ Thêm hồ sơ mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Họ tên</Form.Label>
                                    <Form.Control
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên đầy đủ..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Điện thoại</Form.Label>
                                    <Form.Control
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tuổi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Nhập tuổi..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Avatar URL</Form.Label>
                                    <Form.Control
                                        name="avatarUrl"
                                        value={formData.avatarUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job</Form.Label>
                                    <Form.Control
                                        name="job"
                                        value={formData.job}
                                        onChange={handleChange}
                                        placeholder="Công việc..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giới tính</Form.Label>
                                    <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ..."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tiktok URL</Form.Label>
                                    <Form.Control
                                        name="tiktokUrl"
                                        value={formData.tiktokUrl}
                                        onChange={handleChange}
                                        placeholder="https://tiktok.com/@username"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="Giới thiệu ngắn về bạn..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Facebook URL</Form.Label>
                            <Form.Control
                                name="facebookUrl"
                                value={formData.facebookUrl || ''}
                                onChange={handleChange}
                                placeholder="https://facebook.com/username"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DinerProfileManagement;
