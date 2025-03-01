'use client'
import styles from '@/app/blog/styles/blog.module.css'
import BlogList from './components/BlogList';
import FilterSort from './Sort & Filter/FilterSort';
import Sidebar from './sidebar/Sidebar';
import { useState } from 'react';
import Pagination from './Pagination/Pagination';

const BlogPage = () => {
    const [currentCategory, setCurrentCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
        <div className={styles.blogContainer}>
            <div className={styles.mainContent}>
                <FilterSort
                    activeCategory={currentCategory}
                    onCategoryChange={(category) => setCurrentCategory(category)}
                    onSortChange={(sort) => {
                        // Handle sort change
                    }}
                />
                <BlogList />
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
            <Sidebar />
        </div>
    );
}

export default BlogPage;
