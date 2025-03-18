"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import styles from "./createBlogPost.module.css";

// Định nghĩa kiểu dữ liệu BlogPost
interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
}

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "experience", name: "Kinh nghiệm" },
  { id: "sharing", name: "Tâm sự" },
  { id: "health", name: "Sức khỏe mẹ & bé" },
  { id: "fashion", name: "Thời trang" },
  { id: "nutrition", name: "Dinh dưỡng" },
];

const CreateBlogPost = ({
  onPostCreated,
  editPost,
}: {
  onPostCreated: () => void;
  editPost?: BlogPost;
}) => {
  const [title, setTitle] = useState(editPost ? editPost.title : "");
  const [content, setContent] = useState(editPost ? editPost.content : "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    editPost ? editPost.category : "all"
  );

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setSelectedCategory(editPost.category);
    }
  }, [editPost]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) {
        setErrorMessage("Tiêu đề và nội dung không được để trống.");
        return;
      }
      setLoading(true);
      setErrorMessage("");

      try {
        if (editPost) {
          await axios.put(
            `https://api-mnyt.purintech.id.vn/api/BlogPosts/${editPost.id}`,
            {
              title,
              content,
              category: selectedCategory,
            }
          );
        } else {
          await axios.post(
            "https://api-mnyt.purintech.id.vn/api/BlogPosts?authorId=1",
            {
              title,
              content,
              category: selectedCategory,
            }
          );
        }

        onPostCreated();
        if (!editPost) {
          setTitle("");
          setContent("");
          setSelectedCategory("all");
        }
      } catch (error) {
        console.error("Lỗi khi tạo hoặc chỉnh sửa bài viết:", error);
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [title, content, selectedCategory, onPostCreated, editPost]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.createPostForm}>
      <div className={styles.formHeader}>
        <h2>
          {editPost ? "Chỉnh Sửa Bài Viết" : "Chia Sẻ Câu Chuyện Của Bạn"}
        </h2>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <input
        type="text"
        placeholder="Tiêu đề bài viết của bạn"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Chia sẻ câu chuyện, kinh nghiệm hoặc lời khuyên của bạn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div className={styles.categoryLabel}>Chọn chủ đề:</div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading
          ? "Đang xử lý..."
          : editPost
          ? "Cập nhật Bài Viết"
          : "Đăng Bài Viết"}
      </button>
    </form>
  );
};

export default CreateBlogPost;
