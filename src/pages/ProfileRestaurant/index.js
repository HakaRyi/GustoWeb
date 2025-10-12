import React from "react";
import { Outlet } from "react-router-dom";
import ResSideBar from "~/components/Restaurant/ResSideBar";
import styles from "./ProfileRes.module.scss";
import Header from "~/components/GlobalStyle/Header";
import Footer from "~/components/GlobalStyle/Footer";

const ProfileRestaurant = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainArea}>
        <ResSideBar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileRestaurant;