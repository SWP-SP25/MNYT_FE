import styles from '@/app/blog/styles/blog.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            {/* Thống kê diễn đàn */}
            <div className={styles.statsCard}>
                <h3>Thống kê diễn đàn</h3>
                <div className={styles.statItem}>
                    <span>Tổng bài viết:</span>
                    <strong>1,234</strong>
                </div>
                <div className={styles.statItem}>
                    <span>Thành viên:</span>
                    <strong>5,678</strong>
                </div>
                <div className={styles.statItem}>
                    <span>Thành viên mới nhất:</span>
                    <strong>Mai Anh</strong>
                </div>
            </div>

            {/* Top thành viên tích cực */}
            <div className={styles.topMembers}>
                <h3>Thành viên tích cực</h3>
                <div className={styles.memberList}>
                    {[
                        { name: "Mai Anh", posts: 150, avatar: "/avatars/default.png" },
                        { name: "Ngọc Linh", posts: 120, avatar: "/avatars/default.png" },
                        { name: "Hương Giang", posts: 98, avatar: "/avatars/default.png" },
                    ].map((member, index) => (
                        <div key={index} className={styles.memberItem}>
                            <img src={member.avatar} alt={member.name} />
                            <div>
                                <strong>{member.name}</strong>
                                <span>{member.posts} bài viết</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chủ đề đang hot */}
            <div className={styles.trendingTopics}>
                <h3>Chủ đề đang hot</h3>
                <div className={styles.tagCloud}>
                    {[
                        "Mang thai tháng đầu",
                        "Dinh dưỡng",
                        "Thai giáo",
                        "Sức khỏe",
                        "Làm đẹp",
                        "Tâm sự",
                    ].map((tag, index) => (
                        <a key={index} href={`/tag/${tag}`} className={styles.trendingTag}>
                            #{tag}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;