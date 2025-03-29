"use client";
import styles from "@/app/blog/styles/blog.module.css";
import BlogList from "./components/BlogList";
import BlogFilter from "./Sort & Filter/BlogFilter";
import Sidebar from "./sidebar/Sidebar";
import Pagination from "./Pagination/Pagination";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const BlogPage = () => {
  // State management
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentSort, setCurrentSort] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const blogsPerPage = 10;
  const [posts, setPosts] = useState([]);

  const fetchBlogs = async (category: string, sort: string) => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/forums/by-category?category=${category}&page=${currentPage}&sort=${sort}`
      );

      setBlogs(response.data.data);
      setTotalPages(Math.ceil(response.data.total / blogsPerPage));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(currentCategory, currentSort);
  }, [currentCategory, currentSort, currentPage]);

  // Khôi phục trạng thái từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("blogCurrentPage");
      const savedCategory = localStorage.getItem("blogCurrentCategory");
      const savedSort = localStorage.getItem("blogCurrentSort");

      if (savedPage) setCurrentPage(Number(savedPage));
      if (savedCategory) setCurrentCategory(savedCategory);
      if (savedSort) setCurrentSort(savedSort);
    }
  }, []);

  // Handlers
  const handleCategoryChange = useCallback((category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset về trang 1 khi đổi category
    localStorage.setItem("blogCurrentCategory", category);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setCurrentSort(sort);
    localStorage.setItem("blogCurrentSort", sort);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("blogCurrentPage", String(page));
  };

  const handlePostDeleted = () => {
    // Refresh the blog list
    fetchBlogs(currentCategory, currentSort);
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
          <BlogFilter
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            currentCategory={currentCategory}
            currentSort={currentSort}
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
