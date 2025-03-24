"use client";
import { useEffect, useState } from "react";
import styles from "./components.module.css";

interface UserData {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  avatar: string;
  postCount: number; // Thêm số lượng bài viết
}

const ActiveUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách thành viên đăng nhiều bài viết nhất
        const response = await fetch(
          "https://api-mnyt.purintech.id.vn/api/Posts/top-authors"
        );

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu người dùng");
        }

        const userData = await response.json();

        // Kiểm tra cấu trúc dữ liệu từ API
        const authors = userData.data || userData; // Tùy thuộc vào cấu trúc API

        if (!authors || authors.length === 0) {
          setError("Không tìm thấy dữ liệu người dùng");
          setUsers([]);
          return;
        }

        // Chuyển đổi dữ liệu để phù hợp với kiểu UserData
        const usersWithPostCount = authors.map((author: any) => ({
          id: author.id,
          fullName: author.fullName || author.authorName || "Người dùng",
          userName: author.userName || "",
          email: author.email || "",
          avatar: author.avatar || "",
          postCount: author.postCount || 0, // Số lượng bài viết
        }));

        // Sắp xếp theo số lượng bài viết
        const sortedUsers = usersWithPostCount.sort(
          (a: UserData, b: UserData) => b.postCount - a.postCount
        );

        // Chỉ hiển thị tối đa 5 người dùng
        const activeUsers = sortedUsers.slice(0, 5);

        console.log("active ủe ré", activeUsers);
        setUsers(activeUsers);

        if (activeUsers.length === 0) {
          setError("Chưa có thành viên nào đăng bài");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        setError("Không thể tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={styles.sidebarContainer}>
        <h3 className={styles.sidebarTitle}>Thành viên năng nổ</h3>
        <div className={styles.loadingState}>Đang tải...</div>
      </div>
    );
  }

  if (error || users.length === 0) {
    return (
      <div className={styles.sidebarContainer}>
        <h3 className={styles.sidebarTitle}>Thành viên năng nổ</h3>
        <div className={styles.errorState}>
          {error || "Không tìm thấy dữ liệu người dùng"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebarContainer}>
      <h3 className={styles.sidebarTitle}>Thành viên năng nổ</h3>
      <ul className={styles.userList}>
        {users.map((user, id) => (
          <li key={id} className={styles.userItem}>
            <div className={styles.userAvatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} />
              ) : (
                <div className={styles.defaultAvatar}>{user.fullName}</div>
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fullName}</span>
              <span className={styles.userPostCount}>
                {user.postCount} bài viết
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
