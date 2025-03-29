import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Lấy token và user từ cookie
    const token = request.cookies.get('token')?.value;
    const user = request.cookies.get('user')?.value;
    let userRole = '';
    let userId = '';

    if (user) {
        try {
            const userData = JSON.parse(user);
            userRole = userData.role;
            userId = userData.id;
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }

    // If user is Admin, allow access to all pages
    if (userRole === 'Admin') {
        return NextResponse.next();
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

    // Check membership for protected routes (reminder, blog, dashboard)
    if (request.nextUrl.pathname.startsWith('/reminder') || 
        request.nextUrl.pathname.startsWith('/blog') || 
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/forum')) {
        
        if (!token || !userId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Fetch active membership
            const membershipResponse = await fetch(
                `https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!membershipResponse.ok) {
                throw new Error('Failed to fetch membership');
            }

            const membershipData = await membershipResponse.json();
            
            // If no active membership or membership is expired
            if (!membershipData.success || !membershipData.data || 
                new Date(membershipData.data.endDate) < new Date() ||
                membershipData.data.status !== 'Active') {
                
                // Redirect to membership error page with no membership message
                const response = NextResponse.redirect(new URL('/membership-error?type=no-membership', request.url));
                response.cookies.set('redirectUrl', request.nextUrl.pathname, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 5 // 5 phút
                });
                return response;
            }

            // Check membership plan type
            const membershipPlanId = membershipData.data.membershipPlanId;
            
            switch (membershipPlanId) {
                case 1: // Basic plan
                    // Allow access to dashboard only
                    if (request.nextUrl.pathname.startsWith('/dashboard') ||
                        request.nextUrl.pathname.startsWith('/blog')) {
                        return NextResponse.next();
                    }
                    break;
                    
                case 2: // Tiện ích plan
                    // Allow access to dashboard and reminder, but not blog
                    if (request.nextUrl.pathname.startsWith('/dashboard') || 
                        request.nextUrl.pathname.startsWith('/reminder') ||
                        request.nextUrl.pathname.startsWith('/blog')) {
                        return NextResponse.next();
                    }
                    break;
                    
                case 5: // Cao cấp plan
                    // Allow access to all protected routes
                    return NextResponse.next();
                    
                default:
                    // For any other plan type, treat as basic plan
                    if (request.nextUrl.pathname.startsWith('/dashboard') ||
                        request.nextUrl.pathname.startsWith('/blog')) {
                        return NextResponse.next();
                    }
                    break;
            }
            
            // If we reach here, the user doesn't have permission for the requested route
            const response = NextResponse.redirect(new URL('/membership-error?type=basic-plan', request.url));
            response.cookies.set('redirectUrl', request.nextUrl.pathname, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 5 // 5 phút
            });
            return response;
        } catch (error) {
            console.error('Error checking membership:', error);
            // Redirect to membership error page on error
            return NextResponse.redirect(new URL('/membership-error?type=no-membership', request.url));
        }
    }

    return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
    matcher: [
        '/admin/:path*',
        '/reminder/:path*',
        '/blog/:path*',
        '/dashboard/:path*',
        '/forum/:path*'
    ]
}; 