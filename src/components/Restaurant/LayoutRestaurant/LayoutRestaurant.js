import React, { useRef , useState} from "react";
import styles from "./LayoutRestaurant.module.scss";
import ListLayout from "~/components/Restaurant/LayoutRestaurant/ListLayout";
import ModalLayout from "~/components/Restaurant/LayoutRestaurant/ModalLayout";
import { FaPlus } from "react-icons/fa";

const LayoutRestaurant = () => {
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
    <div className={styles.layoutRestaurantContainer}>
      <div className={styles.header}>
        <h3>Tổng quan bố cục nhà hàng</h3>
        <button className={styles.createBtn} onClick={handleOpenModal}>
          <FaPlus className={styles.btnIcon} /> Tạo bố cục mới
        </button>
      </div>
      <ListLayout onSuccess={(fetchLayouts) => (refreshListRef.current = fetchLayouts)} />
      {isModalOpen && (
        <ModalLayout
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default LayoutRestaurant;