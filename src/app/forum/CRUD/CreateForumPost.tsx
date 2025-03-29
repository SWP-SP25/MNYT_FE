"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./styles/createForumPost.module.css";
import Image from "next/image";
import { AuthUser, useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import UploadButton from "@/app/components/upload-button/upload";

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
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Ref phải được khai báo bên trong component
  const uploadImageRef = useRef<() => Promise<string>>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    editPost?.image || null
  );

  // Nếu người dùng chưa đăng nhập, không hiển thị form
  if (!currentUser) {
    return null;
  }

  const [title, setTitle] = useState(
    editPost && typeof editPost.title === "string" ? editPost.title : ""
  );
  const [content, setContent] = useState(
    editPost && typeof editPost.content === "string" ? editPost.content : ""
  );
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

  // Thêm useEffect để scroll đến đầu form khi component được render
  useEffect(() => {
    if (formContainerRef.current) {
      // Scroll đến đầu form
      formContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Focus vào input đầu tiên (title)
      const titleInput = formContainerRef.current.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if (titleInput) {
        setTimeout(() => {
          titleInput.focus();
        }, 500); // Đợi animation hoàn thành
      }
    }
  }, []);

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

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof content !== "string" ||
        !content.trim()
      ) {
        setErrorMessage("Tiêu đề và nội dung không được để trống.");
        return;
      }
      setLoading(true);
      setErrorMessage("");

      try {
        // Lấy authorId từ currentUser, mặc định là 1 nếu không có
        const authorId = currentUser ? currentUser.id : 1;

        // Xử lý tải ảnh lên nếu có file được chọn
        let finalImageUrl = imageUrl;
        if (selectedFile && !imageUrl) {
          console.log("Bắt đầu tải ảnh lên...");
          // @ts-ignore - Sử dụng phương thức uploadFile của UploadButton
          const uploadResult = await UploadButton.uploadFile();
          if (uploadResult) {
            finalImageUrl = uploadResult;
            setImageUrl(finalImageUrl);
            console.log("Ảnh đã được tải lên thành công:", finalImageUrl);
          } else {
            console.error("Không thể tải lên hình ảnh");
            setErrorMessage("Không thể tải lên hình ảnh, vui lòng thử lại.");
            setLoading(false);
            return;
          }
        }
        console.log("Img url === ", finalImageUrl);

        // Tạo object data theo đúng format API yêu cầu
        const postData = {
          title: title,
          description: content,
          category: selectedCategory,
          imageUrl: finalImageUrl, // Sử dụng URL từ uploadResult
          isAnonymous: isAnonymous,
          // Chỉ đặt authorName khi không ẩn danh
          authorName: isAnonymous
            ? null
            : currentUser
            ? currentUser.name
            : null,
          // Các trường khác cần thiết cho API

          publishedDay: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        };

        console.log("Dữ liệu sap gửi đi:", postData);
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
          setSelectedFile(null);
          setImageUrl(null);
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
      selectedFile,
      imageUrl,
      isAnonymous,
      currentUser,
      router,
    ]
  );

  return (
    <div className={styles.componentContainer} ref={formContainerRef}>
      <h2 className={styles.componentTitle}>
        {editPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.createPostForm}>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        {/* Cột trái - thông tin cơ bản */}
        <div className={styles.formLeft}>
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 5h16v2H4z" fill="#279357" />
                <path d="M4 9h16v2H4z" fill="#279357" />
                <path d="M4 13h16v2H4z" fill="#279357" />
                <path d="M4 17h10v2H4z" fill="#279357" />
              </svg>
              Thông tin bài viết
            </div>

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
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 8h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H9c-.55 0-1-.45-1-1s.45-1 1-1h3V7c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"
                  fill="#279357"
                />
              </svg>
              Phân loại
            </div>

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
          </div>
        </div>

        {/* Cột phải - hình ảnh và tùy chọn */}
        <div className={styles.formRight}>
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                  fill="#279357"
                />
              </svg>
              Hình ảnh
            </div>

            <div className={styles.imageUploadContainer}>
              {/* Sử dụng UploadButton */}
              <UploadButton
                onImageChange={setSelectedFile}
                onUrlChange={setImageUrl}
                autoUpload={false}
                className={styles.imageUploadArea}
              />

              {/* Hiển thị URL hình ảnh nếu có */}
              {imageUrl && (
                <div className={styles.imagePreviewInfo}>
                  <span>✓ Hình ảnh đã sẵn sàng để tải lên</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                  fill="#279357"
                />
              </svg>
              Tùy chọn riêng tư
            </div>

            <div className={styles.anonymousOption}>
              <label className={styles.container}>
                <input
                  type="checkbox"
                  id="anonymousPost"
                  checked={isAnonymous}
                  onChange={(e) => {
                    setIsAnonymous(e.target.checked);
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
                      - Tên của bạn sẽ hiển thị là "Người dùng ẩn danh"
                    </span>
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Phần nút bấm ở dưới, chiếm toàn bộ chiều rộng */}
        <div className={styles.formFull}>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.createPostButton}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitPostButton}
            >
              {loading
                ? "Đang xử lý..."
                : editPost
                ? "Cập nhật bài viết"
                : "Đăng bài viết"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
