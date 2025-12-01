import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Badge, Spinner, InputGroup, FormControl, Pagination } from "react-bootstrap";
import { FaSearch, FaCalendarAlt, FaUser, FaStore, FaHashtag } from "react-icons/fa";
import styles from "./TransactionHistory.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

// 👇 Link API trỏ vào Controller vừa tạo
const API_URL = "https://localhost:7176/api/admin/AdminTransaction";
const ITEMS_PER_PAGE = 8;

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setTransactions(res.data);
        } catch (error) {
            console.error("Lỗi tải giao dịch:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- SEARCH LOGIC ---
    const filteredData = transactions.filter(t => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();

        return (
            t.transactionId?.toString().includes(lower) ||
            t.booking?.diner?.fullName?.toLowerCase().includes(lower) ||
            t.booking?.restaurant?.fullName?.toLowerCase().includes(lower)
        );
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>💸 Lịch sử Giao dịch</h3>
            </div>

            <div className={styles.searchBar}>
                <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Tìm theo Mã GD, Khách hàng, Nhà hàng..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="border-start-0 shadow-none"
                    />
                </InputGroup>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Mã GD</th>
                                <th>Khách hàng</th>
                                <th>Nhà hàng</th>
                                <th>Số tiền</th>
                                <th>Thời gian</th>
                                <th className="text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((t) => (
                                    <tr key={t.transactionId}>
                                        <td className="text-muted fw-bold">
                                            <FaHashtag className="me-1 text-secondary" size={12} />
                                            {t.transactionId}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaUser className="text-secondary" />
                                                <span className="fw-medium">{t.booking?.diner?.fullName || "Khách vãng lai"}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaStore className="text-info" />
                                                <span>{t.booking?.restaurant?.fullName || "---"}</span>
                                            </div>
                                        </td>
                                        <td className="fw-bold text-success">
                                            {formatCurrency(t.totalAmount)}
                                        </td>
                                        <td>
                                            <div className="text-muted small">
                                                <FaCalendarAlt className="me-1" /> {formatDate(t.timestamp)}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Badge bg="success" className="px-3 py-2 rounded-pill">Thành công</Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy giao dịch nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item key={i} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;