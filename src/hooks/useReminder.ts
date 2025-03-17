import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

// Props cho hook
interface UseRemindersProps {
    userId?: number;
}

// Interface cho reminder đã được tính toán
interface CalculatedReminder {
    id: number;
    title: string;
    description: string;
    date: string;
    type: 'system' | 'user';
    period: number;
}

export const useReminders = ({ userId }: UseRemindersProps) => {
    console.log('useReminders hook initialized with userId:', userId);

    // State để lưu trữ dữ liệu
    const [reminders, setReminders] = useState<CalculatedReminder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State cho dữ liệu từ các API
    const [pregnancyData, setPregnancyData] = useState<any>(null);
    const [fetusData, setFetusData] = useState<any[]>([]);
    const [fetusRecordData, setFetusRecordData] = useState<any[]>([]);
    const [scheduleTemplates, setScheduleTemplates] = useState<any[]>([]);

    // 1. Gọi API lấy schedule templates
    useEffect(() => {
        console.log('Fetching schedule templates...');

        axios.get('https://api-mnyt.purintech.id.vn/api/ScheduleTemplate')
            .then(res => {
                console.log('Schedule templates data:', res.data);
                console.log('Number of schedule templates:', res.data.length);
                setScheduleTemplates(res.data);
            })
            .catch(err => {
                console.log('Error fetching schedule templates:', err);
                setError('Lỗi khi lấy dữ liệu lịch khám');
            });
    }, []);

    // 2. Gọi API lấy thông tin thai kỳ nếu có userId
    useEffect(() => {
        if (userId) {
            console.log('Fetching pregnancy data for user:', userId);
            setLoading(true);

            axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userId}`)
                .then(res => {
                    console.log('Pregnancy data response:', res);
                    console.log('Pregnancy data:', res.data);
                    if (res.data) {
                        console.log('Pregnancy ID:', res.data.id);
                        console.log('Pregnancy createDate:', res.data.createDate);
                        setPregnancyData(res.data);
                    } else {
                        console.log('No pregnancy data found for user');
                        setError('Không tìm thấy dữ liệu thai kỳ');
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log('Error fetching pregnancy data:', err);
                    setError('Lỗi khi lấy dữ liệu thai kỳ');
                    setLoading(false);
                });
        } else {
            console.log('No userId provided, skipping pregnancy data fetch');
        }
    }, [userId]);

    // 3. Gọi API lấy thông tin thai nhi khi có pregnancyData
    useEffect(() => {
        if (pregnancyData && pregnancyData.id) {
            console.log('Fetching fetus data for pregnancy:', pregnancyData.id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/Fetus/pregnancyId/${pregnancyData.id}`)
                .then(res => {
                    console.log('Fetus data response:', res);
                    console.log('Fetus data:', res.data);
                    console.log('Number of fetuses:', res.data.length);

                    if (res.data && res.data.length > 0) {
                        console.log('First fetus ID:', res.data[0].id);
                        setFetusData(res.data);
                    } else {
                        console.log('No fetus data found for pregnancy');
                        setError('Không tìm thấy dữ liệu thai nhi');
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log('Error fetching fetus data:', err);
                    setError('Lỗi khi lấy dữ liệu thai nhi');
                    setLoading(false);
                });
        } else {
            console.log('No pregnancy data or pregnancy ID, skipping fetus data fetch');
        }
    }, [pregnancyData]);

    // 4. Gọi API lấy thông tin hồ sơ thai nhi khi có fetusData
    useEffect(() => {
        if (fetusData && fetusData.length > 0) {
            console.log('Fetching fetus record data for fetus:', fetusData[0].id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/FetusId/${fetusData[0].id}`)
                .then(res => {
                    console.log('Fetus record data response:', res);
                    console.log('Fetus record data:', res.data);
                    console.log('Number of fetus records:', res.data.length);

                    if (res.data && res.data.length > 0) {
                        console.log('First record inputPeriod:', res.data[0].inputPeriod);
                        console.log('First record period:', res.data[0].period);
                        setFetusRecordData(res.data);
                    } else {
                        console.log('No fetus record data found');
                        setError('Không tìm thấy dữ liệu hồ sơ thai nhi');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.log('Error fetching fetus record data:', err);
                    setError('Lỗi khi lấy dữ liệu hồ sơ thai nhi');
                    setLoading(false);
                });
        } else {
            console.log('No fetus data, skipping fetus record data fetch');
        }
    }, [fetusData]);

    // 5. Tính toán reminders dựa trên dữ liệu đã lấy được
    useEffect(() => {
        console.log('Checking data for reminder calculation:');
        console.log('- pregnancyData:', pregnancyData ? 'exists' : 'missing');
        console.log('- fetusRecordData:', fetusRecordData ? `${fetusRecordData.length} records` : 'missing');
        console.log('- scheduleTemplates:', scheduleTemplates ? `${scheduleTemplates.length} templates` : 'missing');

        if (
            pregnancyData &&
            fetusRecordData &&
            fetusRecordData.length > 0 &&
            scheduleTemplates &&
            scheduleTemplates.length > 0
        ) {
            try {
                console.log('All data available, calculating reminders...');

                // Lấy createDate từ pregnancyData
                const pregnancyCreateDate = moment(pregnancyData.createDate);
                console.log('Pregnancy create date:', pregnancyCreateDate.format('YYYY-MM-DD'));

                // Lấy record đầu tiên (sắp xếp theo thời gian tạo)
                const sortedRecords = [...fetusRecordData].sort((a, b) =>
                    new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
                );
                console.log('Sorted records by creation date:', sortedRecords.map(r => ({
                    id: r.id,
                    createDate: r.createDate,
                    inputPeriod: r.inputPeriod,
                    period: r.period
                })));

                const firstRecord = sortedRecords[0];
                console.log('First record:', firstRecord);

                // Lấy period từ record đầu tiên
                const initialPeriod = firstRecord.inputPeriod || firstRecord.period;
                console.log('Initial pregnancy period:', initialPeriod);

                if (!initialPeriod) {
                    console.error('Cannot determine initial pregnancy period - inputPeriod and period are both null/undefined');
                    setError('Không thể xác định tuần thai ban đầu');
                    return;
                }

                // Tạo reminders dựa trên schedule templates
                const calculatedReminders: CalculatedReminder[] = [];

                scheduleTemplates.forEach(template => {
                    console.log(`Processing template: period=${template.period}, title=${template.title}`);

                    // Chỉ tạo reminder cho các tuần thai từ hiện tại đến tuần 40
                    if (template.period >= initialPeriod && template.period <= 40) {
                        console.log(`Template period ${template.period} is between initial period ${initialPeriod} and 40, creating reminder`);

                        // Tính số tuần cần thêm vào từ ngày tạo hồ sơ
                        const weeksToAdd = template.period - initialPeriod;
                        console.log(`Weeks to add: ${weeksToAdd}`);

                        // Tính ngày dự kiến cho reminder này
                        const reminderDate = moment(pregnancyCreateDate).add(weeksToAdd, 'weeks');
                        console.log(`Reminder date: ${reminderDate.format('YYYY-MM-DD')}`);

                        calculatedReminders.push({
                            id: template.id,
                            title: template.title || `Lịch khám thai tuần ${template.period}`,
                            description: template.description || `Khám thai định kỳ tuần ${template.period}`,
                            date: reminderDate.format('YYYY-MM-DD'),
                            type: 'system',
                            period: template.period
                        });
                    } else {
                        console.log(`Template period ${template.period} is outside range ${initialPeriod}-40, skipping`);
                    }
                });

                console.log('Calculated reminders:', calculatedReminders);
                console.log('Number of calculated reminders:', calculatedReminders.length);
                setReminders(calculatedReminders);
            } catch (err) {
                console.error('Error calculating reminders:', err);
                setError('Lỗi khi tính toán lịch khám');
            }
        } else {
            console.log('Missing data for reminder calculation, waiting for all data to be available');
        }
    }, [pregnancyData, fetusRecordData, scheduleTemplates]);

    // Hàm để làm mới dữ liệu
    const refreshReminders = () => {
        console.log('Refreshing all data...');
        setLoading(true);

        // Làm mới dữ liệu schedule templates
        axios.get('https://api-mnyt.purintech.id.vn/api/ScheduleTemplate')
            .then(res => {
                console.log('Refreshed schedule templates:', res.data);
                setScheduleTemplates(res.data);

                // Làm mới dữ liệu thai kỳ nếu có userId
                if (userId) {
                    return axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userId}`);
                }
            })
            .then(res => {
                if (res) {
                    console.log('Refreshed pregnancy data:', res.data);
                    setPregnancyData(res.data);
                }
            })
            .catch(err => {
                console.log('Error refreshing data:', err);
                setError('Lỗi khi làm mới dữ liệu');
                setLoading(false);
            });
    };

    // Log state changes
    useEffect(() => {
        console.log('Reminders state updated:', reminders);
    }, [reminders]);

    useEffect(() => {
        console.log('Loading state updated:', loading);
    }, [loading]);

    useEffect(() => {
        console.log('Error state updated:', error);
    }, [error]);

    // Trả về dữ liệu và các hàm cần thiết
    return {
        reminders,
        loading,
        error,
        refreshReminders,
        pregnancyData,
        fetusData,
        fetusRecordData
    };
};