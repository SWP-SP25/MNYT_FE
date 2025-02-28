'use client'
import styles from '@/app/blog/styles/blog.module.css'
import BlogList from './components/BlogList';
import CategoryMenu from './components/CategoryMenu';
import FeaturedPosts from './components/FeaturedPosts';

const BlogPage = () => {
    return (
        <div className={styles.blogContainer}>
            <CategoryMenu />
            <div className={styles.blogContent}>
                <FeaturedPosts />
                <BlogList />
            </div>
        </div>
    );
}

export default BlogPage;
