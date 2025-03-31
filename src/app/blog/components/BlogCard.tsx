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
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { BlogPost, Category } from "@/types/blog";

type PostProps = {
  post: BlogPost;
};

const BlogCard = ({ post }: PostProps) => {
  return (
    <div className={styles.forumPost}>
      {/* Author Info */}
      <div className={styles.authorSection}>
        <Image
          src={post.thumbnail || "/default-avatar.png"}
          alt={post.authorName}
          width={40}
          height={40}
          className={styles.authorAvatar}
        />
        <div className={styles.authorInfo}>
          <Link
            href={`/profile/${post.authorId}`}
            className={styles.authorName}
          >
            {post.authorName}
          </Link>
        </div>
      </div>
      {/* Post Content Preview */}
      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <span
            className={styles.categoryBadge}
            style={{ backgroundColor: getCategoryColor(post.category) }}
          >
            {post.category}
          </span>
          <Link href={`/blog/${post.id}`} className={styles.postTitle}>
            {post.title}
          </Link>
        </div>

        <p className={styles.postPreview}>{post.description}</p>

        <div className={styles.postMeta}>
          <div className={styles.postStats}>
            <span className={styles.timeAgo}>
              <FaClock />
              {formatDistanceToNow(new Date(post.createDate), {
                locale: vi,
                addSuffix: true,
              })}
            </span>
            <span className={styles.likes}>
              <FaRegHeart />
              {post.likeCount} thích
            </span>
            <span className={styles.comments}>
              <FaRegComment />
              {post.commentCount} bình luận
            </span>
            <span className={styles.createdAt}>
              <FaClock />
              {format(new Date(post.createDate), "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category color
function getCategoryColor(category: Category): string {
  const categoryColors: { [key in Category]: string } = {
    [Category.All]: "#6B7280",
    [Category.Experience]: "#3B82F6",
    [Category.Story]: "#EC4899",
    [Category.HealthPregnancy]: "#10B981",
    [Category.Fashion]: "#F59E0B",
    [Category.Nutrition]: "#8B5CF6",
  };
  return categoryColors[category] || "#6B7280";
}

export default BlogCard;
