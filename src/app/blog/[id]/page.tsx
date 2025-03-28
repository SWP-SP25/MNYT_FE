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
import { BlogDetail, BlogPostDetailResponse } from "@/types/blogDetail";
import axios from "axios";
import Cookies from "js-cookie";
import { uploadImage } from "@/utils/uploadImage";
import { useAuth } from "@/hooks/useAuth";

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

  const { user } = useAuth();

  const {
    response: blogPostDetailResponse,
    error,
    loading,
  } = useAxios<BlogPostDetailResponse>({
    url: `https://api-mnyt.purintech.id.vn/api/Posts/${id}`,
    method: "get",
  });

  useEffect(() => {
    if (blogPostDetailResponse) {
      setPost(blogPostDetailResponse.data);
    }
  }, [blogPostDetailResponse]);

  // Lưu trạng thái thích và lưu bài vào localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked-${id}`);
    const saved = localStorage.getItem(`saved-${id}`);
    if (liked) setIsLiked(true);
    if (saved) setIsSaved(true);
  }, [id]);

  // Thêm vào useEffect
  useEffect(() => {
    // Giả lập dữ liệu related posts
    const dummyRelatedPosts: RelatedPost[] = [
      {
        id: 2,
        title: "Chế độ dinh dưỡng cho bé 6-12 tháng tuổi",
        coverImage: "/images/tdd.jpg",
        category: {
          name: "Dinh dưỡng",
          color: "#279357",
        },
      },
      {
        id: 3,
        title: "10 món ăn vặt lành mạnh cho mẹ bầu",
        coverImage: "/images/10.jpg",
        category: {
          name: "Dinh dưỡng",
          color: "#279357",
        },
      },
    ];
    setRelatedPosts(dummyRelatedPosts);
  }, []);

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
    setIsLiked((prev) => !prev);
    const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1;

    try {
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/like/${id}?accountId=1`
      );
      localStorage.setItem(`liked-${id}`, JSON.stringify(!isLiked));
      setPost((prev) => ({ ...prev, likeCount: newLikeCount }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    setIsSaved((prev) => !prev);

    try {
      // Lấy ID người dùng thực tế từ useAuth hook
      const userId = user?.id || 1;

      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/${id}?accountId=${userId}`
      );
      localStorage.setItem(`saved-${id}`, JSON.stringify(!isSaved));
    } catch (error) {
      console.error("Error saving post:", error);
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
          src={post.coverImage || "/images/ads2.jpg"}
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
          className={`${styles.interactionButton} ${
            isLiked ? styles.active : ""
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
          className={`${styles.interactionButton} ${
            isSaved ? styles.active : ""
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
