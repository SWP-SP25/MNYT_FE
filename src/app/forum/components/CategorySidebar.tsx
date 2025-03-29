// components/CategorySidebar.tsx
import styles from "@/app/forum/components/components.module.css";
import ForumStats from "./ForumStats";
import ActiveUsers from "./ActiveUsers";
import { useState, useEffect } from "react";
import axios from "axios";

interface CategorySidebarProps {
  categories: Array<{ id: string; name: string }>;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySidebar = ({
  categories,
  currentCategory,
  onCategoryChange,
}: CategorySidebarProps) => {
  const [activeUsers, setActiveUsers] = useState<
    Array<{
      name: string;
      postCount: number;
      avatar?: string;
    }>
  >([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        // Lấy danh sách bài viết forum
        const postsResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Posts/forums"
        );

        // Lấy danh sách users
        const usersResponse = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Accounts"
        );

        if (postsResponse.data?.data && usersResponse.data?.data) {
          const posts = postsResponse.data.data;
          const users = usersResponse.data.data;

          // Tạo map đếm số bài viết của mỗi user
          const postCountByUser = posts.reduce(
            (acc: { [key: string]: number }, post: any) => {
              const authorId = post.authorId;
              acc[authorId] = (acc[authorId] || 0) + 1;
              return acc;
            },
            {}
          );

          // Tạo danh sách active users với số bài viết
          const activeUsersList = users
            .map((user: any) => ({
              name: user.name,
              postCount: postCountByUser[user.id] || 0,
              avatar: user.avatar,
            }))
            .sort((a: any, b: any) => b.postCount - a.postCount) // Sắp xếp theo số bài viết
            .slice(0, 5); // Lấy 5 người dùng tích cực nhất

          setActiveUsers(activeUsersList);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng tích cực:", error);
      }
    };

    fetchActiveUsers();
  }, []);

  // Biểu tượng cho từng danh mục
  const categoryIcons: { [key: string]: string } = {
    all: "📋",
    experience: "💡",
    sharing: "💬",
    health: "👶",
    fashion: "👚",
    nutrition: "🍎",
  };

  return (
    <div className={styles.sidebarContainer}>
      <h3 className={styles.sidebarTitle}>Danh mục</h3>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`${styles.categoryItem} ${
              currentCategory === category.id ? styles.activeCategory : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className={styles.categoryIcon}>
              {categoryIcons[category.id] || "📄"}
            </span>
            <span className={styles.categoryName}>{category.name}</span>
          </li>
        ))}
      </ul>

      {/* Hiển thị thống kê */}
      <ForumStats />
    </div>
  );
};

export default CategorySidebar;
