export interface Pregnancy {
    id: number;
    period: number;
    lastMenstrualDate: string;
    // Các trường khác...
}

export interface Fetus {
    id: number;
    pregnancyId: number;
    // Các trường khác...
}

export interface FetusRecord {
    id: number;
    fetusId: number;
    period: number;
    createDate: string;
    // Các trường khác...
}