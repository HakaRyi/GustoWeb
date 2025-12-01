import React, { useEffect, useState, useRef } from "react";
import styles from "./RestaurantDetail.module.scss";
import axios from "axios";
import {
    FaArrowLeft, FaUtensils, FaChair, FaInfoCircle, FaMapMarkerAlt,
    FaClock, FaPhone, FaEnvelope, FaPlus, FaEdit, FaTrash, FaTimes, FaEye, FaCloudUploadAlt, FaSpinner, FaSearch
} from "react-icons/fa";

// 👇 CẤU HÌNH CLOUDINARY
const CLOUD_NAME = "dpgieqwpt";
const UPLOAD_PRESET = "gusto_app";

// 👇 API BACKEND
const API_ADMIN_MENU = "https://localhost:7176/api/admin/AdminRestaurantMenu";
const API_ADMIN_TABLE = "https://localhost:7176/api/admin/AdminRestaurantTable";
const API_PROFILE = "https://localhost:7176/api/admin/AdminRestaurantProfile";

const RestaurantDetail = ({ restaurantId, onBack }) => {
    const [profile, setProfile] = useState(null);
    const [menus, setMenus] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({});
    const [isView, setIsView] = useState(false);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // 👇 STATE TÌM KIẾM
    const [searchTerm, setSearchTerm] = useState("");

    // --- FETCH DATA ---
    const fetchAllData = async () => {
        try {
            const [resProfile, resMenu, resTable] = await Promise.all([
                axios.get(`${API_PROFILE}/${restaurantId}`),
                axios.get(`${API_ADMIN_MENU}/getByRestaurant/${restaurantId}`),
                axios.get(`${API_ADMIN_TABLE}/getByRestaurant/${restaurantId}`)
            ]);
            setProfile(resProfile.data);
            setMenus(resMenu.data);
            setTables(resTable.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { if (restaurantId) fetchAllData(); }, [restaurantId]);

    // 👇 LOGIC LỌC DỮ LIỆU (SEARCH)
    // Lọc Menu theo tên
    const filteredMenus = menus.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Lọc Table theo tên
    const filteredTables = tables.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- XỬ LÝ UPLOAD ẢNH ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, foodUrl: previewUrl }));
        setUploading(true);
        try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", UPLOAD_PRESET);
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
            setFormData(prev => ({ ...prev, foodUrl: res.data.secure_url }));
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Lỗi upload ảnh!");
        } finally { setUploading(false); }
    };

    // --- FORM HANDLERS ---
    const handleOpenModal = (type, item = null) => {
        setModalType(type);
        setIsEdit(!!item);
        setIsView(false);
        setShowModal(true);
        setFormData(item ? { ...item } : { description: "", foodUrl: "" });
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleViewDetail = (type, item) => {
        setModalType(type);
        setIsView(true);
        setShowModal(true);
        setFormData(item);
    };

    const handleCloseModal = () => { setShowModal(false); setFormData({}); setIsView(false); };
    const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    // --- SUBMIT ---
    const handleSubmit = async () => {
        try {
            if (uploading) { alert("Đang tải ảnh..."); return; }
            let payload = {};
            const safeDesc = formData.description?.trim() || "Món ngon chất lượng";

            if (modalType === "MENU") {
                payload = {
                    foodId: isEdit ? formData.foodId : 0,
                    restaurantId: parseInt(restaurantId),
                    name: formData.name,
                    price: Number(formData.price) || 0,
                    oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                    description: safeDesc,
                    foodUrl: formData.foodUrl || "https://placehold.co/400x300?text=No+Image",
                    type: formData.type || "Món chính",
                    unit: formData.unit || "Phần",
                    status: true
                };
            } else {
                const statusInt = formData.status === "Occupied" ? 1 : 0;
                payload = {
                    tableId: isEdit ? formData.tableId : 0,
                    restaurantId: parseInt(restaurantId),
                    name: formData.name,
                    personNumber: parseInt(formData.personNumber) || 0,
                    position: formData.position || "",
                    status: statusInt,
                    description: safeDesc
                };
            }

            if (modalType === "MENU") {
                const url = isEdit ? `${API_ADMIN_MENU}/${restaurantId}/${formData.foodId}` : `${API_ADMIN_MENU}/${restaurantId}`;
                isEdit ? await axios.put(url, payload) : await axios.post(url, payload);
            } else {
                const url = isEdit ? `${API_ADMIN_TABLE}/${restaurantId}/${formData.tableId}` : `${API_ADMIN_TABLE}/${restaurantId}`;
                isEdit ? await axios.put(url, payload) : await axios.post(url, payload);
            }
            alert("Thành công!");
            handleCloseModal();
            fetchAllData();
        } catch (error) {
            console.error("Submit Error:", error);
            const msg = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join("\n") : error.message;
            alert("Lỗi: " + msg);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Xóa nhé?")) return;
        try {
            if (type === "MENU") await axios.delete(`${API_ADMIN_MENU}/${restaurantId}/${id}`);
            else await axios.delete(`${API_ADMIN_TABLE}/${restaurantId}/${id}`);
            alert("Đã xóa!"); fetchAllData();
        } catch (error) { alert("Lỗi xóa!"); }
    };

    // --- RENDER FORM ---
    const renderInputForm = () => (
        <>
            {modalType === "MENU" ? (
                <>
                    <div className={styles.formGroup}><label>Tên món</label><input name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="VD: Phở bò" /></div>
                    <div className={styles.formGroup}><label>Loại (Type)</label><input name="type" value={formData.type || ""} onChange={handleInputChange} placeholder="VD: Món chính..." /></div>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Giá (VNĐ)</label><input type="number" name="price" value={formData.price || ""} onChange={handleInputChange} /></div>
                        <div className={styles.formGroup}><label>Giá cũ</label><input type="number" name="oldPrice" value={formData.oldPrice || ""} onChange={handleInputChange} /></div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Hình ảnh</label>
                        <div className={styles.fileUploadWrapper}>
                            <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} className={styles.fileInput} ref={fileInputRef} />
                            <label htmlFor="fileInput" className={styles.fileLabel}>{uploading ? <FaSpinner className={styles.spinner} /> : <FaCloudUploadAlt />} {uploading ? " Đang tải..." : " Chọn ảnh"}</label>
                        </div>
                        {formData.foodUrl && <div className={styles.imagePreview}><img src={formData.foodUrl} alt="Preview" onError={(e) => e.target.src = "https://placehold.co/400x400?text=Error"} /></div>}
                    </div>
                    <div className={styles.formGroup}><label>Mô tả</label><textarea name="description" value={formData.description || ""} onChange={handleInputChange} rows="3"></textarea></div>
                </>
            ) : (
                <>
                    <div className={styles.formGroup}><label>Tên bàn</label><input name="name" value={formData.name || ""} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Số ghế</label><input type="number" name="personNumber" value={formData.personNumber || ""} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Vị trí</label><input name="position" value={formData.position || ""} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Trạng thái</label><select name="status" value={formData.status || "Available"} onChange={handleInputChange}><option value="Available">Trống</option><option value="Occupied">Có khách</option></select></div>
                    <div className={styles.formGroup}><label>Mô tả</label><textarea name="description" value={formData.description || ""} onChange={handleInputChange} rows="2"></textarea></div>
                </>
            )}
        </>
    );

    const renderViewDetail = () => (
        <div className={styles.viewDetailContainer}>
            {modalType === "MENU" ? (
                <>
                    {formData.foodUrl && <div style={{ width: '100%', marginBottom: '15px' }}><img src={formData.foodUrl} alt={formData.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} onError={(e) => e.target.src = "https://placehold.co/600x400?text=No+Image"} /></div>}
                    <div className={styles.detailItem}><span className={styles.label}>Tên:</span><span className={styles.value} style={{ fontWeight: 'bold' }}>{formData.name}</span></div>
                    <div className={styles.detailItem}><span className={styles.label}>Giá:</span><span className={styles.menuPrice}>{formData.price?.toLocaleString()} VNĐ</span></div>
                    <div className={styles.detailItem} style={{ flexDirection: 'column', alignItems: 'flex-start' }}><span className={styles.label}>Mô tả:</span><p className={styles.descText}>{formData.description}</p></div>
                </>
            ) : (
                <>
                    <div className={styles.detailItem}><span className={styles.label}>Bàn:</span><span className={styles.value} style={{ fontWeight: 'bold' }}>{formData.name}</span></div>
                    <div className={styles.detailItem}><span className={styles.label}>Số ghế:</span><span className={styles.value}>{formData.personNumber}</span></div>
                    <div className={styles.detailItem}><span className={styles.label}>Trạng thái:</span><span className={formData.status === 'Available' ? styles.tagGreen : styles.tagRed}>{formData.status}</span></div>
                </>
            )}
        </div>
    );

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={onBack}><FaArrowLeft /> Quay lại danh sách</button>
            <div className={styles.section}>
                <h2 className={styles.title}><FaInfoCircle /> Thông tin nhà hàng</h2>
                {profile && (
                    <div className={styles.profileContent}>
                        <div className={styles.avatarSection}>{profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className={styles.avatarImg} /> : <div className={styles.placeholderAvatar}>🍽️</div>}</div>
                        <div className={styles.infoSection}>
                            <h3 className={styles.resName}>{profile.fullName}</h3>
                            <p><FaMapMarkerAlt /> {profile.address}</p>
                            <p><FaPhone /> {profile.phone}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 👇 THANH TÌM KIẾM (MỚI) */}
            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm kiếm bàn hoặc món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.gridContainer}>
                {/* TABLE LIST */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}><h2 className={styles.title}><FaChair /> Bàn ({filteredTables.length})</h2><button className={styles.addBtn} onClick={() => handleOpenModal("TABLE")}><FaPlus /> Thêm</button></div>
                    <div className={styles.listContainer}>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Tên</th><th>Ghế</th><th>Vị trí</th><th>TT</th><th className={styles.actionCol}>#</th></tr></thead>
                            {/* 👇 DÙNG BIẾN filteredTables */}
                            <tbody>{filteredTables.map(t => (<tr key={t.tableId}><td>{t.name}</td><td>{t.personNumber}</td><td>{t.position}</td><td><span className={t.status === 'Available' ? styles.tagGreen : styles.tagRed}>{t.status}</span></td><td><button className={styles.iconBtnView} onClick={() => handleViewDetail("TABLE", t)}><FaEye /></button><button className={styles.iconBtnEdit} onClick={() => handleOpenModal("TABLE", t)}><FaEdit /></button><button className={styles.iconBtnDelete} onClick={() => handleDelete("TABLE", t.tableId)}><FaTrash /></button></td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
                {/* MENU LIST */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}><h2 className={styles.title}><FaUtensils /> Menu ({filteredMenus.length})</h2><button className={styles.addBtn} onClick={() => handleOpenModal("MENU")}><FaPlus /> Thêm</button></div>
                    <div className={styles.listContainer}>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Tên</th><th>Giá</th><th>Mô tả</th><th className={styles.actionCol}>#</th></tr></thead>
                            {/* 👇 DÙNG BIẾN filteredMenus */}
                            <tbody>{filteredMenus.map(m => (<tr key={m.foodId}><td className={styles.menuName}>{m.name}</td><td><span className={styles.menuPrice}>{m.price?.toLocaleString()}đ</span></td><td className={styles.descCell}>{m.description}</td><td><button className={styles.iconBtnView} onClick={() => handleViewDetail("MENU", m)}><FaEye /></button><button className={styles.iconBtnEdit} onClick={() => handleOpenModal("MENU", m)}><FaEdit /></button><button className={styles.iconBtnDelete} onClick={() => handleDelete("MENU", m.foodId)}><FaTrash /></button></td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}><h3>{isView ? "Chi tiết" : (isEdit ? "Cập nhật" : "Thêm mới")}</h3><button onClick={handleCloseModal}><FaTimes /></button></div>
                        <div className={styles.modalBody}>{isView ? renderViewDetail() : renderInputForm()}</div>
                        <div className={styles.modalFooter}>{isView ? <button className={styles.btnCancel} onClick={handleCloseModal}>Đóng</button> : <><button className={styles.btnCancel} onClick={handleCloseModal}>Hủy</button><button className={styles.btnSave} onClick={handleSubmit} disabled={uploading}>{uploading ? "Đợi..." : "Lưu"}</button></>}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetail;