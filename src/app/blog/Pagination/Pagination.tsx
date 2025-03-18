import { FC } from "react";
import styles from "./pagination.module.css";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange = () => {},
}) => {
  // Tính toán range của các trang sẽ hiển thị
  const getPageNumbers = () => {
    const delta = 2; // Số trang hiển thị bên cạnh trang hiện tại
    const range = [];
    const rangeWithDots = [];

    // Luôn hiển thị trang 1
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Luôn hiển thị trang cuối
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Thêm dấu ... vào giữa các khoảng cách
    let prev = 0;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      <button
        className={`${styles.paginationButton} ${styles.prev}`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
      >
        <IoChevronBack size={16} />
      </button>

      <div className={styles.paginationNumbers}>
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span key={`dots-${index}`} className={styles.paginationDots}>
              {pageNumber}
            </span>
          ) : (
            <button
              key={`page-${pageNumber}`}
              className={`${styles.paginationButton} ${
                currentPage === pageNumber ? styles.active : ""
              }`}
              onClick={() => handlePageClick(Number(pageNumber))}
              aria-current={currentPage === pageNumber ? "page" : undefined}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      <button
        className={`${styles.paginationButton} ${styles.next}`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
      >
        <IoChevronForward size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
