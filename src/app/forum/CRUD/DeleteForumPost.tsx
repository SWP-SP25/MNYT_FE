"use client";
import React from "react";
import styles from "./styles/deleteForumPost.module.css";
import axios from "axios";

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle: string;
  postId: string;
  currentUserId: string;
  onDelete: () => void;
}

const DeletePostModal = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  postId,
  currentUserId,
  onDelete,
}: DeletePostModalProps) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://api-mnyt.purintech.id.vn/api/Posts/${postId}?accountId=${currentUserId}`
      );

      if (onDelete) {
        onDelete();
      } else if (onConfirm) {
        onConfirm();
      }

      onClose();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      alert("Không thể xóa bài viết. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Xác nhận xóa bài viết</h3>
        <p>
          Bạn có chắc chắn muốn xóa bài viết "
          <span className={styles.postTitle}>{postTitle}</span>"?
        </p>
        <p className={styles.warningText}>
          Lưu ý: Hành động này không thể hoàn tác và tất cả bình luận cũng sẽ bị
          xóa.
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Hủy
          </button>
          <button onClick={onConfirm} className={styles.deleteButton}>
            Xóa bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
