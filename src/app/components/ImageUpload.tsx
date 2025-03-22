import { useState, useEffect } from 'react';
import { uploadImage } from '@/utils/uploadImage';

const ImageUpload = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [images, setImages] = useState<string[]>([]); // Danh sách hình ảnh đã tải lên

    // Hàm để lấy danh sách hình ảnh từ backend
    const fetchImages = async () => {
        try {
            const response = await fetch('https://api-mnyt.purintech.id.vn/api/Media');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const result = await response.json(); // Đổi tên biến để tránh nhầm lẫn
            console.log('Fetched images from backend:', result); // Log dữ liệu lấy từ backend

            // Kiểm tra xem result.data có phải là mảng không
            if (Array.isArray(result.data)) {
                setImages(result.data.map((item: { url: string }) => item.url)); // Lấy URL từ trường data
            } else {
                console.error('Expected an array in result.data but got:', result.data);
                setError('Unexpected data format. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('Failed to load images. Please try again.');
        }
    };

    useEffect(() => {
        fetchImages(); // Gọi hàm fetchImages khi component được mount
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            setError('');
            const file = event.target.files?.[0];
            if (!file) return;

            console.log('Uploading image:', file.name); // Log tên tệp hình ảnh đang tải lên
            const url = await uploadImage(file);
            console.log('Image uploaded successfully, URL:', url); // Log URL hình ảnh đã tải lên

            // Lấy lại danh sách hình ảnh từ backend
            await fetchImages(); // Lấy lại danh sách hình ảnh từ backend
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border p-2 rounded"
            />

            {loading && <p className="text-gray-600">Uploading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Uploaded Images:</h2>
                <div className="flex flex-col gap-2">
                    {images.length > 0 ? (
                        images.map((imgUrl, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <img src={imgUrl} alt={`Uploaded ${index}`} className="max-w-xs rounded-lg shadow-md" />
                            </div>
                        ))
                    ) : (
                        <p className="text-red-500">No images found. Please upload an image.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;