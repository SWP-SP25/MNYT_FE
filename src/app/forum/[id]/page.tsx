"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import styles from "./postDetail.module.css";
import { CommentListItem } from "@/types/commentList";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaClock,
  FaFlag,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { getUserInfo } from "@/utils/getUserInfo";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  description?: string;
  coverImage?: string;
  image?: string;
  category: string;
  createDate: string;
  accountId: number;
  accountName: string;
  authorId: number;
  authorName?: string;
  isAnonymous: boolean;
  likeCount: number;
  commentCount: number;
  images?: { url: string }[];
  status?: string;
}

// Define interfaces for component props
interface CommentItemProps {
  comment: CommentListItem;
  formatDate: (date: string | Date) => string;
  currentUserId?: number | string;
  onDeleteComment: (id: number) => void;
}

// Update CommentItem component to support images and delete function
const CommentItem = ({ comment, formatDate, currentUserId, onDeleteComment }: CommentItemProps) => {
  // Check if this comment belongs to the current user
  const isOwnComment = currentUserId && comment.accountId.toString() === currentUserId.toString();
  
  console.log("CommentItem",comment)
  return (
    <div className={styles.commentItem}>
      <div className={styles.commentAvatar}>
        {comment.accountUserName ? comment.accountUserName.charAt(0).toUpperCase() : "?"}
      </div>
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{comment.accountUserName || "Người dùng"}</span>
          <span className={styles.commentDate}>{formatDate(comment.createDate)}</span>
        </div>
        <div className={styles.commentText}>{comment.content}</div>
        
        {/* Show delete button only for the user's own comments */}
        {isOwnComment && (
          <div className={styles.commentActions}>
            <button 
              onClick={() => onDeleteComment(comment.id)} 
              className={styles.deleteCommentButton}
              title="Xóa bình luận"
            >
              <span className={styles.deleteIcon}>×</span> Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface CommentSectionProps {
  comments: CommentListItem[];
  formatDate: (date: string | Date) => string;
  currentUserId?: number | string;
  onDeleteComment: (id: number) => void;
}

// Comment Section Component
const CommentSection = ({ comments, formatDate, currentUserId, onDeleteComment }: CommentSectionProps) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return <div className={styles.noComments}>Chưa có bình luận nào.</div>;
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          formatDate={formatDate} 
          currentUserId={currentUserId}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

const ForumDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<CommentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const [isReported, setIsReported] = useState(false);
  const userInfo = getUserInfo(user);

  console.log("commentsDatacommentsData",comments)
  // Load like/save status from localStorage and API
  useEffect(() => {
    const savedStatus = localStorage.getItem(`forum-saved-${postId}`);
    if (savedStatus) setIsSaved(JSON.parse(savedStatus));
    
    // If user is logged in, check like status from API
    if (userInfo?.id) {
      checkIfPostLiked(userInfo.id);
    } else {
      // Fallback to localStorage if user not logged in
      const likedStatus = localStorage.getItem(`forum-liked-${postId}`);
      if (likedStatus) setLiked(JSON.parse(likedStatus));
    }
  }, [postId, userInfo?.id]);

  // Fetch post data
  const fetchPostData = async () => {
    if (!postId) return;

    setLoading(true);
    try {
      const url = `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`;
      console.log("Fetching post details from URL:", url);

      const response = await axios.get(url);
      
      if (response.data) {
        let postData;

        if (response.data.data) {
          postData = response.data.data;
        } else {
          postData = response.data;
        }

        const formattedPostData = {
          ...postData,
          title: postData.title || "Bài viết không có tiêu đề",
          content: postData.content || "",
          image: postData.image || postData.imageUrl || postData.coverImage || "",
          likeCount: postData.likeCount || 0,
          commentCount: postData.commentCount || 0,
        };

        setPost(formattedPostData);
        
        // Fetch comments separately
        fetchComments();
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      console.error("Error fetching post details:", error);
      setError(`Không thể tải bài viết. Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  // Fetch comments for this post - Thử lại nhiều endpoints khác nhau
  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      const possibleEndpoints = [
        `https://api-mnyt.purintech.id.vn/api/Comments/post/${postId}/all`,
      ];
      
      let commentsData = [];
      let success = false;
      
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying to fetch comments from: ${endpoint}`);
          const response = await axios.get(endpoint);
          
          if (response.data && response.data.success) {
            // Xử lý trường hợp dữ liệu nằm trong data.items
            if (response.data.data && response.data.data.items) {
              commentsData = response.data.data.items;
            } 
            // Xử lý trường hợp dữ liệu nằm trực tiếp trong data
            else if (response.data.data) {
              commentsData = response.data.data;
            }
            
            if (Array.isArray(commentsData) && commentsData.length > 0) {
              success = true;
              break; // Tìm thấy endpoint hoạt động, dừng vòng lặp
            }
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError);
          // Tiếp tục thử endpoint tiếp theo
        }
      }
      
      if (success) {
        // Xử lý dữ liệu bình luận
        commentsData = commentsData.map((comment: any) => ({
          ...comment,
          content: comment.content || "",
        }));
        
        setComments(commentsData);
        localStorage.setItem(`forum-comments-${postId}`, JSON.stringify(commentsData));
        console.log("Comments loaded successfully:", commentsData);
      } else {
        // Không tìm thấy endpoint nào, thử lấy từ localStorage
        console.log("No working endpoint found, using localStorage");
        const cachedComments = localStorage.getItem(`forum-comments-${postId}`);
        if (cachedComments) {
          setComments(JSON.parse(cachedComments));
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Thử lấy từ localStorage nếu có lỗi
      const cachedComments = localStorage.getItem(`forum-comments-${postId}`);
      if (cachedComments) {
        setComments(JSON.parse(cachedComments));
      } else {
        setComments([]);
      }
    }
  };

  // Handle like post
  const handleLike = async () => {
    if (!post) return;

    const newLikeStatus = !liked;
    setLiked(newLikeStatus);

    // Temporarily update UI for immediate feedback
    setPost({
      ...post,
      likeCount: Math.max(0, post.likeCount + (newLikeStatus ? 1 : -1)),
    });

    // Save to localStorage
    localStorage.setItem(`forum-liked-${postId}`, JSON.stringify(newLikeStatus));

    try {
      const userId = userInfo?.id || 1;
      
      if (newLikeStatus) {
        // If liking, use POST request
        await axios.post(
          `https://api-mnyt.purintech.id.vn/api/Interactions/like/${postId}?accountId=${userId}`
        );
      } else {
        // If unliking, use DELETE request
        await axios.delete(
          `https://api-mnyt.purintech.id.vn/api/Interactions/like/${postId}?accountId=${userId}`
        );
      }
      
      // Refetch post details to get the updated like count
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`
          );
          
          if (response.data) {
            let postData;
            if (response.data.data) {
              postData = response.data.data;
            } else {
              postData = response.data;
            }
            
            // Update only the likeCount from the fresh data
            setPost(prevPost => ({
              ...prevPost!,
              likeCount: postData.likeCount || 0
            }));
          }
        } catch (fetchError) {
          console.error("Error fetching updated post data:", fetchError);
        }
      }, 500);
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert UI change if API call fails
      setLiked(!newLikeStatus);
      setPost({
        ...post,
        likeCount: post.likeCount
      });
    }
  };

  // Handle save post
  const handleSave = async () => {
    const newSaveStatus = !isSaved;
    setIsSaved(newSaveStatus);

    // Save to localStorage
    localStorage.setItem(`forum-saved-${postId}`, JSON.stringify(newSaveStatus));

    // Sử dụng API đúng để lưu trạng thái bookmark
    try {
      const userId = userInfo?.id || 1;
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${postId}?accountId=${userId}`
      );
    } catch (error) {
      console.error("Error saving bookmark status:", error);
    }
  };

  // Handle share post
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title || "Bài viết diễn đàn",
          text: "Chia sẻ bài viết từ diễn đàn Mầm Non Yêu Thương",
          url: window.location.href,
        })
        .catch(() => {
          // Fallback
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => alert("Đã sao chép link vào clipboard"))
            .catch((clipErr) => console.error("Không thể sao chép link:", clipErr));
        });
    } else {
      // Fallback
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Đã sao chép link vào clipboard"))
        .catch((clipErr) => console.error("Không thể sao chép link:", clipErr));
    }
  };

  // Update the handleSubmitComment function
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const userId = userInfo?.id || 1;
    // Lưu vị trí hiện tại của trang
    const currentPosition = window.scrollY;

    try {
      // Post comment
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Comments?accountId=${userId}`,
        {
          blogPostId: Number(postId),
          forumPostId: Number(postId),
          content: newComment,
          type: "forum"
        }
      );

      // Fetch new data instead of reloading page
      await fetchPostData();

      // Reset form
      setNewComment("");
      
      // Khôi phục vị trí cuộn sau khi cập nhật
      setTimeout(() => {
        window.scrollTo({
          top: currentPosition,
          behavior: "auto"
        });
      }, 100);
      
    } catch (error: any) {
      console.error("Error posting comment:", error);
      alert(`Không thể đăng bình luận: ${error.response?.data?.message || error.message || "Lỗi không xác định"}`);
    }
  };

  // Format date with Vietnam timezone (UTC+7)
  const formatDate = (dateString: string | Date) => {
    try {
      // Chuyển đổi thành đối tượng Date nếu là chuỗi
      const date = typeof dateString === "string" ? new Date(dateString) : dateString;

      // Kiểm tra nếu là ngày không hợp lệ
      if (isNaN(date.getTime())) {
        return "Vừa xong";
      }

      // Thêm 7 giờ cho múi giờ Việt Nam (UTC+7)
      const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
      
      // Lấy thời gian hiện tại
      const now = new Date();
      // Cũng điều chỉnh thời gian hiện tại theo múi giờ Việt Nam
      const vietnamNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      // Nếu thời gian trong tương lai (lỗi), sử dụng thời gian hiện tại
      const compareDate = vietnamDate > vietnamNow ? new Date(vietnamNow.getTime() - 60000) : vietnamDate; // Giảm 1 phút để hiển thị "1 phút trước"

      // Dùng formatDistanceToNow với cờ addSuffix để thêm "cách đây" và "nữa"
      return formatDistanceToNow(compareDate, {
        locale: vi,
        addSuffix: true,
      });
    } catch (error) {
      console.error("Lỗi định dạng thời gian:", error);
      return "Vừa xong";
    }
  };

  // Handle report post
  const handleReport = async () => {
    if (!post || isReported) return;

    try {
      await axios.patch(
        `https://api-mnyt.purintech.id.vn/api/Posts/${postId}/change-status?accountId=1&status=Reported`
      );
      setIsReported(true);
      alert("Bài viết đã được tố cáo thành công!");
    } catch (error) {
      console.error("Error reporting post:", error);
      alert("Không thể tố cáo bài viết. Vui lòng thử lại sau.");
    }
  };

  // Add this function to check if user is admin or post author
  const canViewStatus = () => {
    if (!user || !post) return false;
    return user.role === 'Admin' || user.id === post.accountId.toString();
  };

  // 1. Thêm hàm kiểm tra URL hợp lệ
  const isValidURL = (url: string): boolean => {
    if (!url) return false;
    
    try {
      // Kiểm tra xem URL có hợp lệ không
      new URL(url);
      return true;
    } catch (e) {
      // Nếu url là đường dẫn tương đối không bắt đầu bằng / thì thêm vào
      if (!url.startsWith('/') && !url.startsWith('http')) {
        return false;
      }
      return url.startsWith('/');
    }
  };

  // 2. Thêm fallback image URL hợp lệ
  const FALLBACK_IMAGE = 'https://res.cloudinary.com/mnyt/image/upload/v1743345926/ltb8uurjnz7gvrrpqbti.png';

  // Add this function to check if the current post is liked
  const checkIfPostLiked = async (userId) => {
    try {
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Interactions/likes?accountId=${userId}`
      );
      
      if (response.data && response.data.success && response.data.data) {
        // The response likely contains a list of post IDs the user has liked
        const likedPosts = response.data.data;
        
        // Check if current post ID is in the list of liked posts
        // This assumes the API returns an array of objects with postId property
        // Adjust according to the actual response structure
        const isLiked = likedPosts.some(item => 
          item.postId === Number(postId) || 
          item.forumPostId === Number(postId) || 
          item.id === Number(postId)
        );
        
        // Update the liked state
        setLiked(isLiked);
        
        // Also save to localStorage for cache
        localStorage.setItem(`forum-liked-${postId}`, JSON.stringify(isLiked));
        
        return isLiked;
      }
      return false;
    } catch (error) {
      console.error("Error checking if post is liked:", error);
      return false;
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!commentId || !userInfo?.id) return;

    const userId = userInfo.id;
    
    // Confirm deletion
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      return;
    }

    try {
      // Call API to delete the comment
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/Comments/${commentId}?accountId=${userId}`
      );

      // Update UI by removing the deleted comment
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      
      // Update comment count in post
      if (post) {
        setPost({
          ...post,
          commentCount: Math.max(0, (post.commentCount || 0) - 1)
        });
      }
      
      // Show success message
      alert('Đã xóa bình luận thành công');
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert('Không thể xóa bình luận. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.error}>
        <p>{error || "Không tìm thấy bài viết"}</p>
        <button onClick={() => router.push("/forum")}>Quay lại diễn đàn</button>
      </div>
    );
  }

  return (
    <div className={styles.postDetailContainer}>
      <Link href="/forum" className={styles.backLink}>
        ← Quay lại diễn đàn
      </Link>

      <article className={styles.postContent}>
        <div className={styles.category} style={{ backgroundColor: "green" }}>
          {post.category}
        </div>
        <h1>{post.title}</h1>

        <div className={styles.postMeta}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              {post.accountName
                ? post.accountName.charAt(0).toUpperCase()
                : "A"}
            </div>
            <span className={styles.authorName}>
              {post.isAnonymous
                ? "Người dùng ẩn danh"
                : userInfo?.fullName || post.authorName || post.accountName}
            </span>
            <span className={styles.postDate}>
              <FaClock /> {formatDate(post.createDate)}
            </span>
            {canViewStatus() && post.status && (
              <span className={`${styles.status} ${styles[post.status.toLowerCase()]}`}>
                {post.status}
              </span>
            )}
          </div>
        </div>

        {/* Image Carousel */}
        {post.images && post.images.length > 0 && (
          <div className={styles.carouselContainer}>
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
            >
              {post.images.map((image, index) => {
                // Kiểm tra URL hợp lệ
                const imageUrl = isValidURL(image.url) ? image.url : FALLBACK_IMAGE;
                
                return (
                  <SwiperSlide key={index} className={styles.imageSlide}>
                    <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      width={800}
                      height={400}
                      className={styles.coverImage}
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = FALLBACK_IMAGE;
                        imgElement.style.objectFit = "contain";
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* Nếu post.image tồn tại và cần hiển thị */}
        {post.image && isValidURL(post.image) && (
          <div className={styles.singleImageContainer}>
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className={styles.postImage}
              onError={(e) => {
                console.error("Error loading image:", e);
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = FALLBACK_IMAGE;
                imgElement.style.objectFit = "contain";
              }}
            />
          </div>
        )}

        {/* Hiển thị nội dung */}
        {post.description ? (
          <div className={styles.description}>
            {post.description.includes("<") && post.description.includes(">") ? (
              <div dangerouslySetInnerHTML={{ __html: post.description }} />
            ) : (
              post.description.split("\n").map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
            )}
          </div>
        ) : (
          <p className={styles.noContent}>Không có nội dung</p>
        )}

        <div className={styles.interactionBar}>
          <button
            onClick={handleLike}
            className={`${styles.interactionButton} ${liked ? styles.active : ""}`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{Math.max(0, post.likeCount)}</span>
          </button>
          <button className={styles.interactionButton}>
            <FaRegComment />
            <span>{comments.length}</span>
          </button>
          <button onClick={handleShare} className={styles.interactionButton}>
            <FaShare />
            <span>Chia sẻ</span>
          </button>
          <button
            onClick={handleSave}
            className={`${styles.interactionButton} ${isSaved ? styles.active : ""}`}
          >
            <FaBookmark />
            <span>{isSaved ? "Đã lưu" : "Lưu bài"}</span>
          </button>
          <button
            onClick={handleReport}
            className={`${styles.interactionButton} ${styles.reportButton} ${isReported ? styles.reported : ""}`}
          >
            <FaFlag />
            <span>{isReported ? "Đã tố cáo" : "Tố cáo"}</span>
          </button>
        </div>
      </article>

      <div className={styles.commentSection}>
        <h3>Bình luận ({comments.length})</h3>

        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={3}
          />
          
          <button type="submit">Đăng bình luận</button>
        </form>

        {/* Use updated CommentSection */}
        <CommentSection 
          comments={Array.isArray(comments) ? comments : []} 
          formatDate={formatDate} 
          currentUserId={userInfo?.id}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default ForumDetailPage;
