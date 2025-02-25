import styles from '@/app/blog/styles/blog.module.css';
import BlogCard from './BlogCard';

const dummyPosts = [
    { id: 1, title: "Kinh nghiệm ăn uống khi mang thai", author: "Mai Anh", date: "17/02/2025", likes: 120, comments: 45 },
    { id: 2, title: "Những điều cần chuẩn bị trước khi sinh", author: "Ngọc Linh", date: "15/02/2025", likes: 98, comments: 30 },
    { id: 3, title: "Làm sao để giảm stress khi mang bầu?", author: "Hương Giang", date: "14/02/2025", likes: 80, comments: 20 }
];

const BlogList = () => {
    return (
        <div className={styles.blogList}>
            {dummyPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default BlogList;
