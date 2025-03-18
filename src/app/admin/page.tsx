"use client";

import React from "react";
import AdminLayout from "./components/admin-layout";
import { Card, CardBody } from "@nextui-org/react";
import styles from "./page.module.css";
import { BsPersonFill } from "react-icons/bs";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className={styles.statsGrid}>
        <Card>
          <CardBody>
            <h3>Số người dùng hiện tại</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsPersonFill size={24} />
              </div>
              <span>120</span>
            </div>
            <select className={styles.timeSelect}>
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
            </select>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3>Người dùng mới</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsPersonFill size={24} />
              </div>
              <span>60%</span>
            </div>
            <div className={styles.progressBar}>{/* Add progress bar */}</div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
