// components/PostList.tsx
import { useState, useEffect, useRef } from "react";
import styles from "@/app/forum/components/components.module.css";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";
import Pagination from "./Pagination";
import { useRouter, usePathname } from "next/navigation";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DeletePostModal from "../CRUD/DeleteForumPost";
import { useAuth } from "@/hooks/useAuth";
import CreateForumPost from "../CRUD/CreateForumPost";
import deleteStyles from "../CRUD/styles/deleteForumPost.module.css";
import { getUserInfo } from "@/utils/getUserInfo";
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
}

// Cập nhật kiểu dữ liệu cho props
interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentCategory: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const PostList = ({
  posts,
  loading,
  error,
  currentCategory,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
}: PostListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Thêm state để lưu trữ danh sách tài khoản
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);

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
  const { user } = useAuth();
  const userInfo = getUserInfo(user);

  // Thêm state để theo dõi trạng thái chỉnh sửa và bài viết đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);

  // Cập nhật localPosts khi posts prop thay đổi
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  // Effect để kiểm tra và cập nhật các bài viết có like/comment đã thay đổi
  // FIXED: Removed localPosts from dependency array and added check to prevent infinite loop
  useEffect(() => {
    // Kiểm tra localStorage để xem có bài viết nào được like/comment gần đây không
    const checkForUpdates = () => {
      // Prevent re-entrant calls that could cause infinite loops
      if (isCheckingRef.current) return;

      isCheckingRef.current = true;

      try {
        const currentPosts = [...localPosts];
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
          setLocalPosts(currentPosts);
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
  }, []); // FIXED: Removed localPosts from dependency array

  // Thêm effect để chạy checkForUpdates khi posts thay đổi
  useEffect(() => {
    // Manually check for localStorage updates when posts change
    const checkLocalStorageUpdates = () => {
      const updatedPosts = [...posts];
      let hasUpdates = false;

      updatedPosts.forEach((post, index) => {
        const likeStatus = localStorage.getItem(`forum-liked-${post.id}`);
        if (likeStatus) {
          const isLiked = JSON.parse(likeStatus);
          if (isLiked && updatedPosts[index].likes !== post.likes + 1) {
            updatedPosts[index] = {
              ...post,
              likes: post.likes + 1,
            };
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) {
        setLocalPosts(updatedPosts);
      } else {
        setLocalPosts(posts);
      }
    };

    checkLocalStorageUpdates();
  }, [posts]);

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

  // Thêm effect để lắng nghe khi quay lại từ trang chi tiết bài viết
  useEffect(() => {
    if (pathname === "/forum") {
      console.log("Back to forum page, refreshing data...");
      // Gọi hàm refresh để lấy dữ liệu mới nhất
      onRefresh();
    }
  }, [pathname, onRefresh]);

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

  // Reduced logging to avoid console spam
  // console.log("Posts received:", posts);
  // console.log("Accounts loaded:", accounts);

  // Sắp xếp bài viết theo thời gian tạo (mới nhất lên đầu)
  const sortedPosts = [...localPosts].sort((a, b) => {
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

  // Sửa đoạn lọc bài viết theo danh mục
  const filteredPosts =
    currentCategory === "all"
      ? sortedPosts // Sử dụng sortedPosts thay vì posts
      : sortedPosts.filter((post) => post.category === currentCategory);

  // Áp dụng phân trang cho các bài viết đã lọc
  const displayedPosts = paginatePosts(filteredPosts, currentPage);

  // Hàm để lấy số lượt like thực tế của bài viết (kết hợp từ API và localStorage)
  const getPostLikeCount = (post: Post) => {
    // Kiểm tra localStorage xem người dùng đã like bài viết này chưa
    const likeStatus = localStorage.getItem(`forum-liked-${post.id}`);
    if (likeStatus) {
      const isLiked = JSON.parse(likeStatus);
      // Nếu trong localStorage ghi nhận là đã like, cộng thêm 1 vào số like từ API
      if (isLiked) {
        return (post.likes || 0) + 1;
      }
    }
    return post.likes || 0;
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
    onRefresh();
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
      onRefresh();
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
        <button onClick={onRefresh} className={styles.createPostButton}>
          Thử lại
        </button>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>
          Không có bài viết nào trong danh mục {categoryNames[currentCategory]}
        </h3>
        <p>Hãy là người đầu tiên chia sẻ kinh nghiệm của bạn!</p>
        <button onClick={onRefresh} className={styles.createPostButton}>
          Làm mới
        </button>
      </div>
    );
  }

  return (
    <div className={styles.postListContainer}>
      <h2 className={styles.categoryTitle}>
        {categoryNames[currentCategory] || "Tất cả bài viết"}
      </h2>

      <div className={styles.postList}>
        {displayedPosts.map((post: Post, id: number) => {
          console.log("Rendering post:", post);
          console.log("Post info:", {
            id: post.id,
            authorId: post.authorId,
            accountName: post.accountName,
            isAnonymous: post.isAnonymous,
          });

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

          // Lấy số lượt like thực tế, bao gồm cả cập nhật từ localStorage
          const actualLikes = getPostLikeCount(post);

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
                    {post.comments?.length || 0} bình luận
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

      <div className={styles.refreshButtonContainer}>
        <button onClick={onRefresh} className={styles.refreshButton}>
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {!loading && !error && filteredPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
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
