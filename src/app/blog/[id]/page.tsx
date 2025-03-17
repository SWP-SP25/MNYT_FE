"use client";
import styles from "./blogDetail.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaClock,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import {
  blogService,
  commentService,
  BlogPost,
  Comment,
} from "@/app/services/api";
import useAxios from "@/hooks/useFetchAxios";
import { BlogDetail, BlogPostDetailResponse } from "@/types/blogDetail";
import axios from "axios";
import Cookies from "js-cookie";
import CommentList from "@/app/blog/components/CommentList";
import { uploadImage } from "@/utils/uploadImage";

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
  const [commentText, setCommentText] = useState("");
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    response: blogPostDetailResponse,
    error,
    loading,
  } = useAxios<BlogPostDetailResponse>({
    url: `https://api-mnyt.purintech.id.vn/api/BlogPosts/${id}`,
    method: "get",
  });

  useEffect(() => {
    if (blogPostDetailResponse) {
      setPost(blogPostDetailResponse.data);
    }
  }, [blogPostDetailResponse]);

  // ***** THÊM ĐOẠN CODE MỚI: Gán nội dung mặc định Postpartum Recovery Tips *****
  useEffect(() => {
    if (post) {
      // Kiểm tra nếu post.content chưa chứa nội dung mẫu (bạn có thể thay đổi điều kiện kiểm tra)
      if (
        !post.content ||
        !post.content.includes("Tổng quan về giai đoạn hậu sản")
      ) {
        const postpartumContent = `
          <h2>Tổng quan về giai đoạn hậu sản</h2>
          <p>
            Giai đoạn hậu sản (postpartum) là thời kỳ quan trọng ngay sau khi sinh,
            kéo dài từ vài tuần đến vài tháng. Đây là lúc cơ thể người mẹ phục hồi
            sau quá trình mang thai và vượt cạn, đồng thời bắt đầu thích nghi với việc chăm sóc em bé mới chào đời.
          </p>
          <h2>1. Chăm sóc cơ thể</h2>
          <ul>
            <li>
              <strong>Nghỉ ngơi đầy đủ:</strong> Giấc ngủ và thời gian nghỉ ngơi rất quan trọng để cơ thể phục hồi và cân bằng hormone.
            </li>
            <li>
              <strong>Vệ sinh cá nhân:</strong> Giữ vùng kín sạch sẽ, thay băng vệ sinh thường xuyên, và nếu có bất kỳ dấu hiệu viêm nhiễm nào, hãy trao đổi với bác sĩ.
            </li>
            <li>
              <strong>Vận động nhẹ nhàng:</strong> Sau khi sinh khoảng 2–6 tuần, bạn có thể bắt đầu vận động nhẹ như đi bộ hoặc tập yoga, giúp máu lưu thông và phục hồi cơ bắp.
            </li>
          </ul>
          <h2>2. Dinh dưỡng và hydrat hóa</h2>
          <p>
            Cung cấp đủ dinh dưỡng giúp mẹ nhanh chóng lấy lại sức và hỗ trợ quá trình sản xuất sữa. Bổ sung nhiều rau xanh, trái cây, đạm, và uống đủ nước mỗi ngày. Hạn chế thức ăn chế biến sẵn, đồ uống có ga và cafein.
          </p>
          <h2>3. Chăm sóc tinh thần</h2>
          <ul>
            <li>
              <strong>Tránh căng thẳng:</strong> Hãy sắp xếp công việc và gia đình hợp lý, nhờ người thân giúp đỡ việc nhà hoặc chăm em bé khi cần.
            </li>
            <li>
              <strong>Tâm sự và chia sẻ:</strong> Nếu cảm thấy mệt mỏi hoặc căng thẳng, hãy trò chuyện với chồng, bạn bè hoặc chuyên gia tâm lý để được lắng nghe và hỗ trợ.
            </li>
            <li>
              <strong>Nhận biết dấu hiệu trầm cảm sau sinh:</strong> Nếu bạn có triệu chứng buồn bã kéo dài, mất hứng thú với các hoạt động hàng ngày hoặc khó ngủ trầm trọng, hãy tìm đến sự hỗ trợ y tế kịp thời.
            </li>
          </ul>
          <h2>Kết luận</h2>
          <p>
            Phục hồi sau sinh là một quá trình đòi hỏi sự kiên nhẫn và hỗ trợ từ gia đình, bạn bè. Hãy chú trọng chăm sóc bản thân, đảm bảo dinh dưỡng, nghỉ ngơi hợp lý và luôn giữ tinh thần tích cực. Nếu có bất kỳ thắc mắc hoặc dấu hiệu bất thường nào, đừng ngần ngại tham vấn ý kiến của bác sĩ.
          </p>
        `;
        setPost({ ...post, content: postpartumContent });
      }
    }
  }, [post]);
  // ***** END: Thêm nội dung mặc định postpartum recovery tips *****

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

  // Thêm useEffect để lấy bình luận
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsResponse = await commentService.getPostComments(
          id as string
        );
        setComments(commentsResponse.data.items); // Cập nhật state comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Không tìm thấy bài viết</div>;

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1;

    // Giả lập API
    try {
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/like/17?accountId=1`
      );
      localStorage.setItem(`liked-${id}`, JSON.stringify(!isLiked));
      setPost((prev) => ({ ...prev, likeCount: newLikeCount }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    setIsSaved((prev) => !prev);

    // Giả lập API
    try {
      await axios.post(
        `https://api-mnyt.purintech.id.vn/api/Interactions/bookmark/17?accountId=1`
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
        {/* <button className={styles.followButton}>Theo dõi tác giả</button> */}
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
        <button className={styles.interactionButton}>
          <FaRegComment />
          <span>{post.commentCount}</span>
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

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h3>Bình luận ({comments.length})</h3>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className={styles.commentInput}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className={styles.fileInput}
            onChange={(e) => {
              if (e.target.files) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
          <button type="submit" className={styles.submitButton}>
            Gửi bình luận
          </button>
        </form>

        {/* Comments List */}
        <CommentList comments={comments} />
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
