import { FetusStandard } from './fetusStandard';

export interface MeasurementConfig {
    standard: FetusStandard[] | undefined | null;
    currentValue: number;
    unit: string;
    measurementName: string;
}

// Có thể thêm các interface liên quan khác
export interface MeasurementStatus {
    color: string;
    status: string;
    detail: string;
}