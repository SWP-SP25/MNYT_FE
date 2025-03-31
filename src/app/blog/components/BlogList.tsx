"use client";
import { useEffect, useState } from "react";
import styles from "./components.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import { BlogPost, BlogResponse, Category } from "@/types/blog";

interface BlogListProps {
  category: Category;
  currentPage: number;
  blogs: BlogPost[];
  onPostDeleted: () => void;
}

const BlogList = ({
  blogs,
  category,
  currentPage,
  onPostDeleted,
}: BlogListProps) => {
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

  if (!blogs) {
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

  const startIdx = (currentPage - 1) * 10;
  const paginatedBlogs = blogs ? blogs.slice(startIdx, startIdx + 10) : [];

  console.log("Blogs to display:", paginatedBlogs);

  return (
    <div className={styles.blogList}>
      {paginatedBlogs.map((post) => (
        <div key={post.id} className={styles.blogCard}>
          {/* Thumbnail */}
          <div className={styles.thumbnailContainer}>
            {post.images[0] ? (
              <Image
                src={post.images[0].url}
                alt={post.title}
                width={300}
                height={200}
                className={styles.thumbnail}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/missing-picture.jpg";
                }}
              />
            ) : (
              <div className={styles.placeholderThumbnail}>No image</div>
            )}
          </div>

          {/* Nội dung bài viết */}
          <div className={styles.cardContent}>
            <div
              className={styles.categoryTag}
              style={{
                backgroundColor: getCategoryColor(post.category),
              }}
            >
              {post.category}
            </div>

            <Link href={`/blog/${post.id}`}>
              <h2 className={styles.title}>{post.title}</h2>
            </Link>

            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.authorName}</span>
            </div>

            <div className={styles.postStats}>
              <span>
                <FaRegComment /> {post.commentCount ?? 0}
              </span>
              <span>
                <FaRegHeart /> {post.likeCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get category color
function getCategoryColor(category: Category): string {
  const categoryColors: { [key in Category]: string } = {
    [Category.All]: "#6B7280",
    [Category.Experience]: "#3B82F6",
    [Category.Story]: "#EC4899",
    [Category.HealthPregnancy]: "#10B981",
    [Category.Fashion]: "#F59E0B",
    [Category.Nutrition]: "#8B5CF6",
  };
  return categoryColors[category] || "#6B7280";
}

export default BlogList;
