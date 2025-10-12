import React, { useRef, useState } from "react";
import styles from "./MenuLayout.module.scss";
import ListMenu from "~/components/Restaurant/Menu/ListMenu";
import ModalMenu from "~/components/Restaurant/Menu/ModalMenu";
import { FaPlus } from "react-icons/fa";

const MenuLayout = () => {
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
    <div className={styles.menuLayoutContainer}>
      <div className={styles.header}>
        <h3>Quản lý thực đơn</h3>
        <button className={styles.createBtn} onClick={handleOpenModal}>
          <FaPlus className={styles.btnIcon} /> Tạo món mới
        </button>
      </div>
      <ListMenu onSuccess={(fetchMenus) => (refreshListRef.current = fetchMenus)} />
      {isModalOpen && (
        <ModalMenu
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default MenuLayout;