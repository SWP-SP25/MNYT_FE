export interface FetusStandard {
    pregnancyType: PregnancyType;
    type: Type;
    period: number;
    minimum: number;
    maximum: number;
    unit: Unit;
    id: number;
    createDate: Date;
    updateDate: Date;
    isDeleted: boolean;
}

export enum PregnancyType {
    Singleton = "singleton",
}

export enum Type {
    FetalLength = "fetal length",
}

export enum Unit {
    Mm = "mm",
    Cm = "cm"
}
