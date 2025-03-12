'use client'
import { useEffect, useState } from 'react';
import { blogService, BlogPost, PaginatedResponse } from '@/app/services/api';
import styles from './components.module.css';
import Image from 'next/image';
import Link from 'next/link';
import useAxios from '@/hooks/useFetchAxios';
import { BlogPostListResponse } from '@/types/blogPostList';

interface BlogListProps {
    category: string;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function BlogList({ category, currentPage, onPageChange }: BlogListProps) {
    const [totalPages, setTotalPages] = useState(1);
    const { response: blogPostListResponse, error, loading } = useAxios<BlogPostListResponse>({
        url: `https://api-mnyt.purintech.id.vn/api/BlogPosts/all-paginated?PageNumber=${currentPage}&PageSize=10`,
        method: "get"
    });
    
    // Debug render
    console.log('Current posts state:', blogPostListResponse);
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    <span className={styles.loadingText}>Đang tải bài viết...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
                Thử lại
            </button>
        </div>;
    }

    if (!blogPostListResponse?.data.items || blogPostListResponse?.data.items.length === 0) {
        return <div className={styles.empty}>
            <p>Chưa có bài viết nào trong mục này</p>
        </div>;
    }

    return (
        <div className={styles.blogList}>
            {blogPostListResponse?.data.items.map((post) => (
                <div key={post.id} className={styles.blogCard}>
                    {/* Thumbnail */}
                    <div className={styles.thumbnailContainer}>
                        {post.thumbnail ? (
                            <Image
                                src={post.thumbnail}
                                alt={post.title}
                                width={300}
                                height={200}
                                className={styles.thumbnail}
                            />
                        ) : (
                            <div className={styles.placeholderThumbnail}>
                                No image
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className={styles.cardContent}>
                        {/* Category tag */}
                        <div 
                            className={styles.categoryTag}
                            style={{
                                backgroundColor: getCategoryColor(post.category)
                            }}
                        >
                            {post.category ? post.category : 'Dành cho mẹ bầu'}
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${post.id}`}>
                            <h2 className={styles.title}>{post.title}</h2>
                        </Link>

                        {/* Author info */}
                        <div className={styles.authorInfo}>
                            {/* {post.author.avatar && (
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={24}
                                    height={24}
                                    className={styles.authorAvatar}
                                />
                            )} */}
                            <span className={styles.authorName}>
                                {post.authorName}
                            </span>
                        </div>

                        {/* Post stats */}
                        {/* <div className={styles.postStats}>
                            <span>
                                <i className="far fa-eye"></i> {post.views ? post.views : 0}
                            </span>
                            <span>
                                <i className="far fa-comment"></i> {post.comments?.length || 0}
                            </span>
                            <span>
                                <i className="far fa-heart"></i> {post.likes}
                            </span>
                        </div> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper function to get category color
function getCategoryColor(category: string): string {
    const categoryColors: { [key: string]: string } = {
        'Tất cả': '#6B7280',
        'Kinh nghiệm': '#3B82F6',
        'Tâm sự': '#EC4899',
        'Sức khỏe mẹ & bé': '#10B981',
        'Thời trang': '#F59E0B',
        'Dinh dưỡng': '#8B5CF6'
    };
    return categoryColors[category] || '#6B7280';
}