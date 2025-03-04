'use client'
import styles from '@/app/blog/styles/blog.module.css';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const dummyPost = {
    id: 1,
    title: "Kinh nghiệm ăn uống khi mang thai",
    author: "Mai Anh",
    date: "17/02/2025",
    content: "Nội dung chi tiết của bài viết...",
    likes: 120,
    comments: [
        { id: 1, user: "Ngọc Linh", content: "Cảm ơn bài viết rất hay!" },
        { id: 2, user: "Hương Giang", content: "Rất bổ ích, mình sẽ thử áp dụng." },
    ],
};

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(dummyPost);

    useEffect(() => {
        // Giả lập fetch data từ backend
        setPost(dummyPost);
    }, [id]);

    return (
        <div className={styles.blogDetail}>
            <h1>{post.title}</h1>
            <p><b>{post.author}</b> - {post.date}</p>
            <p>{post.content}</p>

            <h3>Bình luận</h3>
            {post.comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                    <b>{comment.user}</b>: {comment.content}
                </div>
            ))}
        </div>
    );
};

export default BlogDetail;
