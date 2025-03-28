import { useState, useEffect } from "react";
import styles from "./components.module.css";
import { BarChart3 } from "lucide-react"; // Import icon từ lucide-react
import axios from "axios";

const ForumStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalMembers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Lấy tổng số bài viết forum
        const postsResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Posts/forums"
        );

        // Lấy tổng số thành viên
        const membersResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Accounts"
        );

        if (
          postsResponse.data &&
          postsResponse.data.data &&
          Array.isArray(postsResponse.data.data)
        ) {
          const totalPosts = postsResponse.data.data.length;
          const totalMembers = membersResponse.data.data.length;

          setStats({
            totalPosts,
            totalMembers,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.loadingState}>Đang tải thống kê...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsHeader}>
        <BarChart3 className={styles.statsIcon} size={18} />
        <h3 className={styles.statsTitle}>Thống kê diễn đàn</h3>
      </div>

      <div className={styles.statsList}>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>Tổng bài viết:</span>
          <span className={styles.statsValue}>{stats.totalPosts}</span>
        </div>
        <div className={styles.statsItem}>
          <span className={styles.statsLabel}>Thành viên:</span>
          <span className={styles.statsValue}>{stats.totalMembers}</span>
        </div>
      </div>
    </div>
  );
};

export default ForumStats;
