export interface ScheduleTemplate {
    id: number;
    period: number;
    type: string;
    title: string;
    description: string;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface UserSchedule {
    id: number;
    userId: number;
    title: string;
    description: string;
    date: string;
    // Các trường khác...
}

export interface Reminder {
    id: number;
    title: string;
    description: string;
    date: string;
    type: 'system' | 'user';
    period?: number;
}