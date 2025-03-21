"use client";
import styles from "@/app/forum/forum.module.css"; // Import CSS
import { useEffect, useState } from "react";
import BlogList from "@/app/blog/components/BlogList"; // Import BlogList

const ForumPage = () => {
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <div className={styles.forumContainer}>
        <h1>Diễn Đàn</h1>
        <BlogList
          category={currentCategory}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ForumPage;
