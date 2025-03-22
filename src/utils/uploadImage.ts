export const uploadImage = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error('Cloudinary cloud name is not configured');
        }

        console.log('Uploading to Cloudinary with:', {
            cloudName,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.substring(0, 5) + '...'
        });

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        const data = await response.json();
        console.log('Cloudinary response:', data);

        if (!response.ok) {
            console.error('Cloudinary API Error:', {
                status: response.status,
                statusText: response.statusText,
                data
            });
            throw new Error(data.error?.message || data.message || 'Error uploading image');
        }

        const imageUrl = data.secure_url;

        // Lưu URL vào database
        await saveImageUrlToDatabase(imageUrl);

        return imageUrl;
    } catch (error) {
        console.error('Detailed upload error:', error);
        throw error;
    }
};

// Hàm để lưu URL vào database
const saveImageUrlToDatabase = async (url: string) => {
    const payload = {
        type: "image",
        url: url
    };

    const response = await fetch('https://api-mnyt.purintech.id.vn/api/Media', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving image URL to database:', {
            status: response.status,
            statusText: response.statusText,
            errorData
        });
        throw new Error('Failed to save image URL to database');
    }

    console.log('Image URL saved to database successfully');
}; 