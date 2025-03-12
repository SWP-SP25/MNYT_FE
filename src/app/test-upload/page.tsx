'use client';

import ImageUpload from '@/components/ImageUpload';

export default function TestUpload() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Test Upload Image</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ImageUpload />
            </div>
        </div>
    );
} 