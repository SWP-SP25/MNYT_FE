import { useState, useRef } from 'react';
import { uploadImage } from '@/utils/uploadImage';
import styles from './upload.module.css';

interface UploadButtonProps {
    onImageChange?: (file: File | null) => void;
    onUrlChange?: (url: string | null) => void;
    className?: string;
    autoUpload?: boolean;
}

const UploadButton = ({
    onImageChange,
    onUrlChange,
    className = '',
    autoUpload = false
}: UploadButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hàm để xử lý upload ảnh
    const handleUpload = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        try {
            setLoading(true);
            setError('');

            console.log('Đang tải lên hình ảnh:', selectedFile.name);
            const url = await uploadImage(selectedFile);
            console.log('Hình ảnh đã được tải lên thành công, URL:', url);

            // Thông báo URL hình ảnh cho component cha
            if (onUrlChange) {
                onUrlChange(url);
            }

            return url;
        } catch (error) {
            console.error('Lỗi khi tải lên hình ảnh:', error);
            setError('Không thể tải lên hình ảnh. Vui lòng thử lại.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Gán hàm upload cho component cha (nếu cần)
    const uploadFile = async (): Promise<string | null> => {
        return handleUpload();
    };

    // Expose upload method
    if (typeof window !== 'undefined') {
        // @ts-ignore
        UploadButton.uploadFile = uploadFile;
    }

    const handleFileSelect = async (file: File) => {
        // Tạo bản xem trước
        const preview = URL.createObjectURL(file);
        setPreviewImage(preview);
        setSelectedFile(file);
        setError('');

        // Thông báo file đã chọn cho component cha
        if (onImageChange) {
            onImageChange(file);
        }

        // Nếu autoUpload = true, tự động upload
        if (autoUpload) {
            await handleUpload();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleFileSelect(files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const resetUpload = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setSelectedFile(null);

        // Thông báo reset cho component cha
        if (onImageChange) {
            onImageChange(null);
        }
        if (onUrlChange) {
            onUrlChange(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {!previewImage ? (
                <div
                    className={`${styles.uploadContainer} ${isDragging ? styles.dragging : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleButtonClick}
                >
                    <div className={styles.fileInputWrapper}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className={styles.hiddenFileInput}
                        />
                    </div>
                    <div className={styles.uploadIcon}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 16V8M12 8L9 11M12 8L15 11"
                                stroke="#59B1C3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                stroke="#59B1C3"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <p className={styles.uploadText}>Tải lên hình ảnh</p>
                    <p className={styles.uploadSubtext}>hoặc kéo thả file vào đây</p>
                </div>
            ) : (
                <div className={styles.previewContainer}>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className={styles.previewImage}
                    />

                    {/* Nút xóa trực tiếp trên hình ảnh */}
                    <button
                        type="button"
                        onClick={resetUpload}
                        className={styles.removeButton}
                        title="Xóa hình ảnh"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {loading && <p className="text-blue-500">Đang xử lý...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

// Thêm phương thức static để component cha có thể truy cập
// @ts-ignore
UploadButton.upload = null;

export default UploadButton;