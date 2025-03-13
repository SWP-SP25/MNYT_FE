export interface User {
    id: number;
    userName: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    status?: string;
    isExternal?: boolean;
    externalProvider?: string;
}