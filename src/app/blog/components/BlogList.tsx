"use client";
import { useEffect, useState, useMemo } from "react";
import { blogService, BlogPost, PaginatedResponse } from "@/app/services/api";
import styles from "./components.module.css";
import Image from "next/image";
import Link from "next/link";
import useAxios from "@/hooks/useFetchAxios";
import { BlogPostListResponse } from "@/types/blogPostList";
import axios from "axios";
<<<<<<< Updated upstream
=======
import { FaRegHeart, FaRegComment } from "react-icons/fa";
>>>>>>> Stashed changes

interface BlogListProps {
  category: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPostDeleted: () => void;
}

<<<<<<< Updated upstream
export default function BlogList({
  category,
  currentPage,
  onPageChange,
  onPostDeleted,
}: BlogListProps) {
  const [totalPages, setTotalPages] = useState(1);
  const [blogPostListResponse, setBlogPostListResponse] =
    useState<BlogPostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Sử dụng useMemo để tạo config phụ thuộc vào currentPage và category
  useEffect(() => {
    const response = axios.get(
      `https://api-mnyt.purintech.id.vn/api/BlogPosts/all-paginated?PageNumber=${currentPage}&PageSize=6${
        category !== "all" ? `&category=${category}` : ""
      }`
    );

    response
      .then((data) => {
        console.log("fetch blog ", data.data);
        setBlogPostListResponse(data.data);
        setError(false);
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
=======
const BlogList = ({ category, currentPage, onPageChange }: BlogListProps) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Posts/forums/by-category?category=${category}&page=${currentPage}`
        );
        console.log(response.data.data);
        setBlogs(response.data.data);
        setTotalPages(Math.ceil(response.data.total / 10));
      } catch (error) {
        setError("Lỗi khi tải bài viết");
      } finally {
>>>>>>> Stashed changes
        setLoading(false);
      });
  }, [category, currentPage]);

<<<<<<< Updated upstream
  // const {
  //   response: blogPostListResponse,
  //   error,
  //   loading,
  // } = useAxios<BlogPostListResponse>(config);

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
        `https://api-mnyt.purintech.id.vn/api/BlogPosts/${postId}`
      );
      onPostDeleted();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  console.log("Current posts state:", blogPostListResponse);

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

            {/* Nút xóa bài viết */}
            <button
              onClick={() => handleDeletePost(post.id)}
              className={styles.deleteButton}
            >
              Xóa
            </button>
=======
>>>>>>> Stashed changes
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
