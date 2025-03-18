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
  const [topMembers, setTopMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPosts, setTotalPosts] = useState(0); // State cho tổng số bài viết
  const [totalMembers, setTotalMembers] = useState(0); // State cho tổng số thành viên

  const trendingTags = [
    "Mang thai tháng đầu",
    "Dinh dưỡng",
    "Thai giáo",
    "Sức khỏe",
    "Làm đẹp",
    "Tâm sự",
  ];

  useEffect(() => {
    const fetchTopMembers = async () => {
      try {
        const response = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/BlogPosts/top-authors"
        );
        const members = response.data.map((author: any) => ({
          name: author.authorName,
          postCount: author.postCount,
          avatar: author.avatar ? author.avatar : "/images/ava1.jpg",
        }));
        setTopMembers(members);
      } catch (error) {
        setError("Chưa có thành viên nào.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Lấy tổng số bài viết
        const postsResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/BlogPosts/all"
        );
        setTotalPosts(postsResponse.data.length);

        // Lấy tổng số thành viên
        const accountResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Accounts"
        );
        setTotalMembers(accountResponse.data.totalMembers);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchTopMembers();
    fetchStats(); // Gọi hàm lấy thống kê
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.statsCard}>
        <h3>Thống kê diễn đàn</h3>
        <div className={styles.statItem}>
          <span>Tổng bài viết:</span>
          <strong>{totalPosts}</strong>
        </div>
        <div className={styles.statItem}>
          <span>Thành viên:</span>
          <strong>{totalMembers}</strong>
        </div>
      </div>

      {/* Top thành viên tích cực */}
      <div className={styles.topMembers}>
        <h3>Thành viên tích cực</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className={styles.memberList}>
            {topMembers.map((member, index) => (
              <div key={index} className={styles.memberItem}>
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={48}
                  height={48}
                  className={styles.memberAvatar}
                />
                <div className={styles.memberInfo}>
                  <strong>{member.name}</strong>
                  <span>{member.postCount} bài viết</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chủ đề đang hot */}
      <div className={styles.trendingTopics}>
        <h3>Chủ đề đang hot</h3>
        <div className={styles.tagCloud}>
          {trendingTags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${encodeURIComponent(tag)}`}
              className={styles.trendingTag}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
