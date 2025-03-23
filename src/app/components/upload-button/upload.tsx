import { useState, useRef } from 'react';
import { uploadImage } from '@/utils/uploadImage';
import styles from './upload.module.css';

interface UploadButtonProps {
    onUploadSuccess?: (url: string) => void;
    className?: string;
}

const UploadButton = ({ onUploadSuccess, className = '' }: UploadButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // Chỉ tạo preview, chưa upload
        const preview = URL.createObjectURL(file);
        setPreviewImage(preview);
        setSelectedFile(file);
        setError('');
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            setError('');

            console.log('Uploading image:', selectedFile.name);
            const url = await uploadImage(selectedFile);
            console.log('Image uploaded successfully, URL:', url);

            if (onUploadSuccess) {
                onUploadSuccess(url);
            }

            setUploadedImage(url);
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
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
        setUploadedImage(null);
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

                    {!uploadedImage ? (
                        <div className={styles.previewActions}>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={loading}
                                className={styles.confirmButton}
                            >
                                {loading ? 'Đang tải...' : 'Xác nhận'}
                            </button>
                            <button
                                type="button"
                                onClick={resetUpload}
                                disabled={loading}
                                className={styles.cancelButton}
                            >
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <div className={styles.uploadSuccess}>
                            <div className={styles.successBadge}>Đã tải lên thành công</div>
                            <button
                                type="button"
                                onClick={resetUpload}
                                className={styles.newUploadButton}
                            >
                                Tải ảnh khác
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default UploadButton;