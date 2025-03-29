"use client";

import styles from "./sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Định nghĩa type cho member
type Member = {
  name: string;
  postCount: number;
  avatar: string;
};

const Sidebar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Xóa phần fetch stats cũ
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.sidebar}>
      {/* Xóa phần thống kê diễn đàn
      <div className={styles.statsCard}>
        <h3>Thống kê diễn đàn</h3>
        <div className={styles.statItem}>
          <span>Tổng bài viết:</span>
          <strong>{totalPosts ? totalPosts : 0}</strong>
        </div>
        <div className={styles.statItem}>
          <span>Thành viên:</span>
          <strong>{totalMembers ? totalMembers : 0}</strong>
        </div>
      </div>
      */}
    </div>
  );
};

export default Sidebar;
