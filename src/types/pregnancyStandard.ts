export interface PreganacyStandard {
    pregnancyType: string;
    type:          Type;
    period:        number;
    minimum:       number;
    maximum:       number;
    unit:          Unit;
    id:            number;
    createDate:    Date;
    updateDate:    Date;
    isDeleted:     boolean;
}

export enum Type {
    HC = "HC",
    Length = "length",
    Weight = "weight",
}

export enum Unit {
    Mm = "mm",
    Grams = "grams",
}
