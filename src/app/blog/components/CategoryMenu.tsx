"use client";
import styles from "../styles/blog.module.css";
import { Category } from "@/types/blog";

interface CategoryMenuProps {
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
}

const CategoryMenu = ({ selectedCategory, onCategorySelect }: CategoryMenuProps) => {
  const categories = Object.values(Category);

  return (
    <div className={styles.filterSortContainer}>
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              category === selectedCategory ? styles.active : ""
            }`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
