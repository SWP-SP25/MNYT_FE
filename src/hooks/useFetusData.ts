import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { Pregnancy, PregnancyResponse } from '@/types/pregnancy';
import { Fetus, FetusResponse } from '@/types/fetus';
import { FetusRecord, FetusRecordResponse, ProcessedFetusData } from '@/types/fetusRecord';
import {
    calculateEFW,
    calculateEFWWithoutACFL,
    predictLengthFromFL,
    predictLengthFromCRL,
    predictHC
} from '@/utils/predictCalculations';

export const useFetusData = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePregnancy, setActivePregnancy] = useState<Pregnancy | null>(null);
    const [fetusList, setFetusList] = useState<Fetus[]>([]);
    const [fetusRecords, setFetusRecords] = useState<FetusRecord[]>([]);
    const [processedData, setProcessedData] = useState<{
        actualData: ProcessedFetusData[];
        estimatedData: ProcessedFetusData[];
    }>({ actualData: [], estimatedData: [] });
    const [currentPeriod, setCurrentPeriod] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                setLoading(false);
                setError('Người dùng chưa đăng nhập');
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching data for user ID:', user.id);

                // 1. Lấy thông tin pregnancy đang active
                const pregnancyResponse = await axios.get<PregnancyResponse>(
                    'https://api-mnyt.purintech.id.vn/api/Pregnancy',
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                console.log('Pregnancy API response:', pregnancyResponse);
                console.log('Pregnancy data:', pregnancyResponse.data);

                // Kiểm tra cấu trúc dữ liệu trả về
                if (!pregnancyResponse.data || !Array.isArray(pregnancyResponse.data.data)) {
                    console.error('Invalid pregnancy response structure:', pregnancyResponse.data);
                    setLoading(false);
                    setError('Cấu trúc dữ liệu pregnancy không hợp lệ');
                    return;
                }

                // Lọc pregnancy đang active của user hiện tại
                const activePregnancy = pregnancyResponse.data.data.find(
                    p => p.accountId === user.id && p.status === 'active'
                );

                console.log('Active pregnancy:', activePregnancy);

                if (!activePregnancy) {
                    setLoading(false);
                    setError('Không tìm thấy thai kỳ đang hoạt động');
                    return;
                }

                setActivePregnancy(activePregnancy);

                // 2. Lấy thông tin fetus của pregnancy đó
                const fetusResponse = await axios.get<FetusResponse>(
                    'https://api-mnyt.purintech.id.vn/api/Fetus',
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                console.log('Fetus API response:', fetusResponse);
                console.log('Fetus data:', fetusResponse.data);

                // Kiểm tra cấu trúc dữ liệu trả về
                if (!fetusResponse.data || !Array.isArray(fetusResponse.data.data)) {
                    console.error('Invalid fetus response structure:', fetusResponse.data);
                    setLoading(false);
                    setError('Cấu trúc dữ liệu fetus không hợp lệ');
                    return;
                }

                // Lọc fetus thuộc pregnancy đang active
                const relatedFetusList = fetusResponse.data.data.filter(
                    f => f.pregnancyId === activePregnancy.id
                );

                console.log('Related fetus list:', relatedFetusList);

                if (relatedFetusList.length === 0) {
                    setLoading(false);
                    setError('Không tìm thấy thông tin thai nhi');
                    return;
                }

                setFetusList(relatedFetusList);

                // 3. Lấy tất cả fetusRecord của các fetus
                const allFetusRecords: FetusRecord[] = [];

                for (const fetus of relatedFetusList) {
                    console.log(`Fetching records for fetus ID: ${fetus.id}`);
                    try {
                        const recordsResponse = await axios.get<FetusRecordResponse>(
                            `https://api-mnyt.purintech.id.vn/api/FetusRecord/fetus/${fetus.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            }
                        );

                        console.log(`Records API response for fetus ID ${fetus.id}:`, recordsResponse);
                        console.log(`Records for fetus ID ${fetus.id}:`, recordsResponse.data);

                        // Kiểm tra cấu trúc dữ liệu trả về
                        if (recordsResponse.data && Array.isArray(recordsResponse.data.data) && recordsResponse.data.data.length > 0) {
                            allFetusRecords.push(...recordsResponse.data.data);
                        }
                    } catch (recordError) {
                        console.error(`Error fetching records for fetus ID ${fetus.id}:`, recordError);
                    }
                }

                console.log('All fetus records:', allFetusRecords);

                setFetusRecords(allFetusRecords);

                // 4. Xác định tuần thai hiện tại (lấy từ record mới nhất)
                if (allFetusRecords.length > 0) {
                    // Sắp xếp theo ngày tạo mới nhất
                    const sortedRecords = [...allFetusRecords].sort(
                        (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
                    );

                    // Lấy tuần thai từ record mới nhất
                    const latestPeriod = sortedRecords[0].inputPeriod;
                    setCurrentPeriod(latestPeriod);
                    console.log('Current period from latest record:', latestPeriod);

                    // 5. Xử lý dữ liệu để hiển thị trên biểu đồ
                    processRecordsForChart(allFetusRecords, latestPeriod);
                } else {
                    setLoading(false);
                    setError('Không có dữ liệu đo lường thai nhi');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching fetus data:', err);
                setLoading(false);
                setError('Lỗi khi tải dữ liệu thai nhi');
            }
        };

        fetchData();
    }, [user?.id]);

    // Hàm xử lý dữ liệu cho biểu đồ
    const processRecordsForChart = (records: FetusRecord[], currentWeek: number) => {
        console.log('Processing records for chart. Current week:', currentWeek);
        console.log('Records to process:', records);

        // Dữ liệu thực tế từ các lần đo
        const actualData: ProcessedFetusData[] = [];

        // Nhóm records theo tuần thai để lấy giá trị trung bình nếu có nhiều record cùng tuần
        const recordsByWeek: Record<number, FetusRecord[]> = {};

        records.forEach(record => {
            const week = record.inputPeriod;
            if (!recordsByWeek[week]) {
                recordsByWeek[week] = [];
            }
            recordsByWeek[week].push(record);
        });

        console.log('Records grouped by week:', recordsByWeek);

        // Tính giá trị trung bình cho mỗi tuần
        Object.entries(recordsByWeek).forEach(([week, weekRecords]) => {
            const numWeek = parseInt(week);

            // Tính giá trị trung bình cho các chỉ số
            const avgLength = weekRecords.reduce((sum, r) => sum + r.length, 0) / weekRecords.length;
            const avgHead = weekRecords.reduce((sum, r) => sum + r.hc, 0) / weekRecords.length;
            const avgWeight = weekRecords.reduce((sum, r) => sum + r.weight, 0) / weekRecords.length;

            console.log(`Week ${numWeek} averages:`, { avgLength, avgHead, avgWeight });

            // Thêm dữ liệu chiều dài
            actualData.push({
                week: numWeek,
                length: avgLength,
                category: 'Chiều dài thực tế'
            });

            // Thêm dữ liệu chu vi đầu
            actualData.push({
                week: numWeek,
                head: avgHead,
                category: 'Chu vi vòng đầu thực tế'
            });

            // Thêm dữ liệu cân nặng
            actualData.push({
                week: numWeek,
                weight: avgWeight,
                category: 'Cân nặng thực tế'
            });
        });

        // Dữ liệu ước tính cho các tuần tiếp theo
        const estimatedData: ProcessedFetusData[] = [];

        // Lấy record mới nhất để tính toán dự đoán
        const latestRecord = records.sort(
            (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        )[0];

        console.log('Latest record for predictions:', latestRecord);

        // Tính toán dự đoán cho các tuần từ tuần hiện tại đến tuần 40
        for (let week = currentWeek + 1; week <= 40; week++) {
            // Dự đoán chiều dài
            let estimatedLength;
            if (week <= 14) {
                // Sử dụng CRL cho thai dưới 14 tuần
                estimatedLength = predictLengthFromCRL(latestRecord.length);
                console.log(`Week ${week} - CRL prediction:`, estimatedLength);
            } else {
                // Sử dụng FL cho thai trên 14 tuần (giả định FL = length/4 nếu không có)
                const estimatedFL = latestRecord.length / 4; // Ước tính FL từ chiều dài
                estimatedLength = predictLengthFromFL(estimatedFL, week);
                console.log(`Week ${week} - FL prediction:`, { estimatedFL, estimatedLength });
            }

            // Dự đoán chu vi đầu
            const estimatedHead = predictHC(latestRecord.bpd, week);
            console.log(`Week ${week} - HC prediction:`, estimatedHead);

            // Dự đoán cân nặng
            let estimatedWeight;
            if (latestRecord.hc && latestRecord.length && latestRecord.bpd) {
                // Nếu có đủ dữ liệu, sử dụng công thức đầy đủ
                // Giả định AC = HC * 0.9 nếu không có
                const estimatedAC = latestRecord.hc * 0.9;
                estimatedWeight = calculateEFW(latestRecord.bpd, latestRecord.hc, latestRecord.length / 4, estimatedAC);
                console.log(`Week ${week} - Full EFW prediction:`, { estimatedAC, estimatedWeight });
            } else {
                // Nếu không đủ dữ liệu, sử dụng công thức đơn giản hơn
                estimatedWeight = calculateEFWWithoutACFL(latestRecord.bpd, latestRecord.hc);
                console.log(`Week ${week} - Simple EFW prediction:`, estimatedWeight);
            }

            // Thêm dữ liệu chiều dài ước tính
            estimatedData.push({
                week,
                length: estimatedLength,
                category: 'Chiều dài ước tính'
            });

            // Thêm dữ liệu chu vi đầu ước tính
            estimatedData.push({
                week,
                head: estimatedHead,
                category: 'Chu vi vòng đầu ước tính'
            });

            // Thêm dữ liệu cân nặng ước tính
            estimatedData.push({
                week,
                weight: estimatedWeight,
                category: 'Cân nặng ước tính'
            });
        }

        console.log('Processed actual data:', actualData);
        console.log('Processed estimated data:', estimatedData);

        setProcessedData({
            actualData,
            estimatedData
        });
    };

    return {
        loading,
        error,
        activePregnancy,
        fetusList,
        fetusRecords,
        processedData,
        currentPeriod
    };
};