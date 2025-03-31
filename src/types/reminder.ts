import { Moment } from 'moment';
export interface Reminder {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    tag: string;
    color: string;
    status?: 'pending' | 'done' | 'skip';
}
export interface CalculatedReminder {
    id: number;
    title: string;
    description: string;
    date: string;
    time?: string;
    type: 'system' | 'user';
    period: number;
    status?: 'pending' | 'done' | 'skip';
    tag: 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination';
}
export interface UserSchedule {
    id: number;
    title: string;
    note: string; // Tương đương với description
    date: string;
    type: string;
    status: string;
    pregnancyId: number;
    isDeleted: boolean;
    tag: 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination';
}
export interface UseRemindersProps {
    userId?: number;
}
export interface FormReminderDataType {
    title: string;
    date: Moment | null;
    time: Moment | null;
    description: string;
    tag: string;
}