"use client";
import styles from "./components.module.css";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { CommentListItem } from "@/types/commentList";

interface CommentSectionProps {
  comments: CommentListItem[];
}

const safeCreateDate = (dateString: string | Date) => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return new Date();

  // Cộng thêm 7 giờ cho múi giờ Việt Nam
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

const CommentSection = ({ comments }: CommentSectionProps) => {
  return (
    <div className={styles.commentsList}>
      {comments.map((comment, index) => (
        <div key={`${comment.id}-${index}`} className={styles.commentItem}>
          <Image
            src="/images/ava1.jpg"
            alt={comment.accountUserName || "User Avatar"}
            width={40}
            height={40}
            className={styles.commentAvatar}
          />
          <div className={styles.commentContent}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>
                {comment.accountUserName}
              </span>
              <span className={styles.commentDate}>
                {formatDistanceToNow(safeCreateDate(comment.createDate), {
                  locale: vi,
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className={styles.commentText}>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
