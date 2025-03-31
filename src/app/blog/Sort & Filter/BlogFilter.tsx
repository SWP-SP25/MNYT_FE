"use client";
import { useState } from "react";
import styles from "../styles/blog.module.css";
import { FaFilter } from "react-icons/fa";

interface BlogFilterProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

const BlogFilter = ({ onCategoryChange, currentCategory }: BlogFilterProps) => {
  const categories = [
    { id: "All", name: "Tất cả" },
    { id: "Experience", name: "Kinh nghiệm" },
    { id: "Sharing", name: "Tâm sự" },
    { id: "Health", name: "Sức khỏe mẹ & bé" },
    { id: "Fashion", name: "Thời trang" },
    { id: "Nutrition", name: "Dinh dưỡng" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className={styles.filterSortContainer}>
      {/* Categories Section */}
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              category.id === currentCategory ? styles.active : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilter;
