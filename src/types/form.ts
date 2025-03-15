type BirthType = 'singletons' | 'twins' | '';

interface FormFetusData {
    lastMenstrualPeriod: Date;
    period: string;
    bpd: string;
    hc: string;
    length: string;
    efw: string;
}
interface BirthTypeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { birthType: BirthType } & FormData) => void;
}