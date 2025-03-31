"use client";
import styles from "@/app/forum/styles/forum.module.css";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import PostList from "./components/PostList";
import CategorySidebar from "./components/CategorySidebar";
import ForumHeader from "./components/ForumHeader";
import ForumSearch from "./components/ForumSearch";
import ActiveUsers from "./components/ActiveUsers";
import { useAuth } from "@/hooks/useAuth";
import EditForumPost from "./CRUD/EditForumPost";
import CreateForumPost from "./CRUD/CreateForumPost";
import { getUserInfo } from "@/utils/getUserInfo";
import { notification } from "antd";

// Interface cho dữ liệu bài viết
interface ForumPost {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  createdAt: string;
  commentCount: number;
  likes: number;
  status: string;
}

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "experience", name: "Kinh nghiệm" },
  { id: "sharing", name: "Tâm sự" },
  { id: "health", name: "Sức khỏe mẹ & bé" },
  { id: "fashion", name: "Thời trang" },
  { id: "nutrition", name: "Dinh dưỡng" },
];

const ForumPage = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const postsPerPage = 10;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuth();
  const userInfo = getUserInfo(user);
  
  // Lấy trang từ localStorage chỉ lần đầu load
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Save current page to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("forumCurrentPage", currentPage.toString());
    }
  }, [currentPage]);
  
  const [totalPages, setTotalPages] = useState<number>(1);



  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPostId, setCurrentEditPostId] = useState<number | null>(null);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Đơn giản hóa fetchPosts để tránh re-render không cần thiết
  // const fetchPosts = async () => {
  //   setLoading(true);
  //   console.log("Page number fetch", currentPage);
  //   try {
  //     let url = `https://api-mnyt.purintech.id.vn/api/Posts/forums/paginated?pageNumber=${currentPage}&pageSize=${postsPerPage}`;
      
  //     if (currentCategory !== "all") {
  //       url = `https://api-mnyt.purintech.id.vn/api/Posts/forums/by-category/paginated?category=${currentCategory}&pageNumber=${currentPage}&pageSize=${postsPerPage}`;
  //     }

  //     if (searchQuery) {
  //       url += `&search=${encodeURIComponent(searchQuery)}`;
  //     }

  //     const response = await axios.get(url);
  //     if (response.data?.success) {
  //       console.log("response forum 2", response.data.data);
  //       setPosts(response.data.data.items || []);
  //       setTotalPages(Math.max(response.data.data.totalPages || 1, 1));
  //       setError(null);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching posts:", err);
  //     setError("Không thể tải bài viết. Vui lòng thử lại sau.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPosts = async () => {
    try {
      // Fetch all blog posts
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/forums`
      );

      if (response.data) {
        // Filter blogs to only show published posts or posts by current user
        const filteredPosts = response.data.data.filter((post: any) => 
          post.status === "Published" || 
          (userInfo && post.accountId === userInfo.id)
        );
        
        setFetchedPosts(filteredPosts);
        setPosts(filteredPosts);
        setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
      } else {
        setFetchedPosts([]);
        setPosts([]);
        setTotalPages(0);
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setLoading(false)
    }
  };

  // Category change handler
  const handleCategoryChange = (category: string) => {
    if (category === currentCategory) return; // Ngăn chặn re-render không cần thiết
    setCurrentCategory(category);
  };
  
  // Post creation handlers
  const handleCreatePost = () => {
    setShowCreatePost(true);

    fetchPosts();
  };

  const Context = React.createContext({ name: 'Default' });
  
  const [api, contextHolder] = notification.useNotification();
  const handlePostCreated = () => {
    api.info({
      message: `Đăng bài thành công, bài viết đang được phê duyệt`,
      description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
      placement:'topRight'
    });
    setShowCreatePost(false);
    fetchPosts();
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    if (page === currentPage) return; // Ngăn chặn re-render không cần thiết
    console.log("Changing to page:", page);
    setCurrentPage(page);
  };

  // Edit post handler
  const handleEditPost = (postId: number) => {
    setCurrentEditPostId(postId);
    setIsEditModalOpen(true);
  };

  // Refresh khi có yêu cầu refresh
  const handleRefresh = () => {
    setLoading(false); // Cho phép fetch lại
  };

  return (
    <div className={styles.forumContainer}>
      {/* Header của forum */}
      {contextHolder}
      <ForumHeader onCreatePost={handleCreatePost} />

      {/* Phần tìm kiếm */}
      <ForumSearch onSearch={handleSearch} />

      <div className={styles.forumContent}>
        {/* Sidebar danh mục bên trái */}
        <div className={styles.sidebarLeft}>
          <CategorySidebar
            categories={categories}
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Thành viên năng nổ */}
          <ActiveUsers />
        </div>

        {/* Nội dung chính */}
        <div className={styles.mainContent}>
          {/* Form tạo bài viết */}
          {showCreatePost && (
            <div className={styles.createPostOverlay}>
              <CreateForumPost
                currentUser={user}
                onPostCreated={handlePostCreated}
                onCancel={() => setShowCreatePost(false)}
              />
            </div>
          )}

          {/* Danh sách bài viết */}
          <PostList
            posts={posts}
            loading={loading}
            fetchPosts={fetchPosts}
            category={currentCategory}
            searchQuery={searchQuery}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          
          {/* Component phân trang */}
          {/* {!loading && !error && posts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )} */}

          {/* Modal chỉnh sửa bài viết */}
          {isEditModalOpen && currentEditPostId && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <EditForumPost
                  postId={currentEditPostId}
                  currentUser={user}
                  onPostUpdated={() => {
                    setIsEditModalOpen(false);
                    setLoading(false); // Cho phép fetch lại
                  }}
                  onCancel={() => setIsEditModalOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
