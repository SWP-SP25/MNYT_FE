"use client";
import styles from "./filter.module.css";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

const CategoryFilter = ({
  onCategoryChange,
  currentCategory,
}: CategoryFilterProps) => {
  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "experience", label: "Kinh nghiệm" },
    { value: "sharing", label: "Tâm sự" },
    { value: "health", label: "Sức khỏe mẹ & bé" },
    { value: "fashion", label: "Thời trang" },
    { value: "nutrition", label: "Dinh dưỡng" },
  ];

  return (
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
  );
};

export default CategoryFilter;
