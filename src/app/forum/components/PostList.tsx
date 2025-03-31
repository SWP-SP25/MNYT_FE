// components/PostList.tsx
import { useState, useEffect, useRef } from "react";
import styles from "@/app/forum/components/components.module.css";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import DeletePostModal from "../CRUD/DeleteForumPost";
import { useAuth } from "@/hooks/useAuth";
import CreateForumPost from "../CRUD/CreateForumPost";
import deleteStyles from "../CRUD/styles/deleteForumPost.module.css";
import { getUserInfo } from "@/utils/getUserInfo";
import Pagination from "../Pagination/Pagination";

// Thêm interface cho dữ liệu tài khoản
interface Account {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

// Thêm interface cho kiểu dữ liệu bài viết
interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  createDate: string;
  accountId: number;
  accountName: string;
  accountAvatar: string;
  authorId: number;
  isAnonymous: boolean;
  comments: any[];
  likes: number;
  status: string;
}

// Cập nhật kiểu dữ liệu cho props
interface PostListProps {
  category: string;
  searchQuery: string;
  fetchPosts: () => void;
  posts:  Post[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page:number) => void;
}

const PostList = ({ category, searchQuery, fetchPosts, posts, loading,totalPages, currentPage, setCurrentPage }: PostListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Thêm state để lưu trữ danh sách tài khoản
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
  
  const [error, setError] = useState<string | null>(null);
  //const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const postsPerPage = 10;

  // Reference to track if we're already checking for updates
  const isCheckingRef = useRef(false);

  // Thêm state cho modal chỉnh sửa và xóa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Thêm state để lưu trữ bài viết đang được chỉnh sửa
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lấy thông tin người dùng hiện tại
  const userInfo = getUserInfo(user);

  // Thêm state để theo dõi trạng thái chỉnh sửa và bài viết đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);

  // Add state for real-time post stats
  const [postStats, setPostStats] = useState<{[key: string]: {likes: number, comments: number}}>({});
  
  // Function to fetch fresh post stats
  const fetchPostStats = async (forceReload = true) => {
    try {
      // Luôn buộc làm mới và bỏ qua cache
      const cacheBuster = `?t=${new Date().getTime()}`;
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/forums${cacheBuster}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
      
      if (response.data && response.data.success && response.data.data) {
        const statsMap: {[key: string]: {likes: number, comments: number}} = {};
        
        // Create a map of post ID -> stats
        response.data.data.forEach((post: any) => {
          statsMap[post.id] = {
            likes: post.likeCount || 0,
            comments: post.commentCount || 0
          };
        });
        
        setPostStats(statsMap);
        console.log(`Cập nhật thống kê bài viết:`, statsMap);
      }
    } catch (error) {
      console.error("Error fetching post stats:", error);
    }
  };

  // Force refresh từ server
  const forceRefresh = async () => {
    try {
      // Gọi fetchPosts với force refresh
      fetchPosts();
      // Gọi fetchPostStats với force refresh
      await fetchPostStats(true);
      // Thông báo cho người dùng
      alert("Đã cập nhật dữ liệu mới nhất từ máy chủ!");
    } catch (error) {
      console.error("Error during force refresh:", error);
    }
  };

  // Fetch post stats when component mounts and whenever posts change
  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
      fetchPostStats();
      
      // Set interval to refresh stats every 3 seconds
      const intervalId = setInterval(() => {
        fetchPostStats();
      }, 3000); // Reduced to 3 seconds for more frequent updates
      
      return () => clearInterval(intervalId);
    }
  }, [posts]);

  // Add focus event listener to refresh stats when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      // Force refresh stats when window gets focus
      if (Array.isArray(posts) && posts.length > 0) {
        fetchPostStats(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [posts]);

  useEffect(() => {
    

    fetchPosts();
  }, [category, searchQuery, currentPage]);

  // Thêm effect để kiểm tra và cập nhật các bài viết có like/comment đã thay đổi
  // FIXED: Removed localPosts from dependency array and added check to prevent infinite loop
  useEffect(() => {
    // Kiểm tra localStorage để xem có bài viết nào được like/comment gần đây không
    const checkForUpdates = () => {
      // Prevent re-entrant calls that could cause infinite loops
      if (isCheckingRef.current) return;

      isCheckingRef.current = true;

      try {
        const currentPosts = [...posts];
        let hasUpdates = false;

        // Kiểm tra các bài viết có trạng thái like được lưu trong localStorage
        currentPosts.forEach((post, index) => {
          // Kiểm tra trạng thái like
          const likeStatus = localStorage.getItem(`forum-liked-${post.id}`);
          if (likeStatus) {
            const isLiked = JSON.parse(likeStatus);
            // Nếu bài viết được like và chưa được cập nhật trong danh sách
            if (isLiked) {
              // Cập nhật số lượt like
              if (currentPosts[index].likes !== post.likes + 1) {
                currentPosts[index] = {
                  ...post,
                  likes: post.likes + 1,
                };
                hasUpdates = true;
              }
            }
          }
        });

        if (hasUpdates) {
          // Instead of directly setting posts (which we can't do with props)
          // Let's refresh the stats
          fetchPostStats();
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Check for updates once when component mounts or posts change
    checkForUpdates();

    // Thêm event listener để kiểm tra khi người dùng quay lại từ trang chi tiết
    const handleFocus = () => {
      checkForUpdates();
    };

    window.addEventListener("focus", handleFocus);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Tải danh sách tài khoản khi component được khởi tạo
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/Accounts"
        );
        if (response.data && response.data.success && response.data.data) {
          setAccounts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setAccountsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Hàm lấy tên người dùng dựa trên authorId
  const getAuthorName = (authorId: number, isAnonymous: boolean) => {
    if (isAnonymous) return "Người dùng ẩn danh";

    const account = accounts.find((acc) => acc.id === authorId);

    if (account) {
      const name =
        account.fullName || account.userName || `Người dùng ${authorId}`;
      return name;
    }

    return `Người dùng ${authorId}`;
  };

  // Sắp xếp bài viết theo thời gian tạo (mới nhất lên đầu)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
  });

  // Thêm hàm để giới hạn số lượng bài viết hiển thị trên mỗi trang
  const paginatePosts = (posts: Post[], page: number, limit: number = 10) => {
    if (!Array.isArray(posts)) return [];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return posts.slice(startIndex, endIndex);
  };

  const categoryNames: { [key: string]: string } = {
    all: "Tất cả",
    experience: "Kinh nghiệm",
    sharing: "Tâm sự",
    health: "Sức khỏe mẹ & bé",
    fashion: "Thời trang",
    nutrition: "Dinh dưỡng",
  };

  // Format date an toàn và điều chỉnh múi giờ +7
  const formatDate = (dateString: string) => {
    try {
      // Tạo đối tượng Date từ chuỗi thời gian
      const date = new Date(dateString);

      // Thêm 7 giờ cho múi giờ Việt Nam
      const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

      return formatDistanceToNow(vietnamTime, {
        addSuffix: true,
        locale: vi,
      });
    } catch (e) {
      return "Thời gian không xác định";
    }
  };

  // Simplify the filtering logic
  const filteredPosts = category == "all"
    ? sortedPosts
    : sortedPosts.filter((post) => post.category === category);

    console.log("filteredPosts forum",filteredPosts)
  // Don't apply status filtering at this level since the API should handle that
  // This ensures any posts returned from the API will be shown

  // Áp dụng phân trang cho các bài viết đã lọc
  //const displayedPosts = paginatePosts(filteredPosts, currentPage);

  // Modify getPostLikeCount to use the fresh stats when available
  const getPostLikeCount = (post: Post) => {
    // First check if we have fresh stats from the API
    if (postStats[post.id]) {
      return postStats[post.id].likes;
    }
    
    // Fall back to the existing logic if no fresh stats
    const likeStatus = localStorage.getItem(`forum-liked-${post.id}`);
    if (likeStatus) {
      const isLiked = JSON.parse(likeStatus);
      if (isLiked) {
        return (post.likes || 0) + 1;
      }
    }
    return post.likes || 0;
  };
  
  // Add a function to get the comment count
  const getPostCommentCount = (post: Post) => {
    // Use fresh stats from API when available
    if (postStats[post.id]) {
      return postStats[post.id].comments;
    }
    
    // Fall back to post data
    return post.comments?.length || 0;
  };

  // Hàm xử lý khi người dùng nhấn nút Chỉnh sửa
  const handleEditPost = (postId: number, post: any) => {
    setEditPost(post);
    setIsEditing(true);
  };

  // Hàm xử lý khi chỉnh sửa hoàn tất
  const handleEditComplete = () => {
    setIsEditing(false);
    setEditPost(null);
    fetchPosts();
  };

  // Hàm xử lý khi hủy chỉnh sửa
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  // Hàm xử lý khi nhấn nút xóa
  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  // Hàm xử lý xác nhận xóa bài viết
  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    try {
      setIsDeleting(true);
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/Posts/${selectedPost.id}?accountId=${userInfo?.id}`
      );
      setIsDeleteModalOpen(false);
      // Cập nhật danh sách bài viết
      fetchPosts();
      // Thông báo xóa thành công
      alert("Bài viết đã được xóa thành công");
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      alert("Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsDeleting(false);
      setSelectedPost(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h3>Đã xảy ra lỗi</h3>
        <p>{error}</p>
        <button onClick={fetchPosts} className={styles.createPostButton}>
          Thử lại
        </button>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>
          Không có bài viết nào trong danh mục {categoryNames[category]}
        </h3>
        <p>Hãy là người đầu tiên chia sẻ kinh nghiệm của bạn!</p>
        <button onClick={fetchPosts} className={styles.createPostButton}>
          Làm mới
        </button>
      </div>
    );
  }

  return (
    <div className={styles.postListContainer}>
      <h2 className={styles.categoryTitle}>
        {categoryNames[category] || "Tất cả bài viết"}
      </h2>

      <div className={styles.postList}>
        {filteredPosts.map((post: Post, id: number) => {

          // Xác định tên tác giả dựa trên isAnonymous
          const authorName =
            post.isAnonymous === true
              ? "Người dùng ẩn danh"
              : post.accountName ||
              getAuthorName(post.authorId, post.isAnonymous);

          // Avatar placeholder
          const avatarLetter = post.isAnonymous
            ? "?"
            : authorName.charAt(0).toUpperCase();

          // Use the updated functions to get real-time stats
          const actualLikes = getPostLikeCount(post);
          const actualComments = getPostCommentCount(post);

          return (
            <div key={id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatarPlaceholder}>{avatarLetter}</div>
                  <div>
                    <p className={styles.authorName}>{authorName}</p>
                    <p className={styles.postDate}>
                      {formatDate(post.createDate)}
                    </p>
                  </div>
                </div>
                <div className={styles.postCategory}>
                  {categoryNames[post.category] || "Chủ đề khác"}
                </div>
              </div>

              {/* Only show status badge for the post author */}
              {post.authorId === user?.id && (
                <div className={styles.postStatus}>
                  <span className={`${styles.statusBadge} ${styles[post.status.toLowerCase()]}`}>
                    {post.status}
                  </span>
                </div>
              )}

              <Link href={`/forum/${post.id}`}>
                <h3 className={styles.postTitle}>{post.title}</h3>
              </Link>

              <div className={styles.postContent}>
                {post.content && post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </div>

              {post.image && (
                <div className={styles.postImageContainer}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.postImage}
                  />
                </div>
              )}

              <div className={styles.postFooter}>
                <div className={styles.postStats}>
                  <div className={styles.commentCount}>
                    <span className={styles.icon}>💬</span>
                    {actualComments} bình luận
                  </div>
                  <div className={styles.likeCount}>
                    <span className={styles.icon}>❤️</span>
                    {actualLikes} lượt thích
                  </div>
                </div>

                {/* Thêm các nút chỉnh sửa và xóa */}
                {post.authorId === userInfo?.id && (
                  <div className={styles.postActions}>
                    <button
                      onClick={() => handleEditPost(post.id, post)}
                      className={styles.editButton}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className={styles.deleteButton}
                      aria-label="Xóa bài viết"
                    >
                      <FaTrashAlt /> Xóa
                    </button>
                  </div>
                )}

                <Link
                  href={`/forum/${post.id}`}
                  className={styles.readMoreLink}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Post Modal */}
      {isEditing && editPost && (
        <div
          className={deleteStyles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleEditCancel();
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "700px",
              background: "white",
              borderRadius: "10px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <CreateForumPost
              onPostCreated={handleEditComplete}
              editPost={{
                id: editPost.id,
                title: editPost.title,
                content: editPost.description,
                image: editPost.image || "",
                category: editPost.category || "all",
                isAnonymous: editPost.isAnonymous || false,
              }}
              onCancel={handleEditCancel}
              currentUser={user}
            />
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa bài viết */}
      {isDeleteModalOpen && selectedPost && (
        <DeletePostModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          postTitle={selectedPost.title}
          postId={selectedPost.id}
          currentUserId={userInfo?.id}
        />
      )}
    </div>
  );
};

export default PostList;
