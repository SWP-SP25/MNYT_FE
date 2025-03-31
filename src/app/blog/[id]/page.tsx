"use client";
import styles from "./blogDetail.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaRegHeart,
  FaHeart,
  FaShare,
  FaBookmark,
  FaClock,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { blogService } from "@/app/services/api";
import useAxios from "@/hooks/useFetchAxios";
import { BlogPostDetailResponse } from "@/types/blog";
import axios from "axios";
import Cookies from "js-cookie";
import { uploadImage } from "@/utils/uploadImage";
import { useAuth } from "@/hooks/useAuth";
import { getUserInfo } from "@/utils/getUserInfo";
// Thêm interface để type checking
interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
}

interface BlogPost {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
    avatar: string;
    bio: string;
  };
  category: {
    id: number;
    name: string;
    color: string;
  };
  createdAt: Date;
  content: string;
  likes: number;
  comments: Comment[];
  views: number;
  tags: string[];
  coverImage: string;
}

// Thêm interface cho related posts
interface RelatedPost {
  id: number;
  title: string;
  coverImage: string;
  category: {
    name: string;
    color: string;
  };
}

// Thêm interface cho TOC
interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const BlogDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [loadingInteractions, setLoadingInteractions] = useState(false);

  const { user } = useAuth();
  const userInfo = getUserInfo(user);

  const {
    response: blogPostDetailResponse,
    error,
    loading,
  } = useAxios<BlogPostDetailResponse>({
    url: `https://api-mnyt.purintech.id.vn/api/Posts/${id}`,
    method: "get",
  });
  console.log("BlogPostDetailResponse", blogPostDetailResponse);
  useEffect(() => {
    if (blogPostDetailResponse) {
      setPost(blogPostDetailResponse.data);
    }
  }, [blogPostDetailResponse]);

  // Thêm useEffect này để tải trạng thái tương tác từ API
  useEffect(() => {
    const fetchInteractionStatus = async () => {
      if (!user || !id) return;

      try {
        setLoadingInteractions(true);
        const userId = user.id || 1;

        // Sử dụng endpoint GET /api/Interactions/likes để lấy danh sách bài viết đã like
        const likesResponse = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Interactions/likes?accountId=${userId}`
        );

        // Sử dụng endpoint GET /api/Interactions/bookmarks để lấy danh sách bài viết đã bookmark
        const bookmarksResponse = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Interactions/bookmarks?accountId=${userId}`
        );

        // Kiểm tra xem bài viết hiện tại có nằm trong danh sách đã like hay không
        let isLikedFromAPI = false;
        if (likesResponse.data && likesResponse.data.data) {
          // Kiểm tra xem bài viết có ID trùng với ID hiện tại không
          isLikedFromAPI = likesResponse.data.data.some(
            (item: any) => item.id === Number(id) || item.postId === Number(id)
          );
        }

        // Kiểm tra xem bài viết hiện tại có nằm trong danh sách đã bookmark hay không
        let isSavedFromAPI = false;
        if (bookmarksResponse.data && bookmarksResponse.data.data) {
          // Kiểm tra xem bài viết có ID trùng với ID hiện tại không
          isSavedFromAPI = bookmarksResponse.data.data.some(
            (item: any) => item.id === Number(id) || item.postId === Number(id)
          );
        }

        console.log("Like status from API:", isLikedFromAPI);
        console.log("Save status from API:", isSavedFromAPI);

        // Cập nhật state và localStorage
        setIsLiked(isLikedFromAPI);
        setIsSaved(isSavedFromAPI);

        localStorage.setItem(`liked-${id}`, JSON.stringify(isLikedFromAPI));
        localStorage.setItem(`saved-${id}`, JSON.stringify(isSavedFromAPI));
      } catch (error) {
        console.error("Error fetching interaction status:", error);
        // Fallback to localStorage if API fails
        const liked = localStorage.getItem(`liked-${id}`);
        const saved = localStorage.getItem(`saved-${id}`);
        if (liked) setIsLiked(JSON.parse(liked));
        if (saved) setIsSaved(JSON.parse(saved));
      } finally {
        setLoadingInteractions(false);
      }
    };

    fetchInteractionStatus();
  }, [id, user]);
  // Thêm function để generate TOC từ content
  const generateTableOfContents = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");

    return Array.from(headings).map((heading, index) => ({
      id: `section-${index}`,
      title: heading.textContent || "",
      level: parseInt(heading.tagName[1]),
    }));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Không tìm thấy bài viết</div>;

  const handleLike = async () => {
    // Store the original values for potential rollback
    const originalLikeStatus = isLiked;
    const originalLikeCount = post.likeCount;

    // Calculate new status (opposite of current)
    const newLikeStatus = !isLiked;

    // Immediately update UI for better user experience
    setIsLiked(newLikeStatus);

    try {
      // Get user ID
      const userId = user?.id || 1;

      // Make API call based on the new status
      if (newLikeStatus) {
        // Add like
        await axios.post(
          `https://api-mnyt.purintech.id.vn/api/Interactions/like/${id}?accountId=${userId}`
        );
        console.log("Post liked successfully");

        // Update like count on UI
        setPost((prev) => {
          if (!prev) return null;
          return { ...prev, likeCount: prev.likeCount + 1 };
        });
      } else {
        // Remove like
        await axios.delete(
          `https://api-mnyt.purintech.id.vn/api/Interactions/like/${id}?accountId=${userId}`
        );
        console.log("Post unliked successfully");

        // Update like count on UI
        setPost((prev) => {
          if (!prev) return null;
          // Ensure we don't go below 0
          return { ...prev, likeCount: Math.max(0, prev.likeCount - 1) };
        });
      }

      // Update localStorage to match the new state
      localStorage.setItem(`liked-${id}`, JSON.stringify(newLikeStatus));

      // Fetch the true count from server after a short delay
      // to ensure server has processed our request
      setTimeout(() => {
        fetchUpdatedLikeCount(userId);
      }, 500);
    } catch (error) {
      console.error("Error updating like status:", error);

      // Revert UI changes if API call fails
      setIsLiked(originalLikeStatus);
      setPost((prev) => {
        if (!prev) return null;
        return { ...prev, likeCount: originalLikeCount };
      });

      alert("Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại sau.");
    }
  };

  const fetchUpdatedLikeCount = async (userId) => {
    try {
      console.log("Fetching updated like count from server...");

      // Fetch the post data
      const response = await axios.get(
        `https://api-mnyt.purintech.id.vn/api/Posts/${id}`
      );

      if (response.data && response.data.data) {
        const updatedPost = response.data.data;
        console.log("Server post data:", updatedPost);
        console.log("Server like count:", updatedPost.likeCount);

        // Only update the state if the value is different
        if (post && updatedPost.likeCount !== post.likeCount) {
          console.log("Updating like count from server");
          setPost((prev) => {
            if (!prev) return null;
            return { ...prev, likeCount: updatedPost.likeCount };
          });
        }

        // Also check if our like status matches what the server thinks
        const likesResponse = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Interactions/likes?accountId=${userId}`
        );

        if (likesResponse.data && likesResponse.data.data) {
          const serverLikeStatus = likesResponse.data.data.some(
            (item) => item.id === Number(id) || item.postId === Number(id)
          );

          if (isLiked !== serverLikeStatus) {
            console.log("Correcting like status from server");
            setIsLiked(serverLikeStatus);
            localStorage.setItem(
              `liked-${id}`,
              JSON.stringify(serverLikeStatus)
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching updated data from server:", error);
    }
  };

  const handleSave = async () => {
    // Lưu trạng thái mới (đảo ngược trạng thái hiện tại)
    const newSaveStatus = !isSaved;
    setIsSaved(newSaveStatus);

    try {
      // Lấy ID người dùng thực tế
      const userId = user?.id || 1;

      if (newSaveStatus) {
        // Nếu là save (thêm mới) - Sử dụng POST
        await axios.post(
          `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${id}?accountId=${userId}`
        );
        console.log("Post bookmarked successfully");
      } else {
        // Nếu là unsave (xóa) - Sử dụng DELETE
        await axios.delete(
          `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${id}?accountId=${userId}`
        );
        console.log("Post unbookmarked successfully");
      }

      // Cập nhật localStorage sau khi API thành công
      localStorage.setItem(`saved-${id}`, JSON.stringify(newSaveStatus));
    } catch (error) {
      console.error("Error updating bookmark status:", error);
      // Rollback UI nếu API thất bại
      setIsSaved(!newSaveStatus);
      alert(
        "Không thể cập nhật trạng thái lưu bài viết. Vui lòng thử lại sau."
      );
    }
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.share({
      title: post.title,
      text: "Chia sẻ bài viết hay về mang thai",
      url: window.location.href,
    });
  };

  // Bình luận xuất hiện real-time

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userData = Cookies.get("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);
      try {
        let imageUrl = "";
        if (imageFile) {
          imageUrl = await uploadImage(imageFile);
        }

        const response = await axios.post(
          `https://api-mnyt.purintech.id.vn/api/Comments?accountId=${user.id}`,
          {
            blogPostId: id as string,
            content: newComment,
            image: imageUrl, // Gửi URL ảnh
          }
        );

        // Thêm bình luận mới vào đầu state
        const newCommentData = {
          id: response.data.id,
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar || "/public/images/ava1.jpg",
          },
          content: newComment,
          image: imageUrl, // Thêm ảnh vào bình luận
          createdAt: new Date(),
          likes: 0,
        };

        setComments((prevComments) => [newCommentData, ...prevComments]);
        setNewComment("");
        setImageFile(null); // Reset file input
      } catch (err) {
        console.log("Error when commenting", err);
      }
    }
    console.log(userData);
  };

  return (
    <div className={styles.blogDetailContainer}>
      {/* Header */}
      <div className={styles.blogHeader}>
        <div
          className={styles.category}
          style={{ backgroundColor: /*post.category.color*/ "green" }}
        >
          {post.category}
        </div>
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.authorInfo}>
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>{post.authorName}</span>
            <span className={styles.postDate}>
              <FaClock />
              {/* {formatDistanceToNow(post.createdAt, { locale: vi, addSuffix: true })} */}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className={styles.coverImageContainer}>
        <Image
          src={post.images[0].url || "/images/ads2.jpg"}
          alt={post.title}
          width={1200}
          height={600}
          className={styles.coverImage}
        />
      </div>

      {/* Introduction */}
      <div className={styles.introduction}>
        <p>{post.description}</p>
      </div>

      {/* Table of Contents */}
      <div className={styles.tableOfContents}>
        <h3>Mục lục</h3>
        <ul>
          {tableOfContents.map((item) => (
            <li
              key={item.id}
              className={`${styles.tocItem} ${styles[`level${item.level}`]}`}
            >
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author Bio Box */}
      <div className={styles.authorBioBox}>
        <div className={styles.authorBioHeader}>
          <div className={styles.authorBioInfo}>
            <h3>{post.authorName}</h3>
            {post.author && post.author.bio ? (
              <p className={styles.authorBioText}>{post.author.bio}</p>
            ) : (
              <p className={styles.authorBioText}>
                Thông tin tác giả không có sẵn.
              </p>
            )}
          </div>
        </div>
        <div className={styles.authorStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>15</span>
            <span className={styles.statLabel}>Bài viết</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>2.5K</span>
            <span className={styles.statLabel}>Người theo dõi</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {/* {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag}</span>
                ))} */}
      </div>

      {/* Interaction Bar */}
      <div className={styles.interactionBar}>
        <button
          className={`${styles.interactionButton} ${isLiked ? styles.active : ""
            }`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{post.likeCount}</span>
        </button>

        <button className={styles.interactionButton} onClick={handleShare}>
          <FaShare />
          <span>Chia sẻ</span>
        </button>
        <button
          className={`${styles.interactionButton} ${isSaved ? styles.active : ""
            }`}
          onClick={handleSave}
        >
          <FaBookmark />
          <span>{isSaved ? "Đã lưu" : "Lưu bài"}</span>
        </button>
      </div>

      {/* Related Posts */}
      <div className={styles.relatedPosts}>
        <h3>Bài viết liên quan</h3>
        <div className={styles.relatedPostsGrid}>
          {relatedPosts.map((post) => (
            <div
              key={post.id}
              className={styles.relatedPostCard}
              onClick={() => router.push(`/blog/${post.id}`)}
            >
              <Image
                src={post.coverImage || "/images/default-cover.jpg"}
                alt={post.title}
                width={300}
                height={200}
                className={styles.relatedPostImage}
              />
              <div className={styles.relatedPostInfo}>
                <span
                  className={styles.relatedPostCategory}
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </span>
                <h4>{post.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
