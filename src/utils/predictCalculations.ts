export const calculateEFW = (bpd: number, hc: number, fl: number, ac: number): number => {
    // Công thức Hadlock 3 để ước tính cân nặng thai nhi (EFW) tính bằng gram
    return (
        10 ** (
            1.3596 +
            0.0064 * hc +
            0.0424 * ac +
            0.174 * fl +
            0.00061 * bpd * ac
        )
    );
};

export const calculateEFWWithoutACFL = (bpd: number, hc: number): number => {
    // Công thức ước tính cân nặng thai nhi (EFW) chỉ dựa trên BPD và HC
    return 10 ** (1.326 + 0.0107 * hc + 0.0438 * bpd);
};

export const predictLengthFromFL = (fl: number, period: number): number => {
    // Dự đoán chiều dài cơ thể thai nhi dựa trên chiều dài xương đùi (FL) và tuổi thai (Period)
    return 6.1 + 0.59 * fl + 0.2 * period;
};

export const predictLengthFromCRL = (crl: number): number => {
    // Dự đoán chiều dài cơ thể thai nhi dựa trên Crown-Rump Length (CRL)
    return 1.1 * crl + 2;
};

export const predictHC = (bpd: number, period: number): number => {
    // Công thức dự đoán chu vi đầu (HC) từ BPD và tuổi thai (Period)
    return 1.1 * bpd + 0.8 * period;
};