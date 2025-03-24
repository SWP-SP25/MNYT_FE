"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./styles/editForumPost.module.css";
import { FaTimes } from "react-icons/fa";

interface EditForumPostProps {
  postId: number;
  currentUser: any;
  onPostUpdated: () => void;
  onCancel: () => void;
}

const EditForumPost = ({
  postId,
  currentUser,
  onPostUpdated,
  onCancel,
}: EditForumPostProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [authorId, setAuthorId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Danh sách danh mục
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "experience", name: "Kinh nghiệm" },
    { id: "sharing", name: "Tâm sự" },
    { id: "health", name: "Sức khỏe mẹ & bé" },
    { id: "fashion", name: "Thời trang" },
    { id: "nutrition", name: "Dinh dưỡng" },
  ];

  // Fetch dữ liệu bài viết cần chỉnh sửa
  useEffect(() => {
    const fetchPostData = async () => {
      setFetchingPost(true);
      try {
        const response = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`
        );

        const postData = response.data.data || response.data;

        // Check if the current user is the author
        if (postData.authorId !== currentUser?.id) {
          alert("Bạn không có quyền chỉnh sửa bài viết này!");
          onCancel();
          return;
        }

        console.log("Bai viet can sua" + postData);
        // Populate form with post data
        setTitle(postData.title || "");
        setContent(postData.description || "");
        setSelectedCategory(postData.category || "all");
        setIsAnonymous(postData.isAnonymous || false);
        setAuthorId(postData.authorId);

        // Handle image if present
        if (postData.image) {
          setCurrentImage(postData.image);
          setImagePreview(postData.image);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error);
        setErrorMessage(
          "Không thể tải dữ liệu bài viết. Vui lòng thử lại sau."
        );
        setTimeout(onCancel, 3000); // Auto-close after 3 seconds if there's an error
      } finally {
        setFetchingPost(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, currentUser, onCancel]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setCurrentImage(null); // Clear current image when a new one is selected

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setCurrentImage(null);
  };

  // Hàm chuyển đổi ảnh sang base64
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        setErrorMessage("Vui lòng nhập tiêu đề bài viết");
        return;
      }

      if (!content.trim()) {
        setErrorMessage("Vui lòng nhập nội dung bài viết");
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        // Prepare post data
        let imageData = currentImage;

        if (image) {
          // Convert new image to base64 if present
          const imageBase64 = await convertImageToBase64(image);
          imageData = imageBase64;
        }

        const postData = {
          title,
          description: content,
          category: selectedCategory,
          authorId: currentUser?.id,
          image: imageData,
          isAnonymous,
          authorName: isAnonymous
            ? "Người dùng ẩn danh"
            : currentUser
            ? currentUser.name
            : null,
        };

        // Call API to update the post
        await axios.put(
          `https://api-mnyt.purintech.id.vn/api/Posts/${postId}?authorId=${currentUser?.id}`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Notify success and trigger post update
        alert("Bài viết đã được cập nhật thành công!");
        onPostUpdated(); // Trigger the callback to refresh post data
      } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
        setErrorMessage(
          "Đã có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      title,
      content,
      selectedCategory,
      currentUser,
      image,
      currentImage,
      isAnonymous,
      postId,
      onPostUpdated,
    ]
  );

  if (fetchingPost) {
    return (
      <div className={styles.componentContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.componentContainer}>
      <h2 className={styles.componentTitle}>Chỉnh sửa bài viết</h2>
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
              onChange={(e) => setIsAnonymous(e.target.checked)}
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
            {loading ? "Đang xử lý..." : "Cập nhật Bài Viết"}
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

export default EditForumPost;
