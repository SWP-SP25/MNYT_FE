"use client";
import styles from "../styles/blog.module.css"; // Sửa lại đường dẫn import

const CategoryMenu = () => {
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "experience", name: "Kinh nghiệm" },
    { id: "sharing", name: "Tâm sự" },
    { id: "health", name: "Sức khỏe mẹ & bé" },
    { id: "fashion", name: "Thời trang" },
    { id: "nutrition", name: "Dinh dưỡng" },
    { id: "pregnancy", name: "Mang thai" },
  ];

  return (
    <div className={styles.filterSortContainer}>
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              category.id === "all" ? styles.active : ""
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
