// components/CategorySidebar.tsx
import styles from "@/app/forum/components/components.module.css";

interface CategorySidebarProps {
  categories: Array<{ id: string; name: string }>;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySidebar = ({
  categories,
  currentCategory,
  onCategoryChange,
}: CategorySidebarProps) => {
  // Biểu tượng cho từng danh mục
  const categoryIcons: { [key: string]: string } = {
    all: "📋",
    experience: "💡",
    sharing: "💬",
    health: "👶",
    fashion: "👚",
    nutrition: "🍎",
  };

  return (
    <div className={styles.sidebarContainer}>
      <h3 className={styles.sidebarTitle}>Danh mục</h3>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`${styles.categoryItem} ${
              currentCategory === category.id ? styles.activeCategory : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className={styles.categoryIcon}>
              {categoryIcons[category.id] || "📄"}
            </span>
            <span className={styles.categoryName}>{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
