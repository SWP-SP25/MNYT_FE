export interface ShceduleTemplate {
    period:      number;
    type:        string;
    status:      null | string;
    title:       string;
    description: string;
    id:          number;
    createDate:  Date;
    updateDate:  Date;
    isDeleted:   boolean;
}