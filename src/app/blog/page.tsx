'use client'
import styles from '@/app/blog/styles/blog.module.css'
import BlogList from './components/BlogList';
import FilterSort from './Sort & Filter/FilterSort';
import Sidebar from './sidebar/Sidebar';
import Pagination from './Pagination/Pagination';
import { useState, useCallback, useEffect } from 'react';

// Định nghĩa các types
type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'most-commented';

const BlogPage = () => {
    // State management
    const [currentCategory, setCurrentCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1); // Bắt đầu với trang 1
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const totalPages = 10; // Sau này sẽ lấy từ API

    // Khôi phục trạng thái từ localStorage khi component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('blogCurrentPage');
            if (saved) {
                setCurrentPage(Number(saved));
            }
        }
    }, []);

    // Handlers
    const handleCategoryChange = useCallback((category: string) => {
        setCurrentCategory(category);
        setCurrentPage(1); // Reset về trang 1 khi đổi category
    }, []);

    const handleSortChange = useCallback((sort: SortOption) => {
        setSortBy(sort);
        setCurrentPage(1); // Reset về trang 1 khi đổi sort
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.blogContainer}>
            <div className={styles.mainContent}>
                {/* Filter và Sort */}
                <FilterSort
                    activeCategory={currentCategory}
                    currentSort={sortBy}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                />

                {/* Danh sách bài viết */}
                <BlogList 
                    category={currentCategory}
                    sortBy={sortBy}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />

                {/* Phân trang */}
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Sidebar */}
            <Sidebar />
        </div>
    );
}

export default BlogPage;