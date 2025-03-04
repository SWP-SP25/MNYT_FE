import styles from './components.module.css';
import BlogCard from './BlogCard';

const dummyPosts = [
    {
        id: 1,
        title: "Kinh nghiệm ăn uống khi mang thai",
        author: {
            id: 1,
            name: "Mai Anh",
            avatar: "/src/app/blog/public/ava1.jpg",
            role: "member" as const,
            postCount: 15
        },
        category: {
            id: 1,
            name: "Dinh dưỡng",
            color: "#279357"
        },
        createdAt: new Date("2024-02-17"),
        lastActivity: new Date("2024-02-17"),
        preview: "Chia sẻ những kinh nghiệm về chế độ ăn uống lành mạnh trong thai kỳ...",
        likes: 120,
        comments: 45,
        views: 500,
        isHot: true,
        tags: ["dinh dưỡng", "thai kỳ", "sức khỏe"]
    },
    {
        id: 2,
        title: "Những điều cần chuẩn bị trước khi sinh",
        author: {
            id: 2,
            name: "Ngọc Linh",
            avatar: "/avatars/default.png",
            role: "member" as const,
            postCount: 8
        },
        category: {
            id: 2,
            name: "Chuẩn bị sinh",
            color: "#2563eb"
        },
        createdAt: new Date("2024-02-15"),
        lastActivity: new Date("2024-02-16"),
        preview: "Danh sách những vật dụng cần thiết và cách chuẩn bị tinh thần...",
        likes: 98,
        comments: 30,
        views: 350,
        isSticky: true,
        tags: ["chuẩn bị sinh", "đồ sơ sinh", "kinh nghiệm"]
    },
    {
        id: 3,
        title: "Làm sao để giảm stress khi mang bầu?",
        author: {
            id: 3,
            name: "Hương Giang",
            avatar: "/avatars/default.png",
            role: "member" as const,
            postCount: 5
        },
        category: {
            id: 3,
            name: "Tâm lý",
            color: "#e11d48"
        },
        createdAt: new Date("2024-02-14"),
        lastActivity: new Date("2024-02-14"),
        preview: "Chia sẻ các phương pháp giảm stress hiệu quả trong thai kỳ...",
        likes: 80,
        comments: 20,
        views: 200,
        tags: ["tâm lý", "stress", "thai kỳ"]
    }
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
