'use client';

import { FC, useState } from 'react';
import styles from '@/app/blog/styles/blog.module.css';

interface FilterSortProps {
    activeCategory?: string;
    onCategoryChange?: (category: string) => void;
    onSortChange?: (sort: string) => void;
}

const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'kinh-nghiem', label: 'Kinh nghiệm' },
    { id: 'tam-su', label: 'Tâm sự' },
    { id: 'suc-khoe', label: 'Sức khỏe mẹ & bé' },
    { id: 'thoi-trang', label: 'Thời trang' },
    { id: 'dinh-duong', label: 'Dinh dưỡng' }
];

const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'oldest', label: 'Cũ nhất' }
];

const FilterSort: FC<FilterSortProps> = ({
    activeCategory = 'all',
    onCategoryChange = () => {},
    onSortChange = () => {}
}) => {
    const [localActiveCategory, setLocalActiveCategory] = useState(activeCategory);

    const handleCategoryChange = (category: string) => {
        setLocalActiveCategory(category);
        onCategoryChange(category);
    };

    return (
        <div className={styles.filterSortContainer}>
            {/* Categories */}
            <div className={styles.categories}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryButton} ${
                            localActiveCategory === category.id ? styles.active : ''
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Sort Dropdown */}
            <div className={styles.sortContainer}>
                <select
                    className={styles.sortSelect}
                    onChange={(e) => onSortChange(e.target.value)}
                    defaultValue="newest"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterSort;