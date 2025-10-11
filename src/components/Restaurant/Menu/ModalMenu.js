import React, { useState, useEffect } from "react";
import styles from "./ModalMenu.module.scss";
import { customFetch } from "~/config/customFetch";
import ImageUploader from "~/components/Cloundinary/ImageUploader";
import { FaTimes, FaCamera } from "react-icons/fa";

const ModalMenu = ({ isOpen, onClose, menu, isUpdate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    oldPrice: 0,
    discountPercent: 0,
    startDiscount: "",
    endDiscount: "",
    isRecommended: false,
    status: true,
    type: "Đồ ăn",
    foodUrl: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isUpdate && menu) {
      setFormData({
        name: menu.foodName || "",
        price: menu.price || 0,
        oldPrice: menu.oldPrice || 0,
        discountPercent: menu.discountPercent || 0,
        startDiscount: menu.startDiscount ? menu.startDiscount.split("T")[0] : "",
        endDiscount: menu.endDiscount ? menu.endDiscount.split("T")[0] : "",
        isRecommended: menu.isRecommended || false,
        status: menu.status || true,
        type: menu.type || "Đồ ăn",
        foodUrl: menu.foodImgUrl || "",
        description: menu.description || "",
      });
    }
  }, [isUpdate, menu]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const foodUrl = await ImageUploader(file);
      setFormData((prev) => ({ ...prev, foodUrl }));
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
        ? `https://localhost:7176/api/RestaurantMenu/updateMenu/${menu.foodId}`
        : "https://localhost:7176/api/RestaurantMenu/createMenu";
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: parseFloat(formData.oldPrice),
        discountPercent: parseFloat(formData.discountPercent),
        startDiscount: formData.startDiscount || null,
        endDiscount: formData.endDiscount || null,
      };
      const res = await customFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${isUpdate ? "Cập nhật" : "Tạo"} món thất bại`);
      console.log(`${isUpdate ? "Cập nhật" : "Tạo"} món thành công!`);
      onSuccess(); // Gọi callback để thông báo cập nhật danh sách
      onClose();
    } catch (error) {
      console.log(`${isUpdate ? "Update" : "Create"} menu failed:`, error);
      alert(`${isUpdate ? "Cập nhật" : "Tạo"} món thất bại!`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{isUpdate ? "Cập nhật món ăn" : "Tạo món ăn mới"}</h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>
              Loại món:
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={styles.formInput}
              >
                <option value="Đồ ăn">Đồ ăn</option>
                <option value="Đồ uống">Đồ uống</option>
                <option value="Khác">Khác</option>
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Tên món:
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
              Giá (VNĐ):
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Giá cũ (VNĐ):
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                min="0"
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              % Giảm giá:
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                min="0"
                max="100"
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Ngày bắt đầu giảm giá:
              <input
                type="date"
                name="startDiscount"
                value={formData.startDiscount}
                onChange={handleChange}
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Ngày kết thúc giảm giá:
              <input
                type="date"
                name="endDiscount"
                value={formData.endDiscount}
                onChange={handleChange}
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Đề xuất:
              <input
                type="checkbox"
                name="isRecommended"
                checked={formData.isRecommended}
                onChange={handleChange}
                className={styles.checkbox}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Trạng thái (Hoạt động):
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className={styles.checkbox}
              />
            </label>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>
              Hình ảnh:
              <div className={styles.imagePreview}>
                <img
                  src={formData.foodUrl || "https://via.placeholder.com/300x200"}
                  alt="Menu preview"
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
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
          <button type="submit" className={`${styles.submitBtn} ${styles.fullWidth}`} disabled={uploading}>
            {isUpdate ? "Cập nhật" : "Tạo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalMenu;
