"use client";
import styles from "@/app/blog/styles/blog.module.css";
import BlogList from "./components/BlogList";
import FilterSort from "./Sort & Filter/FilterSort";
import Sidebar from "./sidebar/Sidebar";
import Pagination from "./Pagination/Pagination";
import CreateBlogPost from "./CRUD/CreateBlogPost";
import { useState, useCallback, useEffect } from "react";

// Định nghĩa các types
type SortOption = "newest" | "oldest" | "most-viewed" | "most-commented";

const BlogPage = () => {
  // State management
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1); // Bắt đầu với trang 1
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const totalPages = 10; // Sau này sẽ lấy từ API
  const blogsPerPage = 10; // Số lượng blog hiển thị trên mỗi trang

  // Giả lập dữ liệu blog (thay thế bằng dữ liệu thực từ API)
  const allBlogs = Array.from(
    { length: 30 },
    (_, index) => `Blog ${index + 1}`
  ); // Giả lập 30 blog

  // Tính toán các blog cần hiển thị dựa trên trang hiện tại
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, startIndex + blogsPerPage);

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
    // Logic để làm mới danh sách bài viết
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
          blogs={currentBlogs} // Truyền danh sách blog hiện tại
          onPageChange={handlePageChange}
          onPostDeleted={refreshPosts} // Gọi lại để làm mới danh sách khi xóa
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
