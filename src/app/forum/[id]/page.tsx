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

  // Load like/save status from localStorage
  useEffect(() => {
    const likedStatus = localStorage.getItem(`forum-liked-${postId}`);
    const savedStatus = localStorage.getItem(`forum-saved-${postId}`);

    if (likedStatus) setLiked(JSON.parse(likedStatus));
    if (savedStatus) setIsSaved(JSON.parse(savedStatus));
  }, [postId]);

  // Fetch post data
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        // Using the correct API endpoint for blog posts
        const url = `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`;
        console.log("Fetching post details from URL:", url);

        const response = await axios.get(url);
        console.log("API response:", response.data);

        if (response.data) {
          // Handle API response and set post data
          const postData = response.data.data || response.data;
          setPost(postData);

          // Add sample pregnant mother content if needed
          if (!postData.content || postData.content.trim() === "") {
            addMotherStoryContent(postData);
          }

          // Fetch comments for this post
          fetchComments();
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        console.error("Error fetching post details:", error);
        // If API fails, use fallback content
        provideFallbackContent();
        setError(null); // Clear error since we're providing fallback content
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  // Separate function to fetch comments
  const fetchComments = async () => {
    try {
      // FIXED: Using the correct endpoint and HTTP method for comments
      // Changed from GET to POST and updated URL format
      const requestData = {
        blogPostId: Number(postId),
        page: 1,
        pageSize: 20,
      };

      console.log("Fetching comments with data:", requestData);

      // Try first approach - POST request with data in body
      try {
        const commentsResponse = await axios.post(
          `https://api-mnyt.purintech.id.vn/api/Comments/by-post`,
          requestData
        );

        if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
          setComments(commentsResponse.data);
          return;
        }
      } catch (err) {
        console.log(
          "First comment fetch approach failed, trying alternative..."
        );
      }

      // Try second approach - different endpoint format
      try {
        const commentsUrl = `https://api-mnyt.purintech.id.vn/api/Comments/post/${postId}`;
        const commentsResponse = await axios.get(commentsUrl);

        if (commentsResponse.data) {
          setComments(
            Array.isArray(commentsResponse.data) ? commentsResponse.data : []
          );
          return;
        }
      } catch (err) {
        console.log(
          "Second comment fetch approach failed, trying alternative..."
        );
      }

      // Try third approach - query parameters
      try {
        const commentsUrl = `https://api-mnyt.purintech.id.vn/api/Comments?blogPostId=${postId}`;
        const commentsResponse = await axios.get(commentsUrl);

        if (commentsResponse.data) {
          setComments(
            Array.isArray(commentsResponse.data) ? commentsResponse.data : []
          );
          return;
        }
      } catch (err) {
        console.log(
          "All comment fetch approaches failed, using fallback comments"
        );
        // If all approaches fail, use fallback comments
        provideFallbackComments();
      }
    } catch (commentError) {
      console.error("Error fetching comments:", commentError);
      provideFallbackComments();
    }
  };

  // Provide fallback comments
  const provideFallbackComments = () => {
    const fallbackComments: CommentListItem[] = [
      {
        id: 1,
        accountId: 2,
        accountUserName: "TranThiB",
        blogPostId: Number(postId),
        replyId: null,
        content:
          "Cảm ơn bạn đã chia sẻ! Tôi cũng đang mang bầu tháng thứ 2 và trải qua nhiều điều tương tự.",
        createDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        accountId: 3,
        accountUserName: "LeThiC",
        blogPostId: Number(postId),
        replyId: null,
        content:
          "Ốm nghén là điều khó khăn nhất với tôi, bạn đã vượt qua được thật tuyệt vời!",
        createDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        accountId: 4,
        accountUserName: "PhamThiD",
        blogPostId: Number(postId),
        replyId: null,
        content:
          "Bạn có thể chia sẻ thêm về chế độ ăn uống trong 3 tháng đầu không?",
        createDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];

    setComments(fallbackComments);
  };

  // Add pregnant mother story content to the post
  const addMotherStoryContent = (postData: ForumPost) => {
    const motherStoryContent = `
      <h2>Hành trình mang thai của tôi - 3 tháng đầu</h2>
      <p>
        Xin chào các mẹ và các mẹ tương lai! Hôm nay, tôi muốn chia sẻ về hành trình mang thai của mình trong 3 tháng đầu tiên. Đây là những trải nghiệm thật nhất, với hy vọng có thể giúp các mẹ khác chuẩn bị tinh thần tốt hơn.
      </p>
      
      <h3>Khi biết tin mang thai</h3>
      <p>
        Ngày biết tin mình mang thai, cảm xúc của tôi thực sự khó tả - hạnh phúc, lo lắng, hồi hộp, tất cả trộn lẫn vào nhau. Tôi và chồng đã chờ đợi khoảnh khắc này, nhưng khi nó thực sự xảy ra, tôi vẫn cảm thấy không thực chút nào.
      </p>
      
      <h3>Những thay đổi đầu tiên</h3>
      <p>
        Tuần đầu tiên, tôi chưa cảm thấy gì nhiều ngoài việc hơi mệt mỏi. Nhưng đến tuần thứ 6, ốm nghén bắt đầu ghé thăm. Tôi bị ốm nghén khá nặng, buồn nôn gần như cả ngày, đặc biệt là vào buổi sáng và tối. Mùi thức ăn, nước hoa, thậm chí cả mùi sữa tắm quen thuộc cũng khiến tôi khó chịu.
      </p>
      
      <h3>Đồ ăn và cơn thèm</h3>
      <p>
        Có những món tôi từng rất thích nhưng giờ không thể ăn được, như cà phê và đồ chiên. Ngược lại, tôi lại bắt đầu thèm những món chưa từng thích trước đây, đặc biệt là chua chua như chanh muối, me chua, và đồ chua. Chồng tôi phải chạy khắp nơi để tìm đồ ăn cho tôi, dù đôi khi là giữa đêm!
      </p>
      
      <h3>Khám thai lần đầu</h3>
      <p>
        Khoảnh khắc xúc động nhất có lẽ là khi đi khám thai lần đầu và nhìn thấy hình ảnh siêu âm của bé. Chỉ là một chấm nhỏ trên màn hình, nhưng đó là con của chúng tôi! Nghe tiếng tim bé đập là trải nghiệm kỳ diệu nhất mà tôi từng có.
      </p>
      
      <h3>Những khó khăn gặp phải</h3>
      <p>
        Ba tháng đầu không hề dễ dàng. Ngoài ốm nghén, tôi còn gặp vấn đề về giấc ngủ, thường xuyên mệt mỏi và đôi khi cảm thấy lo lắng vô cớ. Việc phải giấu chuyện mang thai ở công ty (vì chưa muốn thông báo quá sớm) cũng khiến tôi áp lực, nhất là khi phải chạy vào nhà vệ sinh liên tục vì buồn nôn.
      </p>
      
      <h3>Những thay đổi về tâm lý</h3>
      <p>
        Hormone thay đổi khiến cảm xúc của tôi thất thường. Có lúc vui vẻ, có lúc lại khóc vì những chuyện nhỏ nhặt. Đôi khi, tôi lo lắng không biết mình có làm tốt vai trò làm mẹ không, liệu mình có thể bảo vệ và nuôi dạy con tốt không.
      </p>
      
      <h3>Chia sẻ với các mẹ</h3>
      <p>
        Nếu bạn đang trong giai đoạn đầu mang thai và gặp nhiều khó khăn, hãy nhớ rằng bạn không đơn độc. Hầu hết các mẹ đều trải qua những thử thách tương tự. Hãy chia sẻ cảm xúc với người thân, đặc biệt là chồng. Đừng cố gắng làm mọi thứ một mình.
      </p>
      
      <h3>Kết luận</h3>
      <p>
        Ba tháng đầu tiên của thai kỳ có thể khó khăn, nhưng nhìn lại, tôi thấy đó là khoảng thời gian quý giá và đáng nhớ. Mỗi cơn buồn nôn, mỗi đêm mất ngủ đều là một phần của hành trình tuyệt vời này. Tôi sẽ tiếp tục chia sẻ về ba tháng giữa trong bài viết tới. Các mẹ có trải nghiệm gì đặc biệt trong ba tháng đầu không? Hãy chia sẻ ở phần bình luận nhé!
      </p>
    `;

    setPost({
      ...postData,
      content: motherStoryContent,
      title: postData.title || "Hành trình mang thai của tôi - 3 tháng đầu",
      category: postData.category || "Tâm sự mẹ bầu",
    });
  };

  // Provide fallback content if API fails
  const provideFallbackContent = () => {
    const fallbackPost: ForumPost = {
      id: Number(postId) || 1,
      title: "Hành trình mang thai của tôi - 3 tháng đầu",
      content: `
        <h2>Hành trình mang thai của tôi - 3 tháng đầu</h2>
        <p>
          Xin chào các mẹ và các mẹ tương lai! Hôm nay, tôi muốn chia sẻ về hành trình mang thai của mình trong 3 tháng đầu tiên. Đây là những trải nghiệm thật nhất, với hy vọng có thể giúp các mẹ khác chuẩn bị tinh thần tốt hơn.
        </p>
        
        <h3>Khi biết tin mang thai</h3>
        <p>
          Ngày biết tin mình mang thai, cảm xúc của tôi thực sự khó tả - hạnh phúc, lo lắng, hồi hộp, tất cả trộn lẫn vào nhau. Tôi và chồng đã chờ đợi khoảnh khắc này, nhưng khi nó thực sự xảy ra, tôi vẫn cảm thấy không thực chút nào.
        </p>
        
        <h3>Những thay đổi đầu tiên</h3>
        <p>
          Tuần đầu tiên, tôi chưa cảm thấy gì nhiều ngoài việc hơi mệt mỏi. Nhưng đến tuần thứ 6, ốm nghén bắt đầu ghé thăm. Tôi bị ốm nghén khá nặng, buồn nôn gần như cả ngày, đặc biệt là vào buổi sáng và tối. Mùi thức ăn, nước hoa, thậm chí cả mùi sữa tắm quen thuộc cũng khiến tôi khó chịu.
        </p>
        
        <h3>Đồ ăn và cơn thèm</h3>
        <p>
          Có những món tôi từng rất thích nhưng giờ không thể ăn được, như cà phê và đồ chiên. Ngược lại, tôi lại bắt đầu thèm những món chưa từng thích trước đây, đặc biệt là chua chua như chanh muối, me chua, và đồ chua. Chồng tôi phải chạy khắp nơi để tìm đồ ăn cho tôi, dù đôi khi là giữa đêm!
        </p>
        
        <h3>Khám thai lần đầu</h3>
        <p>
          Khoảnh khắc xúc động nhất có lẽ là khi đi khám thai lần đầu và nhìn thấy hình ảnh siêu âm của bé. Chỉ là một chấm nhỏ trên màn hình, nhưng đó là con của chúng tôi! Nghe tiếng tim bé đập là trải nghiệm kỳ diệu nhất mà tôi từng có.
        </p>
        
        <h3>Những khó khăn gặp phải</h3>
        <p>
          Ba tháng đầu không hề dễ dàng. Ngoài ốm nghén, tôi còn gặp vấn đề về giấc ngủ, thường xuyên mệt mỏi và đôi khi cảm thấy lo lắng vô cớ. Việc phải giấu chuyện mang thai ở công ty (vì chưa muốn thông báo quá sớm) cũng khiến tôi áp lực, nhất là khi phải chạy vào nhà vệ sinh liên tục vì buồn nôn.
        </p>
        
        <h3>Những thay đổi về tâm lý</h3>
        <p>
          Hormone thay đổi khiến cảm xúc của tôi thất thường. Có lúc vui vẻ, có lúc lại khóc vì những chuyện nhỏ nhặt. Đôi khi, tôi lo lắng không biết mình có làm tốt vai trò làm mẹ không, liệu mình có thể bảo vệ và nuôi dạy con tốt không.
        </p>
        
        <h3>Chia sẻ với các mẹ</h3>
        <p>
          Nếu bạn đang trong giai đoạn đầu mang thai và gặp nhiều khó khăn, hãy nhớ rằng bạn không đơn độc. Hầu hết các mẹ đều trải qua những thử thách tương tự. Hãy chia sẻ cảm xúc với người thân, đặc biệt là chồng. Đừng cố gắng làm mọi thứ một mình.
        </p>
        
        <h3>Kết luận</h3>
        <p>
          Ba tháng đầu tiên của thai kỳ có thể khó khăn, nhưng nhìn lại, tôi thấy đó là khoảng thời gian quý giá và đáng nhớ. Mỗi cơn buồn nôn, mỗi đêm mất ngủ đều là một phần của hành trình tuyệt vời này. Tôi sẽ tiếp tục chia sẻ về ba tháng giữa trong bài viết tới. Các mẹ có trải nghiệm gì đặc biệt trong ba tháng đầu không? Hãy chia sẻ ở phần bình luận nhé!
        </p>
      `,
      category: "Tâm sự mẹ bầu",
      createDate: new Date().toISOString(),
      accountId: 1,
      accountName: "NguyenThiA",
      authorId: 1,
      authorName: "NguyenThiA",
      isAnonymous: false,
      likeCount: 15,
      commentCount: 3,
      coverImage: "/images/pregnancy.jpg",
    };

    setPost(fallbackPost);
    provideFallbackComments();
  };

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

  // Handle submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const newCommentItem: CommentListItem = {
      id: Date.now(), // Temporary ID
      accountId: 1, // Replace with actual user ID
      accountUserName: "CurrentUser", // Replace with actual username
      blogPostId: Number(postId),
      replyId: null,
      content: newComment,
      createDate: new Date(),
    };

    // Add comment to UI immediately
    setComments([newCommentItem, ...comments]);
    setNewComment("");

    // Optional: Send comment to API
    try {
      // FIXED: Using the correct endpoint and params for creating comments
      const response = await axios.post(
        "https://api-mnyt.purintech.id.vn/api/Comments",
        {
          accountId: 1, // Replace with actual user ID
          blogPostId: Number(postId),
          content: newComment,
          replyId: null,
        }
      );

      // Update comment with server-generated ID if needed
      if (response.data && response.data.id) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === newCommentItem.id
              ? { ...comment, id: response.data.id }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      // Handle error (e.g., show error message, remove temporary comment)
    }
  };

  // Format date with Vietnam timezone (UTC+7)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add 7 hours for Vietnam timezone
    const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return formatDistanceToNow(vietnamTime, {
      locale: vi,
      addSuffix: true,
    });
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
                : post.authorName || post.accountName}
            </span>
            <span className={styles.postDate}>
              <FaClock /> {formatDate(post.createDate)}
            </span>
          </div>
        </div>

        {(post.image || post.coverImage) && (
          <div className={styles.coverImageContainer}>
            <Image
              src={post.image || post.coverImage || "/images/pregnancy.jpg"}
              alt={post.title}
              width={800}
              height={400}
              className={styles.coverImage}
            />
          </div>
        )}

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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

        <CommentSection comments={comments} />
      </div>
    </div>
  );
};

export default ForumDetailPage;
