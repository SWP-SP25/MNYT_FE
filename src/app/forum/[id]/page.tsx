"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import styles from "./postDetail.module.css";
import CommentSection from "../components/CommentSection";
import { CommentListItem } from "@/types/commentList";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import EditForumPost from "../CRUD/EditForumPost";

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
}

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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Load like/save status from localStorage
  useEffect(() => {
    const likedStatus = localStorage.getItem(`forum-liked-${postId}`);
    const savedStatus = localStorage.getItem(`forum-saved-${postId}`);

    if (likedStatus) setLiked(JSON.parse(likedStatus));
    if (savedStatus) setIsSaved(JSON.parse(savedStatus));
  }, [postId]);

  // Fetch post data
  const fetchPostData = async () => {
    if (!postId) return;

    setLoading(true);
    try {
      const url = `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`;
      console.log("Fetching post details from URL:", url);

      const response = await axios.get(url);
      console.log("API response:", response);
      console.log("Post data:", response.data);

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
          image:
            postData.image || postData.imageUrl || postData.coverImage || "",
          likeCount: postData.likeCount || 0,
          commentCount: postData.commentCount || 0,
        };

        console.log("Formatted post data:", formattedPostData);
        setPost(formattedPostData);
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

  // Function to handle post update
  const handlePostUpdated = () => {
    fetchPostData(); // Re-fetch the post data
  };

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      console.log("Fetching comments for post ID:", postId);

      const commentsUrl = `https://api-mnyt.purintech.id.vn/api/Comments/post/${postId}`;
      const commentsResponse = await axios.get(commentsUrl);

      console.log("Comments response:", commentsResponse);

      let commentsData = [];

      commentsData = commentsResponse.data.data.items;

      commentsData = commentsData.map((comment) => ({
        ...comment,
        content: comment.content || "",
      }));

      console.log("Processed comments data:", commentsData);

      if (commentsData.length > 0) {
        setComments(commentsData);
        // Lưu trữ bình luận vào localStorage
        localStorage.setItem(
          `forum-comments-${postId}`,
          JSON.stringify(commentsData)
        );
      } else {
        console.log("No comments found for this post");
        setComments([]);
      }
    } catch (commentError) {
      console.error("Error fetching comments:", commentError);
      setComments([]);
    }
  };

  // Load comments from localStorage on initial render
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle like post
  const handleLike = async () => {
    if (!post) return;

    const newLikeStatus = !liked;
    setLiked(newLikeStatus);

    // Update post like count
    setPost({
      ...post,
      likeCount: post.likeCount + (newLikeStatus ? 1 : -1),
    });

    // Save to localStorage
    localStorage.setItem(
      `forum-liked-${postId}`,
      JSON.stringify(newLikeStatus)
    );

    // Optional: Call API to save like status
    try {
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/like/${postId}?accountId=1`
      );
    } catch (error) {
      console.error("Error saving like status:", error);
    }
  };

  // Handle save post
  const handleSave = async () => {
    const newSaveStatus = !isSaved;
    setIsSaved(newSaveStatus);

    // Save to localStorage
    localStorage.setItem(
      `forum-saved-${postId}`,
      JSON.stringify(newSaveStatus)
    );

    // Optional: Call API to save bookmark status
    try {
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${postId}?accountId=1`
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
        .catch((err) => {
          // Fallback for browsers that don't support Web Share API
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => alert("Đã sao chép link vào clipboard"))
            .catch((err) => console.error("Không thể sao chép link:", err));
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Đã sao chép link vào clipboard"))
        .catch((err) => console.error("Không thể sao chép link:", err));
    }
  };

  // Handle submit comment - Sửa lại để sử dụng API endpoint đúng
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const userId = user?.id || 1;

    const newCommentItem: CommentListItem = {
      id: Date.now(),
      accountId: userId,
      accountUserName: user?.name || "Người dùng",
      blogPostId: Number(postId),
      replyId: null,
      content: newComment,
      createDate: new Date(),
    };

    try {
      const response = await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Comments?accountId=${userId}`,
        {
          blogPostId: Number(postId),
          content: newComment,
        }
      );

      // Thêm bình luận mới vào danh sách hiện tại
      setComments((prevComments) => {
        const updatedComments = [...prevComments, newCommentItem];
        localStorage.setItem(
          `forum-comments-${postId}`,
          JSON.stringify(updatedComments)
        );
        return updatedComments;
      });

      setNewComment("");
    } catch (error: any) {
      console.error("Error posting comment:", error);
      alert(
        `Không thể đăng bình luận: ${
          error.response?.data?.message || error.message || "Lỗi không xác định"
        }`
      );
    }
  };

  // Format date with Vietnam timezone (UTC+7)
  const formatDate = (dateString: string | Date) => {
    try {
      // Chuyển đổi thành đối tượng Date nếu là chuỗi
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;

      // Kiểm tra nếu là ngày không hợp lệ
      if (isNaN(date.getTime())) {
        return "Vừa xong";
      }

      // Lấy thời gian hiện tại
      const now = new Date();

      // Nếu thời gian trong tương lai (lỗi), sử dụng thời gian hiện tại
      const compareDate = date > now ? new Date(now.getTime() - 60000) : date; // Giảm 1 phút để hiển thị "1 phút trước"

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

      {/* Debug info chỉ hiển thị trong development */}
      {/* {process.env.NODE_ENV === "development" && debugInfo && (
        <div
          style={{
            margin: "10px 0",
            padding: "10px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
          }}
        >
          <details>
            <summary>Debug Info</summary>
            <pre style={{ overflow: "auto", maxHeight: "200px" }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )} */}

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
                : user?.name || post.authorName || post.accountName}
            </span>
            <span className={styles.postDate}>
              <FaClock /> {formatDate(post.createDate)}
            </span>
          </div>
        </div>

        {/* Hiển thị ảnh nếu có */}
        {post.image && (
          <div className={styles.coverImageContainer}>
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className={styles.coverImage}
              onError={(e) => {
                console.error("Error loading image:", e);
                // Fallback khi ảnh lỗi
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = "/images/default-post-image.jpg"; // Đặt ảnh mặc định
                imgElement.style.objectFit = "contain";
              }}
            />
          </div>
        )}

        {/* Hiển thị nội dung */}
        {post.description ? (
          <div className={styles.description}>
            {/* Sử dụng dangerouslySetInnerHTML nếu content có cấu trúc HTML */}
            {post.description.includes("<") &&
            post.description.includes(">") ? (
              <div dangerouslySetInnerHTML={{ __html: post.description }} />
            ) : (
              // Nếu là plain text, hiển thị từng đoạn văn
              post.description
                .split("\n")
                .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
            )}
          </div>
        ) : (
          <p className={styles.noContent}>Không có nội dung</p>
        )}

        <div className={styles.interactionBar}>
          <button
            onClick={handleLike}
            className={`${styles.interactionButton} ${
              liked ? styles.active : ""
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{post.likeCount}</span>
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
            className={`${styles.interactionButton} ${
              isSaved ? styles.active : ""
            }`}
          >
            <FaBookmark />
            <span>{isSaved ? "Đã lưu" : "Lưu bài"}</span>
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

        {/* Hiển thị phần comment với tên người dùng hiện tại */}
        <CommentSection
          comments={
            Array.isArray(comments)
              ? comments.map((comment) => {
                  // Kiểm tra nếu comment bởi user hiện tại
                  const isCurrentUser = user && comment.accountId === user.id;

                  return {
                    ...comment,
                    accountUserName: isCurrentUser
                      ? user?.name || user?.userName || "Bạn"
                      : comment.accountUserName || "Người dùng",
                    // Giữ nguyên trường createDate
                    createDate: comment.createDate,
                  };
                })
              : []
          }
        />
      </div>
    </div>
  );
};

export default ForumDetailPage;
