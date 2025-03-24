const BlogPostCard = ({ post, onRefresh }) => {
  // ... existing code ...

  return (
    <div className={styles.postCard}>
      {/* ... other post content ... */}

      <div className={styles.postFooter}>
        {/* Giữ lại các nút tương tác khác */}
        <div className={styles.commentCount}>
          <span className={styles.icon}>💬</span>
          {post.comments?.length || 0} bình luận
        </div>
        <div className={styles.likeCount}>
          <span className={styles.icon}>❤️</span>
          {post.likes || 0} lượt thích
        </div>

        {/* XÓA BỎ điều kiện kiểm tra quyền xóa và nút Xóa */}
        {/* Ví dụ: 
        {isAdmin && (
          <button onClick={() => handleDelete(post.id)} className={styles.deleteButton}>
            Xóa
          </button>
        )} 
        */}
      </div>
    </div>
  );
};

export default BlogPostCard;
