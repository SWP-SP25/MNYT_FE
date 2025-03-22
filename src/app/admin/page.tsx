"use client";

import React from "react";
import AdminLayout from "./components/admin-layout";
import { Card, CardBody } from "@nextui-org/react";
import styles from "./page.module.css";
import { BsPersonFill, BsMenuButton, BsHeart, BsChat, BsGraphUp, BsFileText, BsCart } from "react-icons/bs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

const blogData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Số lượt truy cập',
      data: [400, 300, 600, 200],
      borderColor: '#8884d8',
      backgroundColor: 'rgba(136, 132, 216, 0.5)',
      tension: 0.4,
    },
  ],
};

const orderData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  datasets: [
    {
      label: 'Số đơn hàng',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#82ca9d',
      backgroundColor: 'rgba(130, 202, 157, 0.5)',
      tension: 0.4,
    },
  ],
};

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className={styles.statsGrid}>
        {/* Total Membership purchase */}
        <Card>
          <CardBody>
            <h3>Total Membership Sale</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsMenuButton size={24} />
              </div>
              <span>45</span>
            </div>
          </CardBody>
        </Card>

        {/* Total amount of sales */}
        <Card>
          <CardBody>
            <h3>Total amount of sale</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsGraphUp size={24} />
              </div>
              <span>120.5M</span>
            </div>
          </CardBody>
        </Card>

        {/*Total Like */}
        <Card>
          <CardBody>
            <h3>Total Like</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsHeart size={24} />
              </div>
              <span>1,234</span>
            </div>
          </CardBody>
        </Card>

        {/* Total Comment */}
        <Card>
          <CardBody>
            <h3>Total Comment</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsChat size={24} />
              </div>
              <span>856</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Số lượt blog theo tuần */}
        <Card className={styles.chartCard}>
          <CardBody>
            <h3>Số lượt blog theo tuần</h3>
            <div className={styles.chart}>
              <Line options={options} data={blogData} />
            </div>
          </CardBody>
        </Card>

        {/* Số order theo tháng */}
        <Card className={styles.chartCard}>
          <CardBody>
            <h3>Số order theo tháng</h3>
            <div className={styles.chart}>
              <Line options={options} data={orderData} />
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
