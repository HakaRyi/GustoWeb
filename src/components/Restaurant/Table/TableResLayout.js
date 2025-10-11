import React, { useRef, useState } from "react";
import styles from "./TableResLayout.module.scss";
import ListTable from "./ListTable";
import ModalTable from "./ModalTable";
import { FaPlus } from "react-icons/fa";

const TableResLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const refreshListRef = useRef(() => {});

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refreshListRef.current();
  };

  return (
    <div className={styles.tableResLayoutContainer}>
      <div className={styles.header}>
        <h3>Quản lý bàn nhà hàng</h3>
        <button className={styles.createBtn} onClick={handleOpenModal}>
          <FaPlus className={styles.btnIcon} /> Tạo bàn mới
        </button>
      </div>
      <ListTable onSuccess={(fetchTables) => (refreshListRef.current = fetchTables)} />
      {isModalOpen && (
        <ModalTable
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default TableResLayout;