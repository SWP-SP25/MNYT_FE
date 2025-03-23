'use client'
import styles from './components.module.css';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { CommentListItem } from '@/types/commentList';

interface CommentListProps {
    comments: CommentListItem[];
}

const safeCreateDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date; // Trả về ngày hiện tại nếu không hợp lệ
};

const CommentList = ({ comments }: CommentListProps) => {
    return (
        <div className={styles.commentsList}>
            {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                    <Image
                        src="/images/ava1.jpg" // Thay thế bằng avatar của người dùng nếu có
                        alt={comment.accountUserName}
                        width={40}
                        height={40}
                        className={styles.commentAvatar}
                    />
                    <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>{comment.accountUserName}</span>
                            <span className={styles.commentDate}>
                                {formatDistanceToNow(safeCreateDate(comment.createDate), { locale: vi, addSuffix: true })}
                            </span>
                        </div>
                        <p className={styles.commentText}>{comment.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;