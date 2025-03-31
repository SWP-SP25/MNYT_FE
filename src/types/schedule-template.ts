export interface ScheduleTemplate {
    period: number;
    type: string;
    tag: string;
    status: null | string;
    title: string;
    description: string;
    id: number;
    createDate: Date;
    updateDate: Date;
    isDeleted: boolean;
}