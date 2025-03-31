import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CalculatedReminder, UserSchedule, UseRemindersProps } from '@/types/reminder';

export const useReminders = ({ userId }: UseRemindersProps) => {
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
        axios.get('https://api-mnyt.purintech.id.vn/api/ScheduleTemplate')
            .then(res => {
                setScheduleTemplates(res.data);
            })
            .catch(err => {
                console.error('Error fetching schedule templates:', err);
                setError('Lỗi khi lấy dữ liệu lịch khám');
            });
    }, []);

    // 2. Gọi API lấy thông tin thai kỳ nếu có userId
    useEffect(() => {
        if (userId) {
            setLoading(true);

            axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userId}`)
                .then(res => {
                    if (res.data) {
                        setPregnancyData(res.data[0]);
                    } else {
                        setError('Không tìm thấy dữ liệu thai kỳ');
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error('Error fetching pregnancy data:', err);
                    setError('Lỗi khi lấy dữ liệu thai kỳ');
                    setLoading(false);
                });
        }
    }, [userId]);

    // 3. Gọi API lấy thông tin thai nhi khi có pregnancyData
    useEffect(() => {
        if (pregnancyData) {
            axios.get(`https://api-mnyt.purintech.id.vn/api/Fetus/pregnancyId/${pregnancyData.id}`)
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        setFetusData(res.data);
                    } else {
                        setError('Không tìm thấy dữ liệu thai nhi');
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error('Error fetching fetus data:', err);
                    setError('Lỗi khi lấy dữ liệu thai nhi');
                    setLoading(false);
                });
        }
    }, [pregnancyData]);

    // 4. Gọi API lấy thông tin hồ sơ thai nhi khi có fetusData
    useEffect(() => {
        if (fetusData && fetusData.length > 0) {
            axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/FetusId/${fetusData[0].id}`)
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        // Log chi tiết về record đầu tiên để kiểm tra period
                        const firstRecord = res.data[0];
                        setFetusRecordData(res.data);
                    } else {
                        setError('Không tìm thấy dữ liệu hồ sơ thai nhi');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching fetus record data:', err);
                    setError('Lỗi khi lấy dữ liệu hồ sơ thai nhi');
                    setLoading(false);
                });
        }
    }, [fetusData]);

    // 5. Tính toán reminders dựa trên dữ liệu đã lấy được
    useEffect(() => {
        if (
            pregnancyData &&
            fetusRecordData &&
            fetusRecordData.length > 0 &&
            scheduleTemplates &&
            scheduleTemplates.length > 0
        ) {
            try {
                // Lấy createDate từ pregnancyData
                const pregnancyCreateDate = moment(pregnancyData.createDate);

                // Lấy record đầu tiên (sắp xếp theo thời gian tạo)
                const sortedRecords = [...fetusRecordData].sort((a, b) =>
                    new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
                );

                const firstRecord = sortedRecords[0];

                // Lấy period từ record đầu tiên
                const initialPeriod = firstRecord.inputPeriod || firstRecord.period;

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
            axios.get(`https://api-mnyt.purintech.id.vn/api/ScheduleUser/pregnancyId/${pregnancyData.id}`)
                .then(res => {
                    if (res.data && Array.isArray(res.data)) {
                        // Chuyển đổi từ UserSchedule sang CalculatedReminder
                        const userSchedules: CalculatedReminder[] = res.data
                            .filter((schedule: UserSchedule) => !schedule.isDeleted) // Lọc bỏ các lịch đã xóa
                            .map((schedule: UserSchedule) => {
                                // Xử lý ngày giờ từ API
                                let displayDate = schedule.date;
                                // Mặc định sẽ dùng 09:00 chỉ khi thực sự không có thời gian
                                let displayTime = "09:00";

                                // BẤT KỲ ĐỊNH DẠNG NGÀY NÀO từ API, đều ưu tiên tách lấy phần thời gian nếu có
                                if (schedule.date && schedule.date.includes('T')) {
                                    try {
                                        const dateMoment = moment(schedule.date);
                                        displayDate = dateMoment.format('YYYY-MM-DD');
                                        // LẤY CHÍNH XÁC THỜI GIAN từ API trả về
                                        displayTime = dateMoment.format('HH:mm');
                                    } catch (e) {
                                        console.error('Error parsing date from API:', e);
                                    }
                                }

                                return {
                                    id: schedule.id,
                                    title: schedule.title || 'Lịch hẹn',
                                    description: schedule.note || 'Chi tiết lịch hẹn',
                                    date: displayDate,
                                    time: displayTime, // Đảm bảo dùng thời gian đã parse từ API
                                    type: 'user',
                                    period: 0,
                                    status: schedule.status as 'pending' | 'done' | 'skip' || 'pending',
                                    tag: schedule.tag as 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination'
                                };
                            });

                        setUserReminders(userSchedules);
                    } else {
                        setUserReminders([]);
                    }
                })
                .catch(err => {
                    console.error('Error fetching user schedules:', err);
                    console.error('Error details:', err.response || err.message || err);
                    // Không set error ở đây vì có thể chưa có lịch nào
                    setUserReminders([]);
                });
        }
    }, [pregnancyData]);

    // 7. Kết hợp reminders từ template và reminders người dùng tự tạo
    useEffect(() => {
        const combined = [...systemReminders, ...userReminders];
        setAllReminders(combined);
    }, [systemReminders, userReminders]);

    // Hàm để cập nhật trạng thái reminder
    const updateReminderStatus = async (reminderId: string, status: 'pending' | 'done' | 'skip') => {
        try {
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

            // Xác định endpoint tương ứng và payload cho request
            let endpoint = '';
            let payload = {};

            if (systemReminder) {
                // Nếu là reminder từ template (system)
                endpoint = `https://api-mnyt.purintech.id.vn/api/ScheduleTemplate`;

                // Payload dựa theo cấu trúc API mới
                payload = {
                    id: systemReminder.id,
                    title: systemReminder.title,
                    description: systemReminder.description,
                    period: systemReminder.period,
                    type: "system",  // Type bây giờ phải là "system" cho template reminder
                    tag: systemReminder.tag, // Tag sẽ là một trong các giá trị REMINDER_TAGS
                    status: status,
                    // Thêm các trường khác nếu cần
                };
            } else if (userReminder) {
                // Nếu là reminder người dùng tự tạo
                endpoint = `https://api-mnyt.purintech.id.vn/api/ScheduleUser`;

                // Payload dựa theo cấu trúc API mới cho user reminder
                payload = {
                    id: userReminder.id,
                    title: userReminder.title,
                    note: userReminder.description, // 'note' thay vì 'description' cho user reminder
                    date: userReminder.date,
                    type: "user", // Type bây giờ phải là "user" cho user reminder
                    tag: userReminder.tag, // Tag sẽ là một trong các giá trị REMINDER_TAGS
                    status: status,
                    pregnancyId: pregnancyData.id,
                    // Thêm các trường khác nếu cần
                };
            }

            // Gọi API để cập nhật trạng thái
            const response = await axios.put(endpoint, payload);

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
            if (axios.isAxiosError(err)) {
                console.error('API error response:', err.response?.data);
                console.error('API error status:', err.response?.status);
            }
            setError('Lỗi khi cập nhật trạng thái');
            setLoading(false);
            return false;
        }
    };

    // Hàm để thêm reminder người dùng tự tạo
    const addUserReminder = async (title: string, description: string, date: string, status: string = 'pending', tag: string) => {
        if (!pregnancyData || !pregnancyData.id) {
            console.error('Cannot add user reminder: missing pregnancy data');
            setError('Không thể tạo lịch: thiếu dữ liệu thai kỳ');
            return false;
        }

        try {
            setLoading(true);

            // ĐẢM BẢO date có đúng định dạng ISO và thời gian được giữ nguyên
            // QUAN TRỌNG: KHÔNG định dạng lại date nếu nó đã ở dạng ISO (có chứa 'T') 
            let formattedDate = date;
            if (!date.includes('T')) {
                // Nếu date không có phần thời gian (T), thêm phần thời gian mặc định
                formattedDate = `${date}T09:00:00`;  // Sử dụng thời gian mặc định 9:00
            }

            // Tạo payload theo đúng cấu trúc API 
            const payload = {
                title: title,
                status: status,
                type: "user",
                tag: tag,
                date: formattedDate, // QUAN TRỌNG: Sử dụng formattedDate đã có thời gian
                note: description,
                pregnancyId: pregnancyData.id
            };

            const response = await axios.post(`https://api-mnyt.purintech.id.vn/api/ScheduleUser`, payload);

            // Thêm reminder mới vào state
            if (response.data && response.data.id) {
                // Xử lý ngày giờ từ payload
                let displayDate = formattedDate;
                let displayTime = "09:00"; // Giá trị mặc định CHỈ nếu không có trong API response

                // Ưu tiên sử dụng thời gian từ payload đã gửi đi
                try {
                    const dateMoment = moment(formattedDate);
                    displayDate = dateMoment.format('YYYY-MM-DD');
                    displayTime = dateMoment.format('HH:mm');
                } catch (e) {
                    console.error('Error parsing date from payload:', e);
                }

                const newUserReminder: CalculatedReminder = {
                    id: response.data.id,
                    title: title,
                    description: description,
                    date: displayDate,
                    time: displayTime,
                    type: 'user',
                    period: 0,
                    tag: tag as 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination',
                    status: status as 'pending' | 'done' | 'skip',
                };

                setUserReminders(prev => [...prev, newUserReminder]);
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error('Error adding user reminder:', err);
            if (axios.isAxiosError(err)) {
                console.error('API error response:', err.response?.data);
                console.error('API error status:', err.response?.status);
            }
            setError('Lỗi khi tạo lịch mới');
            setLoading(false);
            return false;
        }
    };

    // Hàm để làm mới dữ liệu
    const refreshReminders = () => {
        setLoading(true);

        // Làm mới dữ liệu schedule templates
        axios.get('https://api-mnyt.purintech.id.vn/api/ScheduleTemplate')
            .then(res => {
                setScheduleTemplates(res.data);

                // Làm mới dữ liệu thai kỳ nếu có userId
                if (userId) {
                    return axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userId}`);
                }
            })
            .then(res => {
                if (res) {
                    if (res.data && res.data.length > 0) {
                        setPregnancyData(res.data[0]);

                        // Làm mới dữ liệu lịch do người dùng tự tạo
                        return axios.get(`https://api-mnyt.purintech.id.vn/api/ScheduleUser/pregnancyId/${res.data[0].id}`);
                    }
                }
            })
            .then(res => {
                if (res) {
                    // Chuyển đổi từ UserSchedule sang CalculatedReminder
                    const userSchedules: CalculatedReminder[] = res.data
                        .filter((schedule: UserSchedule) => !schedule.isDeleted)
                        .map((schedule: UserSchedule) => {
                            // Xử lý ngày giờ từ API
                            let displayDate = schedule.date;
                            // Mặc định sẽ dùng 09:00 chỉ khi thực sự không có thời gian
                            let displayTime = "09:00";

                            // BẤT KỲ ĐỊNH DẠNG NGÀY NÀO từ API, đều ưu tiên tách lấy phần thời gian nếu có
                            if (schedule.date && schedule.date.includes('T')) {
                                try {
                                    const dateMoment = moment(schedule.date);
                                    displayDate = dateMoment.format('YYYY-MM-DD');
                                    // LẤY CHÍNH XÁC THỜI GIAN từ API trả về
                                    displayTime = dateMoment.format('HH:mm');
                                } catch (e) {
                                    console.error('Error parsing date from API:', e);
                                }
                            }

                            return {
                                id: schedule.id,
                                title: schedule.title || 'Lịch hẹn',
                                description: schedule.note || 'Chi tiết lịch hẹn',
                                date: displayDate,
                                time: displayTime, // Đảm bảo dùng thời gian đã parse từ API
                                type: 'user',
                                period: 0,
                                status: schedule.status as 'pending' | 'done' | 'skip' || 'pending',
                                tag: schedule.tag as 'prenental_checkup' | 'ultrasound' | 'lab_tests' | 'vaccination'
                            };
                        });

                    setUserReminders(userSchedules);
                } else {
                    setUserReminders([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('ERROR REFRESHING DATA:', err);
                console.error('Error details:', err.response?.data || err.message);
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