"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "./components.module.css";
import Image from "next/image";
import Link from "next/link";
import useAxios from "@/hooks/useFetchAxios";
import { BlogPostListResponse } from "@/types/blogPostList";
import axios from "axios";

interface BlogListProps {
  category: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPostDeleted: () => void;
}

export default function BlogList({
  category,
  currentPage,
  onPageChange,
  onPostDeleted,
}: BlogListProps) {
  const [totalPages, setTotalPages] = useState(1);
  const [blogPostListResponse, setBlogPostListResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://api-mnyt.purintech.id.vn/api/BlogPosts/all-paginated?PageNumber=${currentPage}&PageSize=6${
          category !== "all" ? `&category=${category}` : ""
        }`
      )
      .then((res) => {
        console.log(res);

        setBlogPostListResponse(res.data);
        setError(false);
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, category]);

  useEffect(() => {
    if (blogPostListResponse) {
      setTotalPages(Math.ceil(blogPostListResponse.data.totalItems / 6));
    }
  }, [blogPostListResponse]);

  // Gọi onPageChange khi currentPage thay đổi
  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  const handleDeletePost = async (postId: number) => {
    try {
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/BlogPosts/${postId}?accountId=1`
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

  if (
    !blogPostListResponse?.data.items ||
    blogPostListResponse?.data.items.length === 0
  ) {
    return (
      <div className={styles.empty}>
        <p>Chưa có bài viết nào trong mục này</p>
      </div>
    );
  }

  return (
    <div className={styles.blogList}>
      {blogPostListResponse.data.items.map((post) => (
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
                <i className="far fa-comment"></i> {post.commentCount}
              </span>
              <span>
                <i className="far fa-heart"></i> {post.likeCount}
              </span>
            </div>

            {/* Nút xóa bài viết */}
            <button
              onClick={() => handleDeletePost(post.id)}
              className={styles.deleteButton}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

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
