export interface FetusRecord {
    period: number | null;
    inputPeriod: number;
    weight: number;
    bpd: number;
    length: number;
    hc: number;
    date: string;
    fetusId: number;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface FetusRecordResponse {
    data: FetusRecord[];
    success: boolean;
    message: string;
}

export interface ProcessedFetusData {
    week: number;
    length?: number;
    head?: number;
    weight?: number;
    category: string;
}