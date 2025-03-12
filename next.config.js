/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['res.cloudinary.com']
    },
    // ... other configs
}

module.exports = nextConfig 