// components/ForumHeader.tsx
import styles from "@/app/forum/components/components.module.css";

interface ForumHeaderProps {
  onCreatePost: () => void;
}

const ForumHeader = ({ onCreatePost }: ForumHeaderProps) => {
  return (
    <div className={styles.forumHeader}>
      <div className={styles.headerTitle}>
        <h1>Diễn đàn Mầm Non Yêu Thương</h1>
        <p>Nơi các mẹ bầu có thể chia sẻ và trò chuyện về mọi vấn đề</p>
      </div>
      <div className={styles.headerActions}>
        <button onClick={onCreatePost} className={styles.createPostButton}>
          <span className={styles.buttonIcon}>✏️</span>
          Tạo bài viết mới
        </button>
      </div>
    </div>
  );
};

export default ForumHeader;
