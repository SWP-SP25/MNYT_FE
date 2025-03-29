"use client";
import styles from "@/app/forum/styles/forum.module.css";
import CreateBlogPost from "./CRUD/CreateForumPost";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import PostList from "./components/PostList";
import CategorySidebar from "./components/CategorySidebar";
import ForumHeader from "./components/ForumHeader";
import ForumSearch from "./components/ForumSearch";
import ActiveUsers from "./components/ActiveUsers";
import { useAuth } from "@/hooks/useAuth";
import EditForumPost from "./CRUD/EditForumPost";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const postsPerPage = 10; // Số bài viết mỗi trang

  const { user } = useAuth();

  // Thêm state để quản lý hiển thị modal chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPostId, setCurrentEditPostId] = useState<number | null>(
    null
  );

  // Hàm xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Hàm lấy danh sách bài viết
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let url;

      // Xử lý tìm kiếm một cách đơn giản hơn
      // if (searchQuery && searchQuery.trim() !== "") {
      //   url = `https://api-mnyt.purintech.id.vn/api/BlogPosts/search?keyword=${searchQuery}&page=${currentPage}&pageSize=${postsPerPage}`;
      // }
      // Lấy theo danh mục nếu không tìm kiếm
      if (currentCategory === "all") {
        url = `https://api-mnyt.purintech.id.vn/api/Posts/forums?page=${currentPage}&pageSize=${postsPerPage}&status=Published`;
      } else {
        url = `https://api-mnyt.purintech.id.vn/api/Posts/forums/by-category?category=${currentCategory}&page=${currentPage}&pageSize=${postsPerPage}&status=Published`;
      }

      console.log("Fetching posts from URL:", url);

      const response = await axios.get(url);

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          // First filter by status, then by search query
          const publishedPosts = response.data.data.filter((post: ForumPost) => post.status === "Published");
          const filteredPosts = publishedPosts.filter((post: ForumPost) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setPosts(filteredPosts);
          setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
          setError(null);
        } else {
          setPosts([]);
          setError("Không có dữ liệu bài viết");
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      setPosts([]);

      if (searchQuery) {
        setError(`Không tìm thấy bài viết với từ khóa "${searchQuery}"`);
      } else {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentCategory, searchQuery, currentPage, postsPerPage]);

  // Gọi API khi component mount hoặc khi category/search thay đổi
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, currentCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    fetchPosts(); // Tải lại danh sách bài viết sau khi tạo mới
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm mở modal chỉnh sửa thay vì chuyển trang
  const handleEditPost = (postId: number) => {
    setCurrentEditPostId(postId);
    setIsEditModalOpen(true);
  };

  return (
    <div className={styles.forumContainer}>
      {/* Header của forum */}
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

          {/* Chủ đề phổ biến - Tạm ẩn để hiển thị sau
          <PopularTopics />
          */}

          {/* Thành viên năng nổ */}
          <ActiveUsers />
        </div>

        {/* Nội dung chính */}
        <div className={styles.mainContent}>
          {/* Form tạo bài viết */}
          {showCreatePost && (
            <div className={styles.createPostOverlay}>
              <CreateBlogPost
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
            error={error}
            currentCategory={currentCategory}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRefresh={fetchPosts}
          />

          {/* Modal chỉnh sửa bài viết */}
          {isEditModalOpen && currentEditPostId && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <EditForumPost
                  postId={currentEditPostId}
                  currentUser={user}
                  onPostUpdated={() => {
                    setIsEditModalOpen(false);
                    fetchPosts(); // Hàm lấy lại danh sách bài viết sau khi cập nhật
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
