"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import styles from "./createBlogPost.module.css";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
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
      setPreviewImage(editPost.image); // Nếu có ảnh, hiển thị ảnh
    }
  }, [editPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Vui lòng chọn file ảnh hợp lệ.");
        return;
      }
      setErrorMessage("");
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
        let imageUrl = "";
        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);
          const uploadResponse = await axios.post(
            "https://api-mnyt.purintech.id.vn/api/Images",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          imageUrl = uploadResponse.data.url;
        }

        if (editPost) {
          // Chỉnh sửa bài viết
          await axios.put(
            `https://api-mnyt.purintech.id.vn/api/BlogPosts/${editPost.id}`,
            {
              title,
              content,
              image: imageUrl,
              category: selectedCategory,
            }
          );
        } else {
          // Tạo bài viết mới
          await axios.post(
            "https://api-mnyt.purintech.id.vn/api/BlogPosts?authorId=1",
            {
              title,
              content,
              image: imageUrl,
              category: selectedCategory,
            }
          );
        }

        onPostCreated();
        setTitle("");
        setContent("");
        setImageFile(null);
        setPreviewImage("");
        setSelectedCategory("all");
      } catch (error) {
        console.error("Lỗi khi tạo hoặc chỉnh sửa bài viết:", error);
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [title, content, imageFile, selectedCategory, onPostCreated, editPost]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.createPostForm}>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Nội dung"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
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
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* {previewImage && (
        <img
          src={previewImage}
          alt="Xem trước ảnh"
          className={styles.previewImage}
        />
      )} */}
      <button type="submit" disabled={loading}>
        {loading
          ? "Đang xử lý..."
          : editPost
          ? "Cập nhật Bài Viết"
          : "Tạo Bài Viết"}
      </button>
    </form>
  );
};

export default CreateBlogPost;
