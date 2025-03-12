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

        return data.secure_url;
    } catch (error) {
        console.error('Detailed upload error:', error);
        throw error;
    }
}; 