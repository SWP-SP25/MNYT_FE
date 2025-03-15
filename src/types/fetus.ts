export interface Fetus {
    name: string;
    gender: string;
    pregnancyId: number;
    id: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export interface FetusResponse {
    data: Fetus[];
    success: boolean;
    message: string;
}