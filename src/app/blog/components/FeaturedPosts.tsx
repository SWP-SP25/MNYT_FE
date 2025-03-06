import styles from '@/app/blog/styles/blog.module.css';
const featuredPosts = [
    { id: 1, title: "Kinh nghiệm chăm sóc mẹ bầu khỏe mạnh", views: 5000 },
    { id: 2, title: "Bí quyết giảm đau lưng khi mang thai", views: 4200 },
];

const FeaturedPosts = () => {
    return (
        <div className={styles.featuredPosts}>
            <h3>Bài viết nổi bật</h3>
            <ul>
                {featuredPosts.map(post => (
                    <li key={post.id}>
                        <a href={`/blog/${post.id}`}>{post.title} - {post.views} lượt xem</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FeaturedPosts;