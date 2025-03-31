export interface UserInfo {
    id: number;
    userName: string;
    fullName: string;
    role: string;
}
export const getUserInfo = (user: any): UserInfo | null => {
    if (!user) return null;

    if (user.user && (user.user.id || user.user.fullName)) {
        return {
            id: user.user.id || 0,
            fullName: user.user.fullName || '',
            userName: user.user.userName || '',
            role: user.user.role || ''
        };
    }

    // Kiểm tra trực tiếp các thuộc tính
    if ((user as any).id || (user as any).fullName) {
        return {
            id: (user as any).id || 0,
            fullName: (user as any).fullName || '',
            userName: (user as any).userName || '',
            role: (user as any).role || ''
        };
    }

    return null;
}
