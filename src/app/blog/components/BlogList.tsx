"use client";
import { useEffect, useState } from "react";
import styles from "./components.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { BlogPost, BlogResponse } from "@/types/blog";

interface BlogListProps {
  category: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPostDeleted: () => void;
}

const BlogList = ({
  category,
  currentPage,
  onPageChange,
  onPostDeleted,
}: BlogListProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.role === "Admin");
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get<BlogResponse>(
          `https://api-mnyt.purintech.id.vn/api/Posts/blogs/by-category/paginated?category=${category}&PageNumber=${currentPage}&PageSize=10`
        );
        console.log("My fetch blog lít", response.data.data);
        setBlogs(response.data.data);
        setTotalPages(Math.ceil(response.data.total / 10));
      } catch (error) {
        setError("Lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, currentPage]);

  const handleDeletePost = async (postId: number) => {
    try {
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`
      );
      onPostDeleted();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className={styles.empty}>
        <p>Chưa có bài viết nào trong mục này</p>
      </div>
    );
  }

  return (
    <div className={styles.blogList}>
      {blogs.map((post) => (
        <div key={post.id} className={styles.blogCard}>
          {/* Thumbnail */}
          <div className={styles.thumbnailContainer}>
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={300}
                height={200}
                className={styles.thumbnail}
              />
            ) : (
              <div className={styles.placeholderThumbnail}>No image</div>
            )}
          </div>

          {/* Content */}
          <div className={styles.cardContent}>
            {/* Category tag */}
            <div
              className={styles.categoryTag}
              style={{
                backgroundColor: getCategoryColor(post.category),
              }}
            >
              {post.category ? post.category : "Dành cho mẹ bầu"}
            </div>

            {/* Title */}
            <Link href={`/blog/${post.id}`}>
              <h2 className={styles.title}>{post.title}</h2>
            </Link>

            {/* Author info */}
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.authorName}</span>
            </div>

            {/* Post stats */}
            <div className={styles.postStats}>
              <span>
                <FaRegComment /> {post.commentCount}
              </span>
              <span>
                <FaRegHeart /> {post.likeCount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get category color
function getCategoryColor(category: string): string {
  const categoryColors: { [key: string]: string } = {
    "Tất cả": "#6B7280",
    "Kinh nghiệm": "#3B82F6",
    "Tâm sự": "#EC4899",
    "Sức khỏe mẹ & bé": "#10B981",
    "Thời trang": "#F59E0B",
    "Dinh dưỡng": "#8B5CF6",
  };
  return categoryColors[category] || "#6B7280";
}

export default BlogList;
