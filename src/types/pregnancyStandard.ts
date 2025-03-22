export interface PreganacyStandard {
    pregnancyType: string;
    type:          string;
    period:        number;
    minimum:       number;
    maximum:       number;
    unit:          string;
    id:            number;
    createDate:    Date;
    updateDate:    Date;
    isDeleted:     boolean;
}
