"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./styles/editForumPost.module.css";

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
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Image state
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "experience", name: "Kinh nghiệm" },
    { id: "sharing", name: "Tâm sự" },
    { id: "health", name: "Sức khỏe mẹ & bé" },
    { id: "fashion", name: "Thời trang" },
    { id: "nutrition", name: "Dinh dưỡng" },
  ];

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;
      
      setFetchingPost(true);
      setErrorMessage("");
      
      try {
        const response = await axios.get(
          `https://api-mnyt.purintech.id.vn/api/Posts/${postId}`
        );

        const postData = response.data.data || response.data;

        // Check if current user is the author
        if (postData.authorId !== currentUser?.id) {
          setErrorMessage("Bạn không có quyền chỉnh sửa bài viết này!");
          setTimeout(onCancel, 2000);
          return;
        }

        // Populate form with post data
        setTitle(postData.title || "");
        setContent(postData.description || "");
        setSelectedCategory(postData.category || "all");
        setIsAnonymous(postData.isAnonymous || false);

        // Handle image if present
        if (postData.image) {
          setCurrentImage(postData.image);
          setImagePreview(postData.image);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error);
        setErrorMessage("Không thể tải dữ liệu bài viết. Vui lòng thử lại sau.");
        setTimeout(onCancel, 3000);
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPostData();
  }, [postId, currentUser, onCancel]);

  // Image handling functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
        return;
      }
      
      setImage(selectedFile);
      setCurrentImage(null); // Clear current image when a new one is selected

      // Create preview
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
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Convert image to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Get base64 part after comma
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
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
      // Prepare image data
      let imageData = currentImage;

      if (image) {
        // Convert new image to base64 if present
        try {
          const imageBase64 = await convertImageToBase64(image);
          imageData = imageBase64;
        } catch (error) {
          console.error("Error converting image:", error);
          setErrorMessage("Lỗi xử lý hình ảnh. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      // Prepare post data
      const postData = {
        title,
        description: content,
        category: selectedCategory,
        authorId: currentUser?.id,
        image: imageData,
        isAnonymous,
        authorName: isAnonymous
          ? "Người dùng ẩn danh"
          : currentUser?.name || "Unknown User",
      };

      // Update the post
      await axios.put(
        `https://api-mnyt.purintech.id.vn/api/Posts/${postId}?authorId=${currentUser?.id}`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success message and trigger update callback
      alert("Bài viết đã được cập nhật thành công!");
      onPostUpdated();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Đã có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
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
      
      {errorMessage && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span> {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.createPostForm}>
        {/* Title input */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tiêu đề:</label>
          <input
            type="text"
            placeholder="Tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.searchInput}
            required
          />
        </div>

        {/* Content textarea */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nội dung:</label>
          <textarea
            placeholder="Nội dung bài viết"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.searchInput}
            rows={6}
            required
          />
        </div>

        {/* Category select */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Chủ đề:</label>
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

        {/* Image upload */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Hình ảnh:</label>
          <div className={styles.imageUploadContainer}>
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
        </div>

        {/* Anonymous option */}
        <div className={styles.formGroup}>
          <div className={styles.anonymousOption}>
            <label className={styles.container}>
              <input
                type="checkbox"
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
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            className={styles.createPostButton}
          >
            {loading ? (
              <>
                <span className={styles.spinnerSmall}></span>
                Đang xử lý...
              </>
            ) : (
              "Cập nhật bài viết"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForumPost;
