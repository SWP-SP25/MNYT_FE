import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Lấy token và user từ cookie
    const token = request.cookies.get('token')?.value;
    const user = request.cookies.get('user')?.value;
    let userRole = '';

    if (user) {
        try {
            const userData = JSON.parse(user);
            userRole = userData.role;
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }

    // Kiểm tra nếu đang truy cập trang admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Nếu không có token hoặc role không phải Admin, chuyển hướng về trang unauthorized
        if (!token || userRole !== 'Admin') {
            // Lưu URL hiện tại vào cookie để sau khi đăng nhập có thể quay lại
            const response = NextResponse.redirect(new URL('/unauthorized', request.url));
            response.cookies.set('redirectUrl', request.nextUrl.pathname, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 5 // 5 phút
            });
            return response;
        }
    }

    return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
    matcher: ['/admin/:path*']
}; 