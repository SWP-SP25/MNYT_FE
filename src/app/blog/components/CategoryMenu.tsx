import styles from '@/app/blog/styles/blog.module.css';
const categories = ["Kinh nghiệm", "Tâm sự", "Sức khỏe mẹ & bé", "Thời trang", "Dinh dưỡng"];

const CategoryMenu = () => {
    return (
        <div className={styles.categoryMenu}>
            {categories.map((category, index) => (
                <button key={index} className={styles.categoryButton}>{category}</button>
            ))}
        </div>
    );
}

export default CategoryMenu;
