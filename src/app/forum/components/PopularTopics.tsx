// components/PopularTopics.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./components.module.css";

const PopularTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularTopics = async () => {
      try {
        const response = await axios.get(
          "https://api-mnyt.purintech.id.vn/api/BlogPosts/popular"
        );
        if (response.data) {
          setTopics(response.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải chủ đề phổ biến:", err);
        setError("Không thể tải chủ đề phổ biến");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTopics();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.popularTopicsContainer}>
      <h3 className={styles.widgetTitle}>Chủ đề phổ biến</h3>
      <div className={styles.topicList}>
        {Array.isArray(topics) &&
          topics.map((topic) => (
            <div key={topic.id} className={styles.topicTag}>
              {topic.title}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularTopics;
