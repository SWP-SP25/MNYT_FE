"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";
import Logo from "@/app/img/Logo.ico";
import { BsBell } from "react-icons/bs";
import styles from "./admin-layout.module.css";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Admin Header */}
        <header className={styles.adminHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <Image src={Logo} alt="Logo" width={40} height={40} />
              <span>Mầm Non Yêu Thương</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span>System Admin</span>
              <Image
                src="/images/huong-giang.jpg"
                alt="Admin"
                width={40}
                height={40}
                className={styles.avatar}
              />
            </div>
            <button className={styles.notificationBtn}>
              <BsBell />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
