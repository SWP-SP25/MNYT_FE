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
        <div className={styles.group}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={styles.searchIcon}
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>

          <input
            type="search"
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.input}
          />

          {searchInput && (
            <button
              type="button"
              className={styles.clearSearchButton}
              onClick={handleClearSearch}
            >
              Xóa
            </button>
          )}

          {isSearching && (
            <span className={styles.searchingIndicator}>Đang tìm...</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForumSearch;
