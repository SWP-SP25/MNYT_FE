"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./createForumPost.module.css";
import Image from "next/image";
import { AuthUser, useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu BlogPost
interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  isAnonymous?: boolean;
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
  onCancel,
  currentUser,
}: {
  onPostCreated: () => void;
  editPost?: BlogPost;
  onCancel: () => void;
  currentUser?: AuthUser | null;
}) => {
  const router = useRouter();

  // Kiểm tra authentication ngay khi component được render
  useEffect(() => {
    if (!currentUser) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      router.push("/login");
    }
  }, [currentUser, router]);

  // Nếu người dùng chưa đăng nhập, không hiển thị form
  if (!currentUser) {
    return null; // Trả về null để không hiển thị gì trong quá trình chuyển hướng
  }

  const [title, setTitle] = useState(editPost ? editPost.title : "");
  const [content, setContent] = useState(editPost ? editPost.content : "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    editPost ? editPost.category : "all"
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editPost?.image || null
  );
  const [isAnonymous, setIsAnonymous] = useState(
    editPost?.isAnonymous || false
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setSelectedCategory(editPost.category);
      setImagePreview(editPost.image);
      setIsAnonymous(editPost.isAnonymous || false);
    }
  }, [editPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setImage(file);

      // Tạo URL preview cho hình ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    // Kích hoạt click vào input file ẩn
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Kiểm tra lại authentication khi submit form
      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (!title.trim() || !content.trim()) {
        setErrorMessage("Tiêu đề và nội dung không được để trống.");
        return;
      }
      setLoading(true);
      setErrorMessage("");

      try {
        // Lấy authorId từ currentUser, mặc định là 1 nếu không có
        const authorId = currentUser ? currentUser.id : 1;

        // Tạo object data theo đúng format API yêu cầu
        const postData = {
          title: title,
          content: content,
          category: selectedCategory,
          image: image ? await convertImageToBase64(image) : null,
          isAnonymous: isAnonymous, // Đảm bảo trường này được gửi đến API
          // Chỉ đặt authorName khi không ẩn danh
          authorName: isAnonymous
            ? null
            : currentUser
            ? currentUser.name
            : null,
          // Các trường khác cần thiết cho API
          description: title.substring(0, 100), // Short description from title
          publishedDay: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        };

        console.log("Dữ liệu gửi đi:", postData);
        console.log("isAnonymous:", isAnonymous);

        if (editPost) {
          await axios.put(
            `https://api-mnyt.purintech.id.vn/api/Posts/${editPost.id}?accountId=${authorId}`,
            postData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          const response = await axios.post(
            `https://api-mnyt.purintech.id.vn/api/Posts/forum?authorId=${authorId}`,
            postData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("API response:", response.data);
        }

        onPostCreated();
        if (!editPost) {
          setTitle("");
          setContent("");
          setSelectedCategory("all");
          setImage(null);
          setImagePreview(null);
          setIsAnonymous(false);
        }
      } catch (error) {
        console.error("Lỗi khi tạo hoặc chỉnh sửa bài viết:", error);
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [
      title,
      content,
      selectedCategory,
      onPostCreated,
      editPost,
      image,
      isAnonymous,
      currentUser,
      router,
    ]
  );

  // Thêm hàm chuyển đổi ảnh sang base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Lấy phần base64 sau dấu phẩy
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={styles.componentContainer}>
      <h2 className={styles.componentTitle}>
        {editPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.createPostForm}>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <input
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.searchInput}
        />

        <textarea
          placeholder="Nội dung bài viết"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.categoryLabel}>Chọn chủ đề:</div>
        <div className={styles.selectContainer}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className={styles.selectArrow}>▼</div>
        </div>

        <div className={styles.imageUploadContainer}>
          <div className={styles.imageLabel}>Hình ảnh:</div>
          {imagePreview ? (
            <div className={styles.imagePreviewContainer}>
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
              />
              <div className={styles.imageActions}>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  <span className={styles.removeIcon}>×</span> Xóa ảnh
                </button>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className={styles.changeImageButton}
                >
                  Thay đổi ảnh
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.imageUploadArea} onClick={handleUploadClick}>
              <div className={styles.uploadContent}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  className={styles.uploadIcon}
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M4 19h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7zm9-10v7h-2V9H6l6-6 6 6h-5z"
                    fill="currentColor"
                  />
                </svg>
                <p>Tải lên hình ảnh</p>
                <span className={styles.uploadHint}>
                  hoặc kéo thả file vào đây
                </span>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className={styles.hiddenInput}
          />
        </div>

        <div className={styles.anonymousOption}>
          <label className={styles.container}>
            <input
              type="checkbox"
              id="anonymousPost"
              checked={isAnonymous}
              onChange={(e) => {
                setIsAnonymous(e.target.checked);
                console.log("Anonymous changed to:", e.target.checked);
              }}
              className={styles.anonymousCheckbox}
            />
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                className={styles.path}
              ></path>
            </svg>
            <span className={styles.anonymousLabel}>
              Đăng bài viết ẩn danh
              {isAnonymous && (
                <span className={styles.anonymousInfo}>
                  {" "}
                  - Tên của bạn sẽ hiển thị là "Người dùng ẩn danh"
                </span>
              )}
            </span>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={styles.createPostButton}
          >
            {loading
              ? "Đang xử lý..."
              : editPost
              ? "Cập nhật Bài Viết"
              : "Đăng Bài Viết"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.createPostButton}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
