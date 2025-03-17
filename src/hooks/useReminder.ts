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
    status?: 'pending' | 'done' | 'skip';
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
                console.log('Schedule templates count:', res.data.length);
                console.log('Schedule templates:', res.data);
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
                    console.log('Pregnancy data:', res.data[0]);
                    if (res.data) {
                        setPregnancyData(res.data[0]);
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
        }
    }, [userId]);

    // 3. Gọi API lấy thông tin thai nhi khi có pregnancyData
    useEffect(() => {
        if (pregnancyData) {
            console.log('Fetching fetus data for pregnancy:', pregnancyData.id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/Fetus/pregnancyId/${pregnancyData.id}`)
                .then(res => {
                    console.log('Fetus data count:', res.data.length);
                    if (res.data && res.data.length > 0) {
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
        }
    }, [pregnancyData]);

    // 4. Gọi API lấy thông tin hồ sơ thai nhi khi có fetusData
    useEffect(() => {
        console.log('fetusData abc:', fetusData[0]);

        if (fetusData && fetusData.length > 0) {
            console.log('Fetching fetus record data for fetus:', fetusData[0].id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/FetusId/${fetusData[0].id}`)
                .then(res => {
                    console.log('Fetus record data count:', res.data.length);
                    if (res.data && res.data.length > 0) {
                        // Log chi tiết về record đầu tiên để kiểm tra period
                        const firstRecord = res.data[0];
                        console.log('First record details:', {
                            id: firstRecord.id,
                            inputPeriod: firstRecord.inputPeriod,
                            period: firstRecord.period,
                            createDate: firstRecord.createDate
                        });

                        setFetusRecordData(res.data);
                        console.log('Fetus record data:', res.data);
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
        }
    }, [fetusData]);

    // 5. Tính toán reminders dựa trên dữ liệu đã lấy được
    useEffect(() => {
        // Kiểm tra dữ liệu đầu vào
        console.log('Data check for reminder calculation:', {
            hasPregnancyData: !!pregnancyData,
            hasFetusRecordData: fetusRecordData && fetusRecordData.length > 0,
            hasScheduleTemplates: scheduleTemplates && scheduleTemplates.length > 0
        });
        console.log('Data check for reminder calculation:', {
            hasPregnancyData: pregnancyData,
            hasFetusRecordData: fetusRecordData,
            hasScheduleTemplates: scheduleTemplates
        });

        if (
            pregnancyData &&
            fetusRecordData &&
            fetusRecordData.length > 0 &&
            scheduleTemplates &&
            scheduleTemplates.length > 0
        ) {
            try {
                console.log('Calculating reminders...');

                // Lấy createDate từ pregnancyData
                const pregnancyCreateDate = moment(pregnancyData.createDate);
                console.log('Pregnancy create date:', pregnancyCreateDate.format('YYYY-MM-DD'));

                // Lấy record đầu tiên (sắp xếp theo thời gian tạo)
                const sortedRecords = [...fetusRecordData].sort((a, b) =>
                    new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
                );

                const firstRecord = sortedRecords[0];

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
                    // Chỉ tạo reminder cho các tuần thai từ hiện tại đến tuần 40
                    if (template.period >= initialPeriod && template.period <= 40) {
                        // Tính số tuần cần thêm vào từ ngày tạo hồ sơ
                        const weeksToAdd = template.period - initialPeriod;

                        // Tính ngày dự kiến cho reminder này
                        const reminderDate = moment(pregnancyCreateDate).add(weeksToAdd, 'weeks');

                        calculatedReminders.push({
                            id: template.id,
                            title: template.title || `Lịch khám thai tuần ${template.period}`,
                            description: template.description || `Khám thai định kỳ tuần ${template.period}`,
                            date: reminderDate.format('YYYY-MM-DD'),
                            type: 'system',
                            period: template.period,
                            status: 'pending' // Trạng thái mặc định
                        });
                    }
                });

                console.log('Calculated reminders count:', calculatedReminders.length);
                if (calculatedReminders.length === 0) {
                    console.log('No reminders were calculated. Check template periods vs initialPeriod:', initialPeriod);
                    console.log('Template periods:', scheduleTemplates.map(t => t.period));
                } else {
                    console.log('First few calculated reminders:', calculatedReminders.slice(0, 3));
                }

                setReminders(calculatedReminders);
            } catch (err) {
                console.error('Error calculating reminders:', err);
                setError('Lỗi khi tính toán lịch khám');
            }
        }
    }, [pregnancyData, fetusRecordData, scheduleTemplates]);

    // Hàm để cập nhật trạng thái reminder
    const updateReminderStatus = async (reminderId: string, status: 'pending' | 'done' | 'skip') => {
        try {
            console.log(`Updating reminder ${reminderId} status to ${status}`);
            setLoading(true);

            // Gọi API để cập nhật trạng thái
            const response = await axios.put(`https://api-mnyt.purintech.id.vn/api/ScheduleTemplate`,
                {
                    id: reminderId,
                    status: status
                });

            console.log('Update status response:', response.data);

            // Cập nhật state local
            setReminders(prev =>
                prev.map(reminder =>
                    reminder.id.toString() === reminderId
                        ? { ...reminder, status }
                        : reminder
                )
            );

            setLoading(false);
            return true;
        } catch (err) {
            console.error('Error updating reminder status:', err);
            setError('Lỗi khi cập nhật trạng thái');
            setLoading(false);
            return false;
        }
    };

    // Hàm để làm mới dữ liệu
    const refreshReminders = () => {
        console.log('Refreshing all data...');
        setLoading(true);

        // Làm mới dữ liệu schedule templates
        axios.get('https://api-mnyt.purintech.id.vn/api/ScheduleTemplate')
            .then(res => {
                console.log('Refreshed schedule templates count:', res.data.length);
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

    // Trả về dữ liệu và các hàm cần thiết
    return {
        reminders,
        loading,
        error,
        refreshReminders,
        updateReminderStatus,
        pregnancyData,
        fetusData,
        fetusRecordData
    };
};