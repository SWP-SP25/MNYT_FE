export type BirthType = 'singletons' | 'twins' | '';

export interface FormFetusData {
    lastMenstrualPeriod: string;
    period: string;
    bpd: string;
    hc: string;
    length: string;
    efw: string;
    bpd2?: string;
    hc2?: string;
    length2?: string;
    efw2?: string;
    additionalInfo?: string;
}

export interface BirthTypeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { birthType: BirthType } & FormFetusData) => void;
}