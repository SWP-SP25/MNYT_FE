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
    { id: "all", name: "Tất cả" },
    { id: "experience", name: "Kinh nghiệm" },
    { id: "sharing", name: "Tâm sự" },
    { id: "health", name: "Sức khỏe mẹ & bé" },
    { id: "fashion", name: "Thời trang" },
    { id: "nutrition", name: "Dinh dưỡng" },
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
