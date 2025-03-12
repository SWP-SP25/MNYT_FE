'use client'
import styles from './blogDetail.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaBookmark, FaClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { blogService, commentService, BlogPost, Comment } from '@/app/services/api';

// Thêm interface để type checking
interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    content: string;
    createdAt: Date;
    likes: number;
}

interface BlogPost {
    id: number;
    title: string;
    author: {
        id: number;
        name: string;
        avatar: string;
        bio: string;
    };
    category: {
        id: number;
        name: string;
        color: string;
    };
    createdAt: Date;
    content: string;
    likes: number;
    comments: Comment[];
    views: number;
    tags: string[];
    coverImage: string;
}

// Thêm interface cho related posts
interface RelatedPost {
    id: number;
    title: string;
    coverImage: string;
    category: {
        name: string;
        color: string;
    };
}

// Thêm interface cho TOC
interface TableOfContentsItem {
    id: string;
    title: string;
    level: number;
}

const BlogDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
    const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch post details
                // const postData = await blogService.getPostById(id as string);
                const postData = {
                    "success": true,
                    "data": {
                      "id": 0,
                      "title": "string",
                      "description": "string",
                      "authorId": 0,
                      "authorName": "string",
                      "period": 0,
                      "status": "string",
                      "publishedDay": "2025-03-08",
                      "likeCount": 0,
                      "commentCount": 0,
                      "bookmarkCount": 0
                    },
                    "message": "string",
                    "errors": [
                      "string"
                    ]
                  }
                setPost(postData.data);

                // Fetch comments
                const commentsData = await commentService.getPostComments(id as string);
                setComments(commentsData);
            } catch (err) {
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Thêm vào useEffect
    useEffect(() => {
        // Giả lập dữ liệu related posts
        const dummyRelatedPosts: RelatedPost[] = [
            {
                id: 2,
                title: "Chế độ dinh dưỡng cho bé 6-12 tháng tuổi",
                coverImage: "/images/blog/baby-nutrition.jpg",
                category: {
                    name: "Dinh dưỡng",
                    color: "#279357"
                }
            },
            {
                id: 3,
                title: "10 món ăn vặt lành mạnh cho mẹ bầu",
                coverImage: "/images/blog/healthy-snacks.jpg",
                category: {
                    name: "Dinh dưỡng",
                    color: "#279357"
                }
            }
        ];
        setRelatedPosts(dummyRelatedPosts);
    }, []);

    // Thêm function để generate TOC từ content
    const generateTableOfContents = (content: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const headings = doc.querySelectorAll('h2, h3');
        
        return Array.from(headings).map((heading, index) => ({
            id: `section-${index}`,
            title: heading.textContent || '',
            level: parseInt(heading.tagName[1])
        }));
    };

    // Trong useEffect, thêm:
    useEffect(() => {
        if (post?.content) {
            const toc = generateTableOfContents(post.content);
            setTableOfContents(toc);
        }
    }, [post?.content]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!post) return <div>Không tìm thấy bài viết</div>;

    const handleLike = () => {
        setIsLiked(!isLiked);
        // Sau này sẽ gọi API để update like
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        // Sau này sẽ gọi API để save post
    };

    const handleShare = () => {
        // Implement share functionality
        navigator.share({
            title: post.title,
            text: "Chia sẻ bài viết hay về mang thai",
            url: window.location.href
        });
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await commentService.addComment({
                postId: id as string,
                content: newComment
            });

            // Refresh comments after adding new one
            const updatedComments = await commentService.getPostComments(id as string);
            setComments(updatedComments);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    return (
        <div className={styles.blogDetailContainer}>
            {/* Header */}
            <div className={styles.blogHeader}>
                <div className={styles.category} style={{ backgroundColor: /*post.category.color*/ "green"}}>
                    {/* {post.category.name} */"abc"}
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                
                <div className={styles.authorInfo}>
                    {/* <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className={styles.authorAvatar}
                    /> */}
                    <div className={styles.authorMeta}>
                        <span className={styles.authorName}>{/*post.author.name*/"abc"}</span>
                        <span className={styles.postDate}>
                            <FaClock />
                            {/* {formatDistanceToNow(post.createdAt, { locale: vi, addSuffix: true })} */}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className={styles.coverImageContainer}>
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className={styles.coverImage}
                />
            </div>

            {/* Table of Contents */}
            <div className={styles.tableOfContents}>
                <h3>Mục lục</h3>
                <ul>
                    {tableOfContents.map((item) => (
                        <li 
                            key={item.id}
                            className={`${styles.tocItem} ${styles[`level${item.level}`]}`}
                        >
                            <a href={`#${item.id}`}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Author Bio Box */}
            <div className={styles.authorBioBox}>
                <div className={styles.authorBioHeader}>
                    {/* <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={80}
                        height={80}
                        className={styles.authorBioAvatar}
                    /> */}
                    <div className={styles.authorBioInfo}>
                        <h3>{/*post.author.name*/"abc"}</h3>
                        {/* <p className={styles.authorBioText}>{post.author.bio}</p> */}
                    </div>
                </div>
                <div className={styles.authorStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>15</span>
                        <span className={styles.statLabel}>Bài viết</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>2.5K</span>
                        <span className={styles.statLabel}>Người theo dõi</span>
                    </div>
                </div>
                <button className={styles.followButton}>Theo dõi tác giả</button>
            </div>

            {/* Tags */}
            <div className={styles.tags}>
                {/* {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag}</span>
                ))} */}
            </div>

            {/* Interaction Bar */}
            <div className={styles.interactionBar}>
                <button 
                    className={`${styles.interactionButton} ${isLiked ? styles.active : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{post.likes}</span>
                </button>
                <button className={styles.interactionButton}>
                    <FaRegComment />
                    <span>{/*post.comments.length*/"abc"}</span>
                </button>
                <button className={styles.interactionButton} onClick={handleShare}>
                    <FaShare />
                    <span>Chia sẻ</span>
                </button>
                <button 
                    className={`${styles.interactionButton} ${isSaved ? styles.active : ''}`}
                    onClick={handleSave}
                >
                    <FaBookmark />
                    <span>{isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
                </button>
            </div>

            {/* Comments Section */}
            <div className={styles.commentsSection}>
                <h3>Bình luận ({comments.length})</h3>
                
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Gửi bình luận
                    </button>
                </form>

                {/* Comments List */}
                <div className={styles.commentsList}>
                    {/* {comments.map((comment) => (
                        <div key={comment.id} className={styles.commentItem}>
                            <Image
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                width={40}
                                height={40}
                                className={styles.commentAvatar}
                            />
                            <div className={styles.commentContent}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>{comment.user.name}</span>
                                    <span className={styles.commentDate}>
                                        {formatDistanceToNow(comment.createdAt, { locale: vi, addSuffix: true })}
                                    </span>
                                </div>
                                <p className={styles.commentText}>{comment.content}</p>
                                <div className={styles.commentActions}>
                                    <button className={styles.likeButton}>
                                        <FaRegHeart />
                                        <span>{comment.likes}</span>
                                    </button>
                                    <button className={styles.replyButton}>
                                        Trả lời
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>

            {/* Related Posts */}
            <div className={styles.relatedPosts}>
                <h3>Bài viết liên quan</h3>
                <div className={styles.relatedPostsGrid}>
                    {relatedPosts.map((post) => (
                        <div key={post.id} className={styles.relatedPostCard}
                             onClick={() => router.push(`/blog/${post.id}`)}>
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={300}
                                height={200}
                                className={styles.relatedPostImage}
                            />
                            <div className={styles.relatedPostInfo}>
                                <span className={styles.relatedPostCategory}
                                      style={{ backgroundColor: post.category.color }}>
                                    {post.category.name}
                                </span>
                                <h4>{post.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
