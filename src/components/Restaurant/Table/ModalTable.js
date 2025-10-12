import React, { useState, useEffect } from "react";
import styles from "./ModalTable.module.scss";
import { customFetch } from "~/config/customFetch";
import { FaTimes } from "react-icons/fa";

const ModalTable = ({ isOpen, onClose, table, isUpdate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    personNumber: 0,
    position: "",
    description: "",
    status: "Available",
    isVip: false,
    minCharge: 0,
    deposit: 0,
  });

  useEffect(() => {
    if (isUpdate && table) {
      setFormData({
        name: table.name || "",
        personNumber: table.personNumber || 0,
        position: table.position || "",
        description: table.description || "",
        status: table.status || "Available",
        isVip: table.isVip || false,
        minCharge: table.minCharge || 0,
        deposit: table.deposit || 0,
      });
    }
  }, [isUpdate, table]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isUpdate
        ? `https://localhost:7176/api/RestaurantTable/updateTable/${table.tableId}`
        : "https://localhost:7176/api/RestaurantTable/createTable";
      
      // Chuyển status từ chuỗi sang số
      const statusMap = {
        Available: 0,
        Reserved: 1,
        Occupied: 2,
      };
      const payload = {
        ...formData,
        personNumber: parseInt(formData.personNumber),
        minCharge: formData.minCharge ? parseFloat(formData.minCharge) : null,
        deposit: parseFloat(formData.deposit),
        status: statusMap[formData.status] || 0, // Chuyển status thành số
      };
      console.log("Payload gửi đi:", payload); // Log payload để debug

      const res = await customFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Lấy chi tiết lỗi từ response
        throw new Error(
          `${isUpdate ? "Cập nhật" : "Tạo"} bàn thất bại: ${res.status} - ${errorData.message || "Không có thông tin lỗi"}`
        );
      }

      console.log(`${isUpdate ? "Cập nhật" : "Tạo"} bàn thành công!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`${isUpdate ? "Update" : "Create"} table failed:`, error);
      console.log(`${isUpdate ? "Cập nhật" : "Tạo"} bàn thất bại! ${error.message}`);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalTableOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalTableContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{isUpdate ? "Cập nhật bàn" : "Tạo bàn mới"}</h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>
              Tên bàn:
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
              Số người:
              <input
                type="number"
                name="personNumber"
                value={formData.personNumber}
                onChange={handleChange}
                min="1"
                required
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Vị trí:
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Trạng thái:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={styles.formInput}
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              VIP:
              <input
                type="checkbox"
                name="isVip"
                checked={formData.isVip}
                onChange={handleChange}
                className={styles.checkbox}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Phí tối thiểu (VNĐ):
              <input
                type="number"
                name="minCharge"
                value={formData.minCharge}
                onChange={handleChange}
                min="0"
                className={styles.formInput}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Tiền cọc (VNĐ):
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                min="0"
                required
                className={styles.formInput}
              />
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
          <button type="submit" className={`${styles.submitBtn} ${styles.fullWidth}`}>
            {isUpdate ? "Cập nhật" : "Tạo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTable;