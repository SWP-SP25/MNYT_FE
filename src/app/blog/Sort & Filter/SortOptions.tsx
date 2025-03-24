"use client";
import { useState } from "react";
import styles from "./sortOptions.module.css";

interface SortOptionsProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

const SortOptions = ({
  onCategoryChange,
  currentCategory,
}: SortOptionsProps) => {
  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "experience", label: "Kinh nghiệm" },
    { value: "sharing", label: "Tâm sự" },
    { value: "health", label: "Sức khỏe mẹ & bé" },
    { value: "fashion", label: "Thời trang" },
    { value: "nutrition", label: "Dinh dưỡng" },
  ];

  return (
    <div className={styles.sortOptionsContainer}>
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`${styles.categoryButton} ${
              currentCategory === category.value ? styles.active : ""
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Đã xóa phần sắp xếp theo newest, oldest, most views, most likes */}
    </div>
  );
};

export default SortOptions;
