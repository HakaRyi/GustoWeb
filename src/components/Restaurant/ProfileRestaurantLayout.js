import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./ProfileResLayout.module.scss";
import { customFetch } from "~/config/customFetch";
import ImageUploader from "../Cloundinary/ImageUploader"; // Giả định đường dẫn
import { FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";

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
        setProfile(data[0]);
        setFormData(data[0]);
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
      alert("❌ Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile?.accountId) return alert("Không tìm thấy ID nhà hàng!");
    try {
      const res = await customFetch(
        `https://localhost:7176/api/RestaurantProfile/updateProfile/${profile.accountId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Lỗi cập nhật: " + res.status);
      console.log("✅ Hồ sơ đã được cập nhật!");
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error(error);
      console.log("❌ Cập nhật thất bại!");
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải thông tin...</div>;

  return (
    <div className={styles.restaurantProfileContainer}>
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
        </div>
      </div>

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

      <div className={styles.profileForm}>
        {[
          [
            ["fullName", "Tên nhà hàng"],
            ["description", "Mô tả", true],
          ],
          [
            ["address", "Địa chỉ"],
            ["phone", "Số điện thoại"],
          ],
          [
            ["email", "Email"],
            ["openHour", "Giờ mở cửa"],
          ],
          [
            ["facebookUrl", "Facebook URL"],
            ["tiktokUrl", "TikTok URL"],
          ],
        ].map((row, index) => (
          <div key={index} className={styles.formRow}>
            {row.map(([key, label, isTextArea]) => (
              <label key={key} className={styles.formLabel}>
                <span className={styles.labelText}>{label}</span>
                {isTextArea ? (
                  <textarea
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={styles.formInput}
                  />
                ) : (
                  <input
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={styles.formInput}
                  />
                )}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* <div className={styles.outletArea}>
        <Outlet />
      </div> */}
    </div>
  );
};

export default ProfileRestaurantLayout;