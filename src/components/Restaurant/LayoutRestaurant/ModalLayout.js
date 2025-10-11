import React, { useState, useEffect } from "react";
import styles from "./ModalLayout.module.scss";
import { customFetch } from "~/config/customFetch";
import ImageUploader from "~/components/Cloundinary/ImageUploader";
import { FaTimes, FaCamera } from "react-icons/fa";

const ModalLayout = ({ isOpen, onClose, layout, isUpdate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    layoutUrl: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isUpdate && layout) {
      setFormData({
        name: layout.name || "",
        layoutUrl: layout.layoutImgUrl || "",
        description: layout.description || "",
      });
    }
  }, [isUpdate, layout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const layoutUrl = await ImageUploader(file);
      setFormData((prev) => ({ ...prev, layoutUrl }));
      console.log("Ảnh đã được tải lên!");
    } catch (error) {
      console.error("Upload image failed:", error);
      console.log(error.message || "Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isUpdate
        ? `https://localhost:7176/api/RestaurantLayout/updateLayout/${layout.layoutId}`
        : "https://localhost:7176/api/RestaurantLayout/createLayout";
      const res = await customFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`${isUpdate ? "Cập nhật" : "Tạo"} bố cục thất bại`);
      console.log(`${isUpdate ? "Cập nhật" : "Tạo"} bố cục thành công!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`${isUpdate ? "Update" : "Create"} layout failed:`, error);
      console.log(`${isUpdate ? "Cập nhật" : "Tạo"} bố cục thất bại!`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{isUpdate ? "Cập nhật bố cục" : "Tạo bố cục mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              Tên bố cục:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Hình ảnh:
              <div className={styles.imagePreview}>
                <img
                  src={formData.layoutUrl || "https://via.placeholder.com/300x200"}
                  alt="Layout preview"
                  className={styles.previewImage}
                />
                <label className={styles.uploadBtn}>
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    hidden
                  />
                  {uploading ? "Đang tải..." : "Chọn ảnh"}
                </label>
              </div>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Mô tả:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.formInput}
              />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={uploading}>
            {isUpdate ? "Cập nhật" : "Tạo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalLayout;