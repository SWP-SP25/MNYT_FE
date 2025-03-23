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
    // Lấy top thành viên
    const fetchTopMembers = async () => {
      try {
        const response = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/BlogPosts/top-authors"
        );
        console.log("top-authors =>", response.data);
        const members = response.data.map((author: any) => ({
          name: author.authorName,
          postCount: author.postCount,
          avatar: author.avatar ? author.avatar : "/images/ava1.jpg",
        }));
        setTopMembers(members);
      } catch (error) {
        console.error("Lỗi fetch top authors:", error);
        setError("Chưa có thành viên nào.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Lấy tổng số bài viết
        axios
          .get("https://api-mnyt.purintech.id.vn/api/Posts/blogs")
          .then((response) => {
            console.log("postsRes =>", response.data);
            if (
              response.data &&
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
              console.log("Số bài viết:", response.data.data.length);
              setTotalPosts(response.data.data.length);
            } else {
              console.warn(
                "Cấu trúc API của BlogPosts/all không như mong đợi",
                response.data
              );
              setTotalPosts(0);
            }
          })
          .catch((err) => console.error("Lỗi BlogPosts/all:", err));

        // Lấy tổng số thành viên
        axios
          .get("https://api-mnyt.purintech.id.vn/api/Accounts")
          .then((accountResponse) => {
            console.log("accountsRes =>", accountResponse.data);
            // Kiểm tra cấu trúc dữ liệu: nếu data có key 'data' và trong đó có 'totalMembers'
            if (
              accountResponse.data &&
              accountResponse.data.data &&
              typeof accountResponse.data.data.length === "number"
            ) {
              console.log("Tổng thành viên:", accountResponse.data.data);
              setTotalMembers(accountResponse.data.data.length);
            } else {
              console.warn(
                "Cấu trúc API của Accounts không như mong đợi",
                accountResponse.data.data
              );
              setTotalMembers(0);
            }
          })
          .catch((err) => console.error("Lỗi Accounts:", err));
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchTopMembers();
    fetchStats();
  }, []);

  return (
    <div className={styles.sidebar}>
      {/* Thống kê diễn đàn */}
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
