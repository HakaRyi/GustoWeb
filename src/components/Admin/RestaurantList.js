import React, { useEffect, useState, useRef } from 'react';
import styles from './RestaurantList.module.scss';
import ErrorModal from './ErrorModal';
import axios from 'axios';
import {
    FaPlus,
    FaSearch,
    FaStore,
    FaPhone,
    FaClock,
    FaEdit,
    FaTrash,
    FaCloudUploadAlt,
    FaSpinner,
    FaTimes,
    FaMapMarkerAlt,
    FaFacebook,
    FaTiktok,
} from 'react-icons/fa';

// 👇 THÔNG TIN CLOUDINARY
const CLOUD_NAME = 'dpgieqwpt';
const UPLOAD_PRESET = 'gusto_app';

const API_BASE = 'https://gustoweb.onrender.com/api/admin/AdminRestaurantProfile';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const [apiErrorMessages, setApiErrorMessages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');

    const [signupData, setSignupData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
    });

    // ================== Fetch all restaurants ==================
    const fetchRestaurants = async () => {
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error('Không thể tải danh sách nhà hàng');
            const data = await res.json();
            setRestaurants(data);
        } catch (err) {
            setError(err.message || 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    // ================== Upload Avatar ==================
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setSelectedRestaurant((prev) => ({ ...prev, avatarUrl: previewUrl }));
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);

            setSelectedRestaurant((prev) => ({ ...prev, avatarUrl: res.data.secure_url }));
        } catch (err) {
            setApiErrorMessages(['Lỗi upload ảnh!']);
        } finally {
            setUploading(false);
        }
    };

    // ================== Fetch Detail ==================
    const handleRowClick = async (restaurant) => {
        try {
            const res = await fetch(`${API_BASE}/${restaurant.accountId}`);
            if (!res.ok) throw new Error('Lỗi tải chi tiết');
            const data = await res.json();

            setSelectedRestaurant({
                ...data,
                openAt: data.openAt ?? '',
                closeAt: data.closeAt ?? '',
                duration: data.duration ?? 0,
                avatarUrl: data.avatarUrl || '',
                facebookUrl: data.facebookUrl || '',
                tiktokUrl: data.tiktokUrl || '',
                description: data.description || '',
            });
            setIsNew(false);
            setShowModal(true);
        } catch (err) {
            setApiErrorMessages([err.message]);
        }
    };

    const handleAddNew = () => {
        setSelectedRestaurant(null);
        setSignupData({ userName: '', password: '', confirmPassword: '', email: '' });
        setIsNew(true);
        setShowModal(true);
    };

    const normalizeTime = (time) => {
        if (!time || typeof time !== 'string') return null;
        const trimmed = time.trim();
        if (trimmed === '') return null;
        if (trimmed.length === 8) return trimmed;
        if (trimmed.length === 5) return `${trimmed}:00`;
        return null;
    };

    // ================== Signup + Create (NO TOKEN REQUIRED) ==================
    const handleSignupAndSave = async () => {
        if (!signupData.userName || !signupData.password || !signupData.email) {
            setApiErrorMessages(['Vui lòng điền đủ thông tin']);
            return;
        }
        if (signupData.password !== signupData.confirmPassword) {
            setApiErrorMessages(['Mật khẩu không khớp']);
            return;
        }

        try {
            const payload = {
                userName: signupData.userName,
                password: signupData.password,
                confirmPassword: signupData.confirmPassword,
                email: signupData.email,
                roleId: 2,
            };

            const res = await fetch(`${API_BASE}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Lỗi tạo tài khoản:', text); // Xem log này trong Console

                try {
                    const content = JSON.parse(text);
                    // Backend của bạn trả về { error: "..." } trong catch block
                    if (content.error) {
                        setApiErrorMessages(['Lỗi: ' + content.error]);
                    }
                    // Trường hợp lỗi Validation mặc định của .NET
                    else if (content.errors) {
                        setApiErrorMessages(Object.values(content.errors).flat());
                    } else if (content.message) {
                        setApiErrorMessages([content.message]);
                    } else {
                        setApiErrorMessages(['Lỗi tạo tài khoản (400 Bad Request).']);
                    }
                } catch {
                    setApiErrorMessages(['Lỗi Server: ' + text]);
                }
                return;
            }

            setShowModal(false);
            setSignupData({ userName: '', password: '', confirmPassword: '', email: '' });
            fetchRestaurants();
            alert('Tạo nhà hàng thành công!');
        } catch (err) {
            setApiErrorMessages([err.message]);
        }
    };

    // ================== Update (CLEAN PAYLOAD) ==================
    const handleSave = async () => {
        if (uploading) {
            alert('Đang tải ảnh...');
            return;
        }

        try {
            const payload = {
                // KHÔNG GỬI accountId TRONG BODY ĐỂ TRÁNH LỖI TRACKING

                avatarUrl: selectedRestaurant.avatarUrl || '',
                fullName: selectedRestaurant.fullName || '',
                phone: selectedRestaurant.phone || '',
                address: selectedRestaurant.address || '',
                email: selectedRestaurant.email || '',

                openAt: normalizeTime(selectedRestaurant.openAt),
                closeAt: normalizeTime(selectedRestaurant.closeAt),

                description: selectedRestaurant.description || '',
                facebookUrl: selectedRestaurant.facebookUrl || '',
                tiktokUrl: selectedRestaurant.tiktokUrl || '',

                duration: selectedRestaurant.duration ? parseInt(selectedRestaurant.duration) : 0,
            };

            console.log('🔥 Payload Update:', payload);

            const res = await fetch(`${API_BASE}/${selectedRestaurant.accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const errObj = JSON.parse(text);
                    if (errObj.message) setApiErrorMessages(['Lỗi Server: ' + errObj.message]);
                    else if (errObj.errors) setApiErrorMessages(Object.values(errObj.errors).flat());
                    else setApiErrorMessages(['Cập nhật thất bại.']);
                } catch {
                    setApiErrorMessages(['Lỗi Server: ' + text]);
                }
                return;
            }

            setShowModal(false);
            setSelectedRestaurant(null);
            fetchRestaurants();
            alert('Cập nhật thành công!');
        } catch (err) {
            setApiErrorMessages([err.message]);
        }
    };

    // ================== Delete ==================
    const handleDelete = async () => {
        if (!window.confirm('Chắc chắn xóa?')) return;
        try {
            const res = await fetch(`${API_BASE}/${selectedRestaurant.accountId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Không thể xóa');
            setShowModal(false);
            setSelectedRestaurant(null);
            fetchRestaurants();
            alert('Đã xóa!');
        } catch (err) {
            setApiErrorMessages([err.message]);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setApiErrorMessages([]);
    };

    const filteredRestaurants = restaurants.filter((r) => {
        // 1. Nếu không tìm kiếm gì -> Hiển thị tất cả (kể cả null)
        if (!searchTerm) return true;

        const lowerSearch = searchTerm.toLowerCase();

        // 2. Chuyển đổi an toàn: Nếu null thì coi như chuỗi rỗng ""
        const name = r.fullName ? r.fullName.toLowerCase() : '';
        const addr = r.address ? r.address.toLowerCase() : '';
        const phone = r.phone ? r.phone.toLowerCase() : '';
        const email = r.email ? r.email.toLowerCase() : '';

        // 3. Tìm trong Tên, Địa chỉ, SĐT hoặc Email
        return (
            name.includes(lowerSearch) ||
            addr.includes(lowerSearch) ||
            phone.includes(lowerSearch) ||
            email.includes(lowerSearch)
        );
    });

    // ================== Render ==================
    return (
        <div className={styles.container}>
            <ErrorModal
                message={apiErrorMessages.length > 0 ? apiErrorMessages.join('\n') : ''}
                onClose={() => setApiErrorMessages([])}
            />

            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2>
                        <FaStore /> Quản lý Nhà Hàng
                    </h2>
                    <p className={styles.subtitle}>Quản lý đối tác & thông tin chi tiết</p>
                </div>
                <button onClick={handleAddNew} className={styles.addBtn}>
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm kiếm nhà hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <FaSpinner className={styles.spinner} /> Đang tải...
                </div>
            ) : error ? (
                <div className={styles.error}>⚠️ {error}</div>
            ) : (
                <div className={styles.grid}>
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((r, idx) => (
                            <div key={r.accountId ?? idx} className={styles.card} onClick={() => handleRowClick(r)}>
                                <div className={styles.cardImgWrapper}>
                                    {r.avatarUrl ? (
                                        <img
                                            src={r.avatarUrl}
                                            alt={r.fullName}
                                            className={styles.cardImg}
                                            onError={(e) =>
                                                (e.target.src = 'https://placehold.co/400x200?text=No+Logo')
                                            }
                                        />
                                    ) : (
                                        <div className={styles.placeholderImg}>
                                            <FaStore />
                                        </div>
                                    )}
                                    <div className={styles.overlay}>
                                        <span>Chỉnh sửa</span>
                                    </div>
                                </div>
                                <div className={styles.cardBody}>
                                    <h3 className={styles.resName}>{r.fullName || 'Tên chưa cập nhật'}</h3>
                                    <div className={styles.infoRow}>
                                        <FaMapMarkerAlt /> <span>{r.address || '---'}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <FaPhone /> <span>{r.phone || '---'}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <FaClock />{' '}
                                        <span>
                                            {r.openAt?.slice(0, 5)} - {r.closeAt?.slice(0, 5)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%', color: '#888' }}>Không tìm thấy kết quả.</p>
                    )}
                </div>
            )}

            {/* ================== MODAL ================== */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>{isNew ? '🔐 Tạo tài khoản mới' : '✏️ Cập nhật thông tin'}</h3>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {isNew ? (
                                <div className={styles.formSection}>
                                    <div className={styles.formGroup}>
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={signupData.userName}
                                            onChange={(e) => setSignupData({ ...signupData, userName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                value={signupData.password}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, password: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Xác nhận MK</label>
                                            <input
                                                type="password"
                                                value={signupData.confirmPassword}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, confirmPassword: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.updateForm}>
                                    {/* Cột Trái: Avatar */}
                                    <div className={styles.leftCol}>
                                        <div className={styles.avatarUpload}>
                                            <div className={styles.avatarPreview}>
                                                {selectedRestaurant.avatarUrl ? (
                                                    <img
                                                        src={selectedRestaurant.avatarUrl}
                                                        alt="Avatar"
                                                        onError={(e) =>
                                                            (e.target.src = 'https://placehold.co/150?text=Logo')
                                                        }
                                                    />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        <FaStore />
                                                    </div>
                                                )}
                                                {uploading && (
                                                    <div className={styles.uploadingOverlay}>
                                                        <FaSpinner className={styles.spin} />
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                id="avatarInput"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                style={{ display: 'none' }}
                                                ref={fileInputRef}
                                            />
                                            <label htmlFor="avatarInput" className={styles.uploadBtn}>
                                                <FaCloudUploadAlt /> {uploading ? 'Đang tải...' : 'Đổi Avatar'}
                                            </label>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Tên nhà hàng</label>
                                            <input
                                                type="text"
                                                value={selectedRestaurant.fullName ?? ''}
                                                onChange={(e) =>
                                                    setSelectedRestaurant({
                                                        ...selectedRestaurant,
                                                        fullName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Cột Phải: Thông tin chi tiết */}
                                    <div className={styles.rightCol}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    value={selectedRestaurant.email ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Số điện thoại</label>
                                                <input
                                                    type="text"
                                                    value={selectedRestaurant.phone ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Địa chỉ</label>
                                            <input
                                                type="text"
                                                value={selectedRestaurant.address ?? ''}
                                                onChange={(e) =>
                                                    setSelectedRestaurant({
                                                        ...selectedRestaurant,
                                                        address: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Mở cửa</label>
                                                <input
                                                    type="time"
                                                    value={selectedRestaurant.openAt ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            openAt: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Đóng cửa</label>
                                                <input
                                                    type="time"
                                                    value={selectedRestaurant.closeAt ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            closeAt: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Thời lượng (phút)</label>
                                                <input
                                                    type="number"
                                                    value={selectedRestaurant.duration ?? 0}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            duration: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <FaFacebook style={{ color: '#1877F2' }} /> Facebook URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedRestaurant.facebookUrl ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            facebookUrl: e.target.value,
                                                        })
                                                    }
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <FaTiktok style={{ color: '#000' }} /> TikTok URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedRestaurant.tiktokUrl ?? ''}
                                                    onChange={(e) =>
                                                        setSelectedRestaurant({
                                                            ...selectedRestaurant,
                                                            tiktokUrl: e.target.value,
                                                        })
                                                    }
                                                    placeholder="https://tiktok.com/..."
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Mô tả</label>
                                            <textarea
                                                rows="3"
                                                value={selectedRestaurant.description ?? ''}
                                                onChange={(e) =>
                                                    setSelectedRestaurant({
                                                        ...selectedRestaurant,
                                                        description: e.target.value,
                                                    })
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            {isNew ? (
                                <button onClick={handleSignupAndSave} className={styles.saveBtn}>
                                    ✅ Tạo tài khoản
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleDelete} className={styles.deleteBtn}>
                                        <FaTrash /> Xóa
                                    </button>
                                    <button onClick={handleSave} className={styles.saveBtn} disabled={uploading}>
                                        <FaEdit /> Lưu thay đổi
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
