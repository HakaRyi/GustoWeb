import React, { useEffect, useState } from "react";
import styles from "./ProfileResLayout.module.scss";
import { customFetch } from "~/config/customFetch";
import ImageUploader from "../Cloundinary/ImageUploader";
import { FaEdit, FaSave, FaTimes, FaCamera, FaStar } from "react-icons/fa";

const ProfileRestaurantLayout = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customFetch(
          "https://localhost:7176/api/RestaurantProfile/getByMyRestaurant",
          { method: "GET" }
        );
        if (!res.ok) throw new Error("Lỗi khi lấy hồ sơ nhà hàng");

        const data = await res.json();
        // vì API trả về 1 object, không cần data[0]
        const profileData = data;

        // Chuẩn hóa giờ hiển thị (HH:mm:ss → HH:mm)
        if (profileData?.openAt)
          profileData.openAt = profileData.openAt.substring(0, 5);
        if (profileData?.closeAt)
          profileData.closeAt = profileData.closeAt.substring(0, 5);

        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const avatarUrl = await ImageUploader(file);
      setFormData((prev) => ({ ...prev, avatarUrl }));
    } catch (error) {
      console.error("Upload avatar failed:", error);
      alert("Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile?.accountId) return alert("Không tìm thấy ID nhà hàng!");

    const fixedFormData = {
      ...formData,
      openAt: formData.openAt ? `${formData.openAt}:00` : null,
      closeAt: formData.closeAt ? `${formData.closeAt}:00` : null,
    };

    try {
      const res = await customFetch(
        `https://localhost:7176/api/RestaurantProfile/updateProfile/${profile.accountId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fixedFormData),
        }
      );
      if (!res.ok) throw new Error("Lỗi cập nhật: " + res.status);
      console.log("Hồ sơ đã được cập nhật!");
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error(error);
      console.log(" Cập nhật thất bại!");
    }
  };

  if (loading)
    return <div className={styles.loading}>Đang tải thông tin...</div>;

  return (
    <div className={styles.restaurantProfileContainer}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <img
            src={
              formData.avatarUrl ||
              "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg"
            }
            alt={formData.fullName}
            className={styles.avatar}
          />
          {editing && (
            <label className={styles.avatarUploadBtn}>
              <FaCamera className={styles.btnIcon} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                hidden
              />
              {uploading ? "Đang tải..." : "Thay ảnh"}
            </label>
          )}
        </div>

        <div className={styles.headerInfo}>
          <h2>{formData.fullName || "Nhà hàng của tôi"}</h2>
          <p>{formData.address || "Chưa có địa chỉ"}</p>
          <p className={styles.description}>{formData.description || ""}</p>
          {/* ⭐ Rating */}
          <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${styles.starIcon} ${
                  i < Math.round(formData.rating || 0)
                    ? styles.filledStar
                    : styles.emptyStar
                }`}
              />
            ))}
            <span className={styles.ratingText}>
              {formData.rating?.toFixed(1) || 0} 
            </span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className={styles.profileActions}>
        {!editing ? (
          <button
            className={`${styles.actionBtn} ${styles.editBtn}`}
            onClick={() => setEditing(true)}
          >
            <FaEdit className={styles.btnIcon} /> Chỉnh sửa
          </button>
        ) : (
          <>
            <button
              className={`${styles.actionBtn} ${styles.saveBtn}`}
              onClick={handleSave}
              disabled={uploading}
            >
              <FaSave className={styles.btnIcon} /> Lưu
            </button>
            <button
              className={`${styles.actionBtn} ${styles.cancelBtn}`}
              onClick={() => {
                setFormData(profile);
                setEditing(false);
              }}
            >
              <FaTimes className={styles.btnIcon} /> Hủy
            </button>
          </>
        )}
      </div>

      {/* Thông tin */}
      <div className={styles.profileForm}>
        {/* Tên + Địa chỉ */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span className={styles.labelText}>Tên nhà hàng</span>
            <input
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>

          <label className={styles.formLabel}>
            <span className={styles.labelText}>Địa chỉ</span>
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>
        </div>

        {/* Mô tả */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span className={styles.labelText}>Mô tả</span>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>
        </div>

        {/* Số điện thoại & Email */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span className={styles.labelText}>Số điện thoại</span>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>

          <label className={styles.formLabel}>
            <span className={styles.labelText}>Email</span>
            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>
        </div>

        {/* Facebook & TikTok */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span className={styles.labelText}>Facebook URL</span>
            <input
              name="facebookUrl"
              value={formData.facebookUrl || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>

          <label className={styles.formLabel}>
            <span className={styles.labelText}>TikTok URL</span>
            <input
              name="tiktokUrl"
              value={formData.tiktokUrl || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>
        </div>

        {/* Giờ mở/đóng cửa */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span className={styles.labelText}>Giờ mở cửa</span>
            <input
              type="time"
              name="openAt"
              value={formData.openAt || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>

          <label className={styles.formLabel}>
            <span className={styles.labelText}>Giờ đóng cửa</span>
            <input
              type="time"
              name="closeAt"
              value={formData.closeAt || ""}
              onChange={handleChange}
              readOnly={!editing}
              className={styles.formInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProfileRestaurantLayout;
