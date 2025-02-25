import styles from '@/app/blog/styles/blog.module.css';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import Link from 'next/link';

type PostProps = {
    post: {
        id: number;
        title: string;
        author: string;
        date: string;
        likes: number;
        comments: number;
    };
};

const BlogCard = ({ post }: PostProps) => {
    return (
        <Link href={`/blog/${post.id}`} className={styles.blogCard}>
            <div className={styles.blogHeader}>
                <h3>{post.title}</h3>
                <p>Đăng bởi <b>{post.author}</b> - {post.date}</p>
            </div>
            <div className={styles.blogFooter}>
                <span><FaRegHeart /> {post.likes}</span>
                <span><FaRegComment /> {post.comments}</span>
            </div>
        </Link>
    );
}

export default BlogCard;
