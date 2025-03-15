export interface Pregnancy {
    accountId: number;
    type: string;
    status: string;
    startDate: string;
    endDate: string | null;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface PregnancyResponse {
    data: Pregnancy[];
    success: boolean;
    message: string;
}