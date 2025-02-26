'use client'

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaComment, FaEye, FaUser, FaClock } from 'react-icons/fa';
import './page.css';

interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
    comments: number;
    excerpt: string;
    category: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Chuyện công nghệ: Review MacBook Pro M3 sau 1 tháng sử dụng",
        author: "TechReviewer",
        date: "2024-03-20",
        views: 1520,
        comments: 45,
        excerpt: "Chia sẻ trải nghiệm thực tế sau 1 tháng sử dụng MacBook Pro M3...",
        category: "Công nghệ"
    },
    {
        id: 2,
        title: "Tổng hợp deal hot cuối tuần: Săn sale điện thoại giảm đến 50%",
        author: "DealHunter",
        date: "2024-03-19",
        views: 2340,
        comments: 82,
        excerpt: "Tổng hợp các chương trình khuyến mãi điện thoại hot nhất...",
        category: "Khuyến mãi"
    },
    // Thêm các bài viết khác...
];

const BlogPage: React.FC = () => {
    return (
        <Container className="py-4">
            <h1 className="mb-4">Diễn đàn công nghệ</h1>

            {blogPosts.map(post => (
                <Card key={post.id} className="mb-3 blog-post-card">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="category-badge">{post.category}</div>
                            <div className="post-stats">
                                <span className="me-3">
                                    <FaEye className="me-1" />
                                    {post.views}
                                </span>
                                <span>
                                    <FaComment className="me-1" />
                                    {post.comments}
                                </span>
                            </div>
                        </div>

                        <Card.Title className="mt-2">
                            <a href={`/blog/post/${post.id}`} className="post-title">
                                {post.title}
                            </a>
                        </Card.Title>

                        <Card.Text className="post-excerpt">
                            {post.excerpt}
                        </Card.Text>

                        <div className="post-meta">
                            <span className="me-3">
                                <FaUser className="me-1" />
                                {post.author}
                            </span>
                            <span>
                                <FaClock className="me-1" />
                                {post.date}
                            </span>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default BlogPage;