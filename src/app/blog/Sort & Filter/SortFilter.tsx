"use client";
import React from "react";
import styles from "./sortFilter.module.css";

// Xóa các type và interface liên quan đến sorting
interface SortFilterProps {
  categories: { value: string; label: string }[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const SortFilter = ({
  categories,
  currentCategory,
  onCategoryChange,
}: SortFilterProps) => {
  return (
    <div className={styles.sortFilterContainer}>
      <div className={styles.filterSection}>
        <h3>Danh mục</h3>
        <div className={styles.categoryButtons}>
          {categories.map((category) => (
            <button
              key={category.value}
              className={`${styles.categoryButton} ${
                currentCategory === category.value ? styles.active : ""
              }`}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Đã xóa phần SortSection */}
    </div>
  );
};

export default SortFilter;
