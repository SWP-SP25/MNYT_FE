"use client";

import { FC, useState } from "react";
import styles from "./filter.module.css";
import { FaSort } from "react-icons/fa";

interface FilterSortProps {
  activeCategory?: string;
  currentSort?: string;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
}

const FilterSort: FC<FilterSortProps> = ({
  activeCategory = "all",
  currentSort = "newest",
  onCategoryChange = () => {},
  onSortChange = () => {},
}) => {
  const [localActiveCategory, setLocalActiveCategory] =
    useState(activeCategory);

  const handleCategoryChange = (category: string) => {
    setLocalActiveCategory(category);
    onCategoryChange(category);
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "experience", name: "Experience" },
    { id: "sharing", name: "Sharing" },
    { id: "health", name: "Health" },
    { id: "fashion", name: "Fashion" },
    { id: "nutrition", name: "Nutrition" },
    { id: "pregnancy", name: "Pregnancy" },
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
                localActiveCategory === category.id ? styles.active : ""
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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-viewed">Most Viewed</option>
            <option value="most-commented">Most Commented</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSort;
