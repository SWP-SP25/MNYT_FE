import { useState } from 'react';
import { uploadImage } from '@/utils/uploadImage';

const ImageUpload = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            setError('');
            const file = event.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file);
            setImageUrl(url);
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

            {imageUrl && (
                <div className="mt-4">
                    <p className="mb-2">Uploaded Image:</p>
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-xs rounded-lg shadow-md"
                    />
                    <p className="mt-2 text-sm text-gray-500 break-all">{imageUrl}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 