import styles from "./components.module.css";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
  onRefresh: () => void;
}

const BlogPostCard = ({ post, onRefresh }: BlogPostCardProps) => {
  return (
    <div className={styles.postCard}>
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postDescription}>{post.description}</p>
      </div>

      <div className={styles.postFooter}>
        <div className={styles.commentCount}>
          <span className={styles.icon}>💬</span>
          {post.commentCount} bình luận
        </div>
        <div className={styles.likeCount}>
          <span className={styles.icon}>❤️</span>
          {post.likeCount} lượt thích
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
