import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CalculatedReminder, UserSchedule, UseRemindersProps } from '@/types/reminder';

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
                            status: template.status,
                            tag: template.tag
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

                setSystemReminders(calculatedReminders);
            } catch (err) {
                console.error('Error calculating reminders:', err);
                setError('Lỗi khi tính toán lịch khám');
            }
        }
    }, [pregnancyData, fetusRecordData, scheduleTemplates]);

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
                                type: 'user',
                                period: 0,//user schedule thì reminder không có period
                                status: schedule.status as 'pending' | 'done' | 'skip' || 'pending',
                                tag: schedule.tag as 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination'
                                //UserSchedule chi tiết để đối chiếu
                                // export interface UserSchedule {
                                //     id: number;
                                //     title: string;
                                //     note: string; // Tương đương với description
                                //     date: string;
                                //     type: string;
                                //     status: string;
                                //     pregnancyId: number;
                                //     isDeleted: boolean;
                                //     tag: 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination';
                                // }
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
                    // Không set error ở đây vì có thể chưa có lịch nào
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

            if (systemReminder) {
                // Nếu là reminder từ template
                console.log('Updating system reminder:', systemReminder);

                endpoint = `https://api-mnyt.purintech.id.vn/api/ScheduleTemplate`;

                // Giữ nguyên tất cả dữ liệu hiện tại, chỉ cập nhật status
                payload = {
                    id: systemReminder.id,
                    title: systemReminder.title,
                    description: systemReminder.description,
                    period: systemReminder.period,
                    type: systemReminder.type,
                    status: status,
                    // Thêm các trường khác nếu cần
                };
            } else if (userReminder) {
                // Nếu là reminder người dùng tự tạo
                console.log('Updating user reminder:', userReminder);

                endpoint = `https://api-mnyt.purintech.id.vn/api/ScheduleUser`;

                // Giữ nguyên tất cả dữ liệu hiện tại, chỉ cập nhật status
                payload = {
                    id: userReminder.id,
                    title: userReminder.title,
                    note: userReminder.description, // 'note' thay vì 'description' cho user reminder
                    date: userReminder.date,
                    type: userReminder.type,
                    status: status,
                    pregnancyId: pregnancyData.id,
                    // Thêm các trường khác nếu cần
                };
            }

            console.log('Update status payload:', payload);

            // Gọi API để cập nhật trạng thái
            const response = await axios.put(endpoint, payload);
            console.log('Update status response:', response.data);

            // Cập nhật state local tùy theo loại reminder
            if (systemReminder) {
                setSystemReminders(prev =>
                    prev.map(reminder =>
                        reminder.id.toString() === reminderId
                            ? { ...reminder, status }
                            : reminder
                    )
                );
            } else if (userReminder) {
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
    const addUserReminder = async (title: string, description: string, date: string, status: string = 'pending', type: string = 'user') => {
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
                type: type,
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
                    type: 'user',
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

                // Làm mới dữ liệu thai kỳ nếu có userId
                if (userId) {
                    return axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userId}`);
                }
            })
            .then(res => {
                if (res) {
                    console.log('Refreshed pregnancy data:', res.data);
                    if (res.data && res.data.length > 0) {
                        setPregnancyData(res.data[0]);

                        // Làm mới dữ liệu lịch do người dùng tự tạo
                        return axios.get(`https://api-mnyt.purintech.id.vn/api/ScheduleUser/${res.data[0].id}`);
                    }
                }
            })
            .then(res => {
                if (res) {
                    console.log('Refreshed user schedules:', res.data);

                    // Chuyển đổi từ UserSchedule sang CalculatedReminder
                    const userSchedules: CalculatedReminder[] = res.data
                        .filter((schedule: UserSchedule) => !schedule.isDeleted)
                        .map((schedule: UserSchedule) => ({
                            id: schedule.id,
                            title: schedule.title || 'Lịch hẹn',
                            description: schedule.note || 'Chi tiết lịch hẹn',
                            date: schedule.date,
                            type: 'user',
                            period: 0,
                            status: schedule.status as 'pending' | 'done' | 'skip' || 'pending'
                        }));

                    setUserReminders(userSchedules);
                } else {
                    setUserReminders([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log('Error refreshing data:', err);
                setError('Lỗi khi làm mới dữ liệu');
                setLoading(false);
            });
    };

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