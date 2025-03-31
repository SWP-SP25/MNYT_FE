"use client";
import styles from "@/app/blog/styles/blog.module.css";
import BlogList from "./components/BlogList";
import BlogFilter from "./Sort & Filter/BlogFilter";
import Pagination from "./Pagination/Pagination";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { getUserInfo } from "@/utils/getUserInfo";

const BlogPage = () => {
  // State management
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentSort, setCurrentSort] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fetchedBlogs, setFetchedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const blogsPerPage = 10;
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();
  const userInfo = getUserInfo(user);

  const fetchBlogs = async () => {
    try {
      // Fetch all blog posts
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/blogs`
      );

      if (response.data) {
        // Filter blogs to only show published posts or posts by current user
        const filteredBlogs = response.data.data.filter((blog: any) => 
          blog.status === "Published" || 
          (userInfo && blog.accountId === userInfo.id)
        );
        
        setFetchedBlogs(filteredBlogs);
        setBlogs(filteredBlogs);
        setTotalPages(Math.ceil(filteredBlogs.length / blogsPerPage));
      } else {
        setFetchedBlogs([]);
        setBlogs([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, userInfo]); // Add userInfo as dependency to refetch when user changes

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
    console.log("Cate", category);
    if (category != "all") {
      setBlogs(fetchedBlogs.filter((x) => x.category == category));
      setTotalPages(
        Math.ceil(
          fetchedBlogs.filter((x) => x.category == category).length /
            blogsPerPage
        )
      ); // Adjust total pages based on the length of the response
    } else {
      setBlogs(fetchBlogs);
      setTotalPages(Math.ceil(fetchedBlogs.length / blogsPerPage)); // Adjust total pages based on the length of the response
    }
    console.log("filter", fetchedBlogs);
    console.log("filter", blogs);

    setCurrentCategory(category);
    setCurrentPage(1); // Reset về trang 1 khi đổi category
    localStorage.setItem("blogCurrentCategory", category);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("blogCurrentPage", String(page));
  };

  const handlePostDeleted = () => {
    // Refresh the blog list
    fetchBlogs();
  };

  const refreshPosts = async () => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/blogs?page=${currentPage}&pageSize=6`
      );
      // Adjust this based on your actual API response structure
      setPosts(response.data.data || response.data);
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
            currentCategory={currentCategory}
            currentSort={currentSort}
          />
        </div>
        <BlogList
          blogs={blogs}
          category={currentCategory}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPostDeleted={handlePostDeleted}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BlogPage;
