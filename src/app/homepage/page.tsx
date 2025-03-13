'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PublicHomePage from "./public/public-homepage";
import AuthenticatedHomePage from "./authentication/auth-homepage";

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Đợi một chút để đảm bảo trạng thái đăng nhập đã được kiểm tra
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    // Nếu đã đăng nhập, hiển thị trang authenticated
    if (user) {
        return <AuthenticatedHomePage />;
    }

    // Nếu chưa đăng nhập, hiển thị trang public
    return <PublicHomePage />;
}

