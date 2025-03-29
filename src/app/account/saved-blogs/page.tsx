"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FaTrash, FaEye, FaBookmark } from "react-icons/fa";
import styles from "./savedBlogs.module.css";
import { useAuth } from "@/hooks/useAuth";

interface SavedBlog {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  authorName: string;
  category: string;
  createdAt: string;
}

export default function Page() {
  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        setLoading(true);
        // Lấy ID của người dùng hiện tại
        const userId = user?.id || 1;

        // Cập nhật URL đúng với API Swagger
        const response = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Interactions/bookmarks?accountId=${userId}`
        );

        setSavedBlogs(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching saved blogs:", err);
        setError("Không thể tải danh sách bài viết đã lưu");
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, [user]);

  const handleRemoveSaved = async (blogId: number) => {
    try {
      const userId = user?.id || 1;

      // Gọi API để xóa bài viết khỏi danh sách đã lưu
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${blogId}?accountId=${userId}`
      );

      // Xóa khỏi localStorage
      localStorage.removeItem(`saved-${blogId}`);

      // Cập nhật danh sách hiển thị
      setSavedBlogs(savedBlogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setError("Không thể xóa bài viết khỏi danh sách đã lưu");
    }
  };

  const handleViewBlog = (blogId: number) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <div className={styles.savedBlogsContainer}>
      <h1 className={styles.pageTitle}>Bài viết đã lưu</h1>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải bài viết đã lưu...</p>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && savedBlogs.length === 0 && (
        <div className={styles.emptyState}>
          <FaBookmark size={50} className={styles.emptyIcon} />
          <p>Bạn chưa lưu bài viết nào</p>
          <button
            className={styles.browseButton}
            onClick={() => router.push("/blog")}
          >
            Duyệt bài viết
          </button>
        </div>
      )}

      {savedBlogs.length > 0 && (
        <div className={styles.blogGrid}>
          {savedBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.blogImageContainer}>
                <Image
                  src={blog.coverImage || "/images/default-cover.jpg"}
                  alt={blog.title}
                  width={300}
                  height={180}
                  className={styles.blogImage}
                />
                <div className={styles.categoryTag}>{blog.category}</div>
              </div>

              <div className={styles.blogContent}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogDescription}>
                  {blog.description?.substring(0, 100)}...
                </p>
                <div className={styles.blogMeta}>
                  <span className={styles.authorName}>{blog.authorName}</span>
                  <span className={styles.savedDate}>
                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className={styles.blogActions}>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewBlog(blog.id)}
                >
                  <FaEye />
                  <span>Xem</span>
                </button>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveSaved(blog.id)}
                >
                  <FaTrash />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
