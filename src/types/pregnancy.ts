// Định nghĩa các types liên quan đến pregnancy

export interface Pregnancy {
    accountId: number;
    type: string;
    status: string;
    endDate: string | null;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface Fetus {
    pregnancyId: number;
    name: string;
    gender: string;
    status: string;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface FetusInput {
    inputPeriod: number;
    weight: number;
    bpd: number;
    length: number;
    hc: number;
    date: string;
    fetusId: number;
}

export interface FetusRecord {
    fetusId: number;
    inputPeriod: number;
    weight: number;
    bpd: number;
    length: number;
    hc: number;
    date: string;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}