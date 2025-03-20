export interface Reminder {
    id: string;
    title: string;
    date: string;
    time: string;
    type: string;
    description: string;
    start: string;
    status: 'skip' | 'done' | 'pending';
    tag: string;
    isDefault?: boolean;
    color?: string;
}

export interface ApiResponse {
    success: boolean;
    data: Reminder[];
    message?: string;
} 