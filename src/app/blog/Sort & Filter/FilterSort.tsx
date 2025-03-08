'use client';

import { FC, useState } from 'react';
import styles from './filter.module.css';
import { FaSort } from 'react-icons/fa';

interface FilterSortProps {
    activeCategory?: string;
    currentSort?: string;
    onCategoryChange?: (category: string) => void;
    onSortChange?: (sort: string) => void;
}

const FilterSort: FC<FilterSortProps> = ({
    activeCategory = 'all',
    currentSort = 'newest',
    onCategoryChange = () => {},
    onSortChange = () => {}
}) => {
    const [localActiveCategory, setLocalActiveCategory] = useState(activeCategory);

    const handleCategoryChange = (category: string) => {
        setLocalActiveCategory(category);
        onCategoryChange(category);
    };

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'experience', name: 'Kinh nghiệm' },
        { id: 'sharing', name: 'Tâm sự' },
        { id: 'health', name: 'Sức khỏe mẹ & bé' },
        { id: 'fashion', name: 'Thời trang' },
        { id: 'nutrition', name: 'Dinh dưỡng' }
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Categories */}
            <div className={styles.categorySection}>
                <div className={styles.categoryMenu}>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`${styles.categoryButton} ${
                                localActiveCategory === category.id ? styles.active : ''
                            }`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort Dropdown - Tách riêng */}
            <div className={styles.sortContainer}>
                <div className={styles.sortWrapper}>
                    <select
                        className={styles.sortSelect}
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="most-viewed">Phổ biến nhất</option>
                        <option value="most-commented">Nhiều bình luận nhất</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterSort;