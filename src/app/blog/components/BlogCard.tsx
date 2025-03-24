import styles from "./components.module.css";
import {
  FaRegHeart,
  FaRegComment,
  FaTag,
  FaClock,
  FaEye,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";

type PostProps = {
  post: {
    id: number;
    title: string;
    author: {
      id: number;
      name: string;
      avatar: string;
      role: "admin" | "moderator" | "member";
      postCount: number;
    };
    category: {
      id: number;
      name: string;
      color: string;
    };
    createdAt: string;
    lastActivity: Date;
    preview: string;
    likes: number;
    comments: number;
    views: number;
    isSticky?: boolean;
    isHot?: boolean;
    tags: string[];
  };
};

const BlogCard = ({ post }: PostProps) => {
  return (
    <div className={styles.forumPost}>
      {/* Author Info */}
      <div className={styles.authorSection}>
        <Image
          src={post.author.avatar}
          alt={post.author.name}
          width={40}
          height={40}
          className={styles.authorAvatar}
        />
        <div className={styles.authorInfo}>
          <Link
            href={`/profile/${post.author.id}`}
            className={styles.authorName}
          >
            {post.author.name}
          </Link>
          <span className={styles.postCount}>
            {post.author.postCount} bài viết
          </span>
        </div>
      </div>
      {/* Post Content Preview */}
      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          {post.isSticky && <span className={styles.stickyBadge}>Ghim</span>}
          {post.isHot && <span className={styles.hotBadge}>Hot</span>}
          <span
            className={styles.categoryBadge}
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
          <Link href={`/blog/${post.id}`} className={styles.postTitle}>
            {post.title}
          </Link>
        </div>

        <p className={styles.postPreview}>{post.preview}</p>

        <div className={styles.postMeta}>
          <div className={styles.postTags}>
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/blog/tag/${tag}`}
                className={styles.tag}
              >
                <FaTag size={12} />
                {tag}
              </Link>
            ))}
          </div>

          <div className={styles.postStats}>
            <span className={styles.timeAgo}>
              <FaClock />
              {formatDistanceToNow(post.createdAt, {
                locale: vi,
                addSuffix: true,
              })}
            </span>
            <span className={styles.views}>
              <FaEye />
              {post.views} lượt xem
            </span>
            <span className={styles.likes}>
              <FaRegHeart />
              {post.likes} thích
            </span>
            <span className={styles.comments}>
              <FaRegComment />
              {post.comments} bình luận
            </span>
            <span className={styles.createdAt}>
              <FaClock />
              {format(new Date(post.createdAt), "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
        </div>
      </div>
      {/* Last Activity */}
      <div className={styles.lastActivity}>
        <span>Hoạt động cuối:</span>
        {formatDistanceToNow(post.lastActivity, {
          locale: vi,
          addSuffix: true,
        })}
      </div>{" "}
      {/* Đảm bảo đóng thẻ div này */}
    </div>
  );
};

export default BlogCard;
