"use client";
import styles from "@/app/blog/styles/blog.module.css";
import BlogList from "./components/BlogList";
import CategoryFilter from "./Sort & Filter/CategoryFilter";
import Sidebar from "./sidebar/Sidebar";
import Pagination from "./Pagination/Pagination";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const BlogPage = () => {
  // State management
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1); // Bắt đầu với trang 1
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]); // State để lưu danh sách blog
  const blogsPerPage = 10; // Số lượng blog hiển thị trên mỗi trang
  const [posts, setPosts] = useState([]); // State để lưu trữ bài viết

  const fetchBlogs = async (category: string) => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/forums/by-category?category=${category}&page=${currentPage}`
      );
      setBlogs(response.data.data);
      setTotalPages(Math.ceil(response.data.total / blogsPerPage));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(currentCategory);
  }, [currentCategory, currentPage]);

  // Khôi phục trạng thái từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blogCurrentPage");
      if (saved) {
        setCurrentPage(Number(saved));
      }
    }
  }, []);

  // Handlers
  const handleCategoryChange = useCallback((category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset về trang 1 khi đổi category
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostDeleted = () => {
    // Refresh the blog list
    window.location.reload();
  };

  const refreshPosts = async () => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/forums/paginated?PageNumber=${currentPage}&PageSize=6`
      );
      setPosts(response.data.items);
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
    }
  };

  useEffect(() => {
    refreshPosts(); // Gọi hàm để lấy bài viết khi component mount
  }, [currentPage]);

  return (
    <div className={styles.blogContainer}>
      <div className={styles.mainContent}>
        <div className={styles.filterBar}>
          <CategoryFilter
            onCategoryChange={handleCategoryChange}
            currentCategory={currentCategory}
          />
        </div>
        <BlogList
          category={currentCategory}
          currentPage={currentPage}
          blogs={blogs}
          onPageChange={handlePageChange}
          onPostDeleted={handlePostDeleted}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};

export default BlogPage;
