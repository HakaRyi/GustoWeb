import React, { useEffect, useState } from 'react';
import styles from './IntegratePaymentAccount.module.scss';
import { customFetch } from '~/config/customFetch';
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';

const IntegratePaymentAccount = () => {
    const [paymentData, setPaymentData] = useState(null);
    const [formData, setFormData] = useState({ bankNo: '', bankAccountName: '', bank: '' });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await customFetch('https://gustoweb.onrender.com/api/PaymentMerchant/getByMe', {
                    method: 'GET',
                });
                if (!res.ok) throw new Error('Lỗi khi lấy thông tin tài khoản ngân hàng');
                const data = await res.json();
                setPaymentData(data);
                setFormData({
                    bankNo: data.bankNo || '',
                    bankAccountName: data.bankAccountName || '',
                    bank: data.bank || '',
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        try {
            const res = await customFetch('https://gustoweb.onrender.com/api/PaymentMerchant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Lỗi khi tạo tài khoản ngân hàng');
            console.log('Tạo thành công!');
            // Refresh data
            const fetchRes = await customFetch('https://gustoweb.onrender.com/api/PaymentMerchant/getByMe');
            const newData = await fetchRes.json();
            setPaymentData(newData);
            setFormData({
                bankNo: newData.bankNo || '',
                bankAccountName: newData.bankAccountName || '',
                bank: newData.bank || '',
            });
        } catch (error) {
            console.error(error);
            alert('Tạo thất bại!');
        }
    };

    const handleUpdate = async () => {
        if (!paymentData?.id) return alert('Không tìm thấy ID!');
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/PaymentMerchant/${paymentData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Lỗi khi cập nhật');
            console.log('Cập nhật thành công!');
            setPaymentData({ ...paymentData, ...formData });
            setEditing(false);
        } catch (error) {
            console.error(error);
            alert('Cập nhật thất bại!');
        }
    };

    const handleDelete = async () => {
        if (!paymentData?.id) return alert('Không tìm thấy ID!');
        try {
            const res = await customFetch(`https://gustoweb.onrender.com/api/PaymentMerchant/${paymentData.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Lỗi khi xóa');
            const success = await res.json();
            if (success) {
                console.log('Xóa thành công!');
                setPaymentData(null);
                setFormData({ bankNo: '', bankAccountName: '', bank: '' });
                setEditing(false);
            } else {
                alert('Xóa thất bại!');
            }
        } catch (error) {
            console.error(error);
            alert('Xóa thất bại!');
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        try {
            // Placeholder cho API verify bên ngoài. Ví dụ sử dụng MoMo API (cần đăng ký và cấu hình key thực tế)
            // Giả sử gọi POST đến MoMo /v2/gateway/api/disbursement/verify với params phù hợp
            // Lưu ý: Thay thế bằng API thực, ví dụ MoMo hoặc Tranglo
            // Ví dụ giả định:
            const verifyRes = await fetch(
                'https://test-gateway.mastercard.com/api/rest/version/51/merchant/{merchantId}/order/{orderId}',
                {
                    // Thay bằng API MoMo thực
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Params cho MoMo checkWallet hoặc disburseToBank với amount 0 để verify
                        partnerCode: 'YOUR_MOMO_PARTNER_CODE', // Cần đăng ký MoMo
                        bankCode: formData.bank,
                        bankAccountNo: formData.bankNo,
                        bankAccountHolderName: formData.bankAccountName,
                        // Các param khác theo docs MoMo
                    }),
                },
            );
            const verifyData = await verifyRes.json();
            if (verifyData.resultCode === 0) {
                alert('Xác minh thành công! Tài khoản hợp lệ.');
            } else {
                alert(`Xác minh thất bại: ${verifyData.message}`);
            }
        } catch (error) {
            console.error('Lỗi xác minh:', error);
            alert('Xác minh thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <div className={styles.paymentLoading}>Đang tải thông tin...</div>;

    const banks = [
        'VCB',
        'BIDV',
        'VietinBank',
        'Techcombank',
        'ACB',
        'MBBank',
        'VPBank',
        'Sacombank',
        'Agribank',
        'DongA Bank',
    ]; // Danh sách ngân hàng phổ biến ở VN

    return (
        <div className={styles.paymentIntegrationContainer}>
            <div className={styles.paymentHeader}>
                <h2>Tích hợp tài khoản ngân hàng</h2>
                <p>Quản lý thông tin ngân hàng để nhận thanh toán từ khách hàng.</p>
            </div>

            <div className={styles.paymentForm}>
                <div className={styles.paymentFormRow}>
                    <label className={styles.paymentFormLabel}>
                        <span className={styles.paymentLabelText}>Ngân hàng</span>
                        {paymentData && !editing ? (
                            <input value={formData.bank} readOnly className={styles.paymentFormInput} />
                        ) : (
                            <select
                                name="bank"
                                value={formData.bank}
                                onChange={handleChange}
                                className={styles.paymentFormInput}
                            >
                                <option value="">Chọn ngân hàng</option>
                                {banks.map((bank) => (
                                    <option key={bank} value={bank}>
                                        {bank}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>
                </div>

                <div className={styles.paymentFormRow}>
                    <label className={styles.paymentFormLabel}>
                        <span className={styles.paymentLabelText}>Số tài khoản</span>
                        <input
                            name="bankNo"
                            value={formData.bankNo}
                            onChange={handleChange}
                            readOnly={paymentData && !editing}
                            className={styles.paymentFormInput}
                            placeholder="Nhập số tài khoản"
                        />
                    </label>

                    <label className={styles.paymentFormLabel}>
                        <span className={styles.paymentLabelText}>Tên chủ tài khoản</span>
                        <input
                            name="bankAccountName"
                            value={formData.bankAccountName}
                            onChange={handleChange}
                            readOnly={paymentData && !editing}
                            className={styles.paymentFormInput}
                            placeholder="Nhập tên chủ tài khoản"
                        />
                    </label>
                </div>
            </div>

            <div className={styles.paymentActions}>
                {paymentData ? (
                    !editing ? (
                        <>
                            <button
                                className={`${styles.paymentActionBtn} ${styles.paymentEditBtn}`}
                                onClick={() => setEditing(true)}
                            >
                                <FaEdit className={styles.paymentBtnIcon} /> Chỉnh sửa
                            </button>
                            <button
                                className={`${styles.paymentActionBtn} ${styles.paymentDeleteBtn}`}
                                onClick={handleDelete}
                            >
                                <FaTimes className={styles.paymentBtnIcon} /> Xóa
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`${styles.paymentActionBtn} ${styles.paymentSaveBtn}`}
                                onClick={handleUpdate}
                            >
                                <FaSave className={styles.paymentBtnIcon} /> Lưu
                            </button>
                            <button
                                className={`${styles.paymentActionBtn} ${styles.paymentCancelBtn}`}
                                onClick={() => {
                                    setFormData({
                                        bankNo: paymentData.bankNo || '',
                                        bankAccountName: paymentData.bankAccountName || '',
                                        bank: paymentData.bank || '',
                                    });
                                    setEditing(false);
                                }}
                            >
                                <FaTimes className={styles.paymentBtnIcon} /> Hủy
                            </button>
                        </>
                    )
                ) : (
                    <button className={`${styles.paymentActionBtn} ${styles.paymentSaveBtn}`} onClick={handleCreate}>
                        <FaSave className={styles.paymentBtnIcon} /> Tạo mới
                    </button>
                )}
                <button
                    className={`${styles.paymentActionBtn} ${styles.paymentVerifyBtn}`}
                    onClick={handleVerify}
                    disabled={verifying || !formData.bank || !formData.bankNo || !formData.bankAccountName}
                >
                    <FaCheckCircle className={styles.paymentBtnIcon} />{' '}
                    {verifying ? 'Đang xác minh...' : 'Xác minh tài khoản'}
                </button>
            </div>

            <div className={styles.paymentNote}>
                <p>
                    Lưu ý: Vui lòng nhập đúng thông tin để tiền có thể được chuyển đến tài khoản của bạn một cách chính
                    xác.
                </p>
                {/* Để xác minh tài khoản ngân hàng, bạn có thể tích hợp API từ MoMo hoặc Tranglo. Ví dụ, đăng ký
                    MoMo Developer để sử dụng API /v2/gateway/api/disbursement/verify (check wallet status, hoặc tương
                    tự cho bank). Tranglo hỗ trợ real-time verification cho các ngân hàng như VCB, BIDV qua Do_Transfer
                    API. Cần đăng ký tài khoản developer và cấu hình key/auth để gọi API bên ngoài. Trong code trên, tôi
                    đã thêm placeholder cho hàm verify - hãy thay bằng API thực tế và xử lý response tương ứng.*/}
            </div>
        </div>
    );
};

export default IntegratePaymentAccount;
