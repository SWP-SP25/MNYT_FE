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
    type: string; // Thay đổi để sử dụng giá trị từ API
    period: number;
    status?: 'pending' | 'done' | 'skip';
}

// Interface cho reminder người dùng tự tạo
interface UserSchedule {
    id: number;
    title: string;
    note: string; // Tương đương với description
    date: string;
    type: string; // Sử dụng giá trị từ API
    status: string;
    pregnancyId: number;
    createDate: string;
    updateDate: string;
    isDeleted: boolean;
}

export const useReminders = ({ userId }: UseRemindersProps) => {
    console.log('useReminders hook initialized with userId:', userId);

    // State để lưu trữ dữ liệu
    const [systemReminders, setSystemReminders] = useState<CalculatedReminder[]>([]);
    const [userReminders, setUserReminders] = useState<CalculatedReminder[]>([]);
    const [allReminders, setAllReminders] = useState<CalculatedReminder[]>([]);
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
        if (fetusData && fetusData.length > 0) {
            console.log('Fetching fetus record data for fetus:', fetusData[0].id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/FetusId/${fetusData[0].id}`)
                .then(res => {
                    console.log('Fetus record data count:', res.data.length);
                    if (res.data && res.data.length > 0) {
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

                // Tạo reminders dựa trên schedule templates
                const calculatedReminders: CalculatedReminder[] = [];

                scheduleTemplates.forEach(template => {
                    // Chỉ tạo reminder cho các tuần thai từ hiện tại đến tuần 40
                    if (template.period >= 0 && template.period <= 40) { // Bỏ điều kiện ban đầu
                        // Tính số tuần cần thêm vào từ ngày tạo hồ sơ
                        const weeksToAdd = template.period;

                        // Tính ngày dự kiến cho reminder này
                        const reminderDate = moment(pregnancyCreateDate).add(weeksToAdd, 'weeks');

                        calculatedReminders.push({
                            id: template.id,
                            title: template.title || `Lịch khám thai tuần ${template.period}`,
                            description: template.description || `Khám thai định kỳ tuần ${template.period}`,
                            date: reminderDate.format('YYYY-MM-DD'),
                            type: template.type, // Sử dụng type từ API
                            period: template.period,
                            status: template.status
                        });
                    }
                });

                // Xử lý nhắc nhở của người dùng
                userReminders.forEach(userReminder => {
                    calculatedReminders.push({
                        id: userReminder.id,
                        title: userReminder.title,
                        description: userReminder.description,
                        date: userReminder.date,
                        type: userReminder.type, // Sử dụng type từ API
                        period: 0, // Thiết lập period mặc định là 0 cho lịch người dùng tự tạo
                        status: userReminder.status
                    });
                });

                console.log('Calculated reminders count:', calculatedReminders.length);
                setSystemReminders(calculatedReminders);
            } catch (err) {
                console.error('Error calculating reminders:', err);
                setError('Lỗi khi tính toán lịch khám');
            }
        }
    }, [pregnancyData, fetusRecordData, scheduleTemplates, userReminders]);

    // 6. Lấy reminder do người dùng tự tạo
    useEffect(() => {
        if (pregnancyData && pregnancyData.id) {
            console.log('Fetching user schedules for pregnancy:', pregnancyData.id);

            axios.get(`https://api-mnyt.purintech.id.vn/api/ScheduleUser/pregnancyId/${pregnancyData.id}`)
                .then(res => {
                    console.log('User schedules response:', res.data);

                    if (res.data && Array.isArray(res.data)) {
                        console.log('User schedules count:', res.data.length);

                        // Chuyển đổi từ UserSchedule sang CalculatedReminder
                        const userSchedules: CalculatedReminder[] = res.data
                            .filter((schedule: UserSchedule) => !schedule.isDeleted) // Lọc bỏ các lịch đã xóa
                            .map((schedule: UserSchedule) => ({
                                id: schedule.id,
                                title: schedule.title || 'Lịch hẹn',
                                description: schedule.note || 'Chi tiết lịch hẹn',
                                date: schedule.date, // Sử dụng trực tiếp ngày từ API
                                type: schedule.type, // Sử dụng type từ API
                                period: 0, // Thiết lập period mặc định là 0 cho lịch người dùng tự tạo
                                status: schedule.status as 'pending' | 'done' | 'skip' || 'pending'
                            }));

                        console.log('Converted user schedules:', userSchedules);
                        setUserReminders(userSchedules);
                    } else {
                        console.log('No user schedules found or invalid data format');
                        setUserReminders([]);
                    }
                })
                .catch(err => {
                    console.error('Error fetching user schedules:', err);
                    setUserReminders([]);
                });
        }
    }, [pregnancyData]);

    // 7. Kết hợp reminders từ template và reminders người dùng tự tạo
    useEffect(() => {
        const combined = [...systemReminders, ...userReminders];
        console.log('Combined reminders (system + user):', combined.length);
        setAllReminders(combined);
    }, [systemReminders, userReminders]);

    // Hàm để cập nhật trạng thái reminder
    const updateReminderStatus = async (reminderId: string, status: 'pending' | 'done' | 'skip') => {
        try {
            console.log(`Updating reminder ${reminderId} status to ${status}`);
            setLoading(true);

            // Tìm reminder trong cả hai danh sách
            const systemReminder = systemReminders.find(r => r.id.toString() === reminderId);
            const userReminder = userReminders.find(r => r.id.toString() === reminderId);

            if (!systemReminder && !userReminder) {
                console.error('Reminder not found:', reminderId);
                setError('Không tìm thấy reminder');
                setLoading(false);
                return false;
            }

            // Xác định loại reminder và endpoint tương ứng
            let endpoint = '';
            let payload = {};

            if (userReminder) {
                // Nếu là reminder người dùng tự tạo
                console.log('Updating user reminder:', userReminder);

                endpoint = `https://api-mnyt.purintech.id.vn/api/ScheduleUser/${userReminder.id}`;

                // Giữ nguyên tất cả dữ liệu hiện tại, chỉ cập nhật status
                payload = {
                    id: userReminder.id,
                    title: userReminder.title,
                    note: userReminder.description, // 'note' thay vì 'description' cho user reminder
                    date: userReminder.date,
                    type: userReminder.type, // Giữ nguyên type
                    status: status,
                    pregnancyId: pregnancyData.id,
                };
            }

            console.log('Update status payload:', payload);

            // Gọi API để cập nhật trạng thái
            const response = await axios.put(endpoint, payload);
            console.log('Update status response:', response.data);

            // Cập nhật state local tùy theo loại reminder
            if (userReminder) {
                setUserReminders(prev =>
                    prev.map(reminder =>
                        reminder.id.toString() === reminderId
                            ? { ...reminder, status }
                            : reminder
                    )
                );
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error('Error updating reminder status:', err);
            setError('Lỗi khi cập nhật trạng thái');
            setLoading(false);
            return false;
        }
    };

    // Hàm để thêm reminder người dùng tự tạo
    const addUserReminder = async (title: string, description: string, date: string, status: string = 'pending', type: string) => {
        if (!pregnancyData || !pregnancyData.id) {
            console.error('Cannot add user reminder: missing pregnancy data');
            setError('Không thể tạo lịch: thiếu dữ liệu thai kỳ');
            return false;
        }

        try {
            console.log('Adding user reminder:', { title, description, date });
            setLoading(true);

            // Tạo payload theo đúng cấu trúc API yêu cầu
            const payload = {
                title: title,
                status: status,
                type: type, // Sử dụng type từ thẻ tag đã chọn
                date: date,
                note: description,  // 'note' thay vì 'description'
                pregnancyId: pregnancyData.id
            };

            console.log('API request payload:', payload);
            const response = await axios.post(`https://api-mnyt.purintech.id.vn/api/ScheduleUser`, payload);
            console.log('Add user reminder response:', response.data);

            // Thêm reminder mới vào state
            if (response.data && response.data.id) {
                const newUserReminder: CalculatedReminder = {
                    id: response.data.id,
                    title: title,
                    description: description,  // Lưu vào state với tên 'description'
                    date: date,
                    type: type, // Gán type từ API
                    period: 0,
                    status: status as 'pending' | 'done' | 'skip'
                };

                setUserReminders(prev => [...prev, newUserReminder]);
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error('Error adding user reminder:', err);
            console.error('Error details:', err.response?.data || err.message);
            setError('Lỗi khi tạo lịch mới');
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
            })
            .catch(err => {
                console.log('Error refreshing schedule templates:', err);
                setError('Lỗi khi làm mới dữ liệu lịch khám');
                setLoading(false);
            });
    };

    // Thời gian cố định là 09:00 (cần cập nhật sau này khi có dữ liệu từ database)
    const defaultTime = "09:00"; // Note: Update this to fetch from database later

    // Trả về dữ liệu và các hàm cần thiết
    return {
        reminders: allReminders, // Trả về kết hợp của cả hai loại reminder
        loading,
        error,
        refreshReminders,
        updateReminderStatus,
        addUserReminder,
        pregnancyData,
        fetusData,
        fetusRecordData
    };
};