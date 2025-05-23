/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['res.cloudinary.com']
    },
    // ... other configs
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        //Bỏ qua lỗi TypeScript trong quá trình build
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig 