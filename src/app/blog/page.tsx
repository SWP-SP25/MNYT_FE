"use client";
import styles from "@/app/blog/styles/blog.module.css";
import BlogList from "./components/BlogList";
import FilterSort from "./Sort & Filter/FilterSort";
import Sidebar from "./sidebar/Sidebar";
import Pagination from "./Pagination/Pagination";
import CreateBlogPost from "./CRUD/CreateBlogPost";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// Định nghĩa các types
type SortOption = "newest" | "oldest" | "most-viewed" | "most-commented";

const BlogPage = () => {
  // State management
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1); // Bắt đầu với trang 1
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [blogs, setBlogs] = useState([]); // State để lưu danh sách blog
  const [totalPages, setTotalPages] = useState(0); // State cho tổng số trang
  const blogsPerPage = 10; // Số lượng blog hiển thị trên mỗi trang

  const fetchBlogs = async (category: string) => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/BlogPosts/by-category?category=${category}`
      );
      setBlogs(response.data.data);
      setTotalPages(Math.ceil(response.data.total / blogsPerPage));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(currentCategory);
  }, [currentCategory]);

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

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset về trang 1 khi đổi sort
  }, []);

  const handlePageChange = (page: number) => {
    console.log("recent page", page);

    setCurrentPage(page);
  };

  const refreshPosts = () => {
    fetchBlogs(currentCategory);
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.mainContent}>
        <CreateBlogPost onPostCreated={refreshPosts} />
        <FilterSort
          activeCategory={currentCategory}
          currentSort={sortBy}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
        <BlogList
          category={currentCategory}
          sortBy={sortBy}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPostDeleted={refreshPosts}
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
