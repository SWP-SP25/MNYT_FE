// components/ForumSearch.tsx
import { useState, useEffect } from "react";
import styles from "./components.module.css";

interface ForumSearchProps {
  onSearch: (query: string) => void;
}

const ForumSearch = ({ onSearch }: ForumSearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsSearching(true);
      // Gửi trực tiếp searchInput, không encode URL
      onSearch(searchInput.trim());
    }
  };

  // Reset trạng thái tìm kiếm sau khi tìm kiếm hoàn tất
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearching) {
      timer = setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isSearching]);

  // Thêm chức năng xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchInput("");
    onSearch(""); // Truyền chuỗi rỗng để reset về tất cả bài viết
  };

  // Thêm debounce để tránh gọi API quá nhiều khi gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() === "") {
        onSearch("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  return (
    <div className={styles.componentContainer}>
      <form onSubmit={handleSubmit} className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={isSearching}
        >
          <span>🔍</span> {isSearching ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        {searchInput && (
          <button
            type="button"
            className={styles.clearSearchButton}
            onClick={handleClearSearch}
          >
            Xóa
          </button>
        )}
      </form>
    </div>
  );
};

export default ForumSearch;
