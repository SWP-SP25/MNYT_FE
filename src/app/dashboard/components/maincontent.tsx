'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Button, Space, Radio, Modal } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRouter } from 'next/navigation';
import { UpdateForm, UpdateFormProps } from './form-update';
import { motion } from 'framer-motion';
import useAxios from '@/hooks/useFetchAxios';
import { FetusStandard } from '@/types/fetusStandard';
import { MeasurementConfig } from '@/types/measurement';
import domtoimage from 'dom-to-image';
import { BlogResponse } from '@/types/blog';
import styles from './maincontent.module.css';
import { useAuth } from "@/hooks/useAuth";
import axios from 'axios';
import { getUserInfo } from '@/utils/getUserInfo';
//Tùy chỉnh các hiệu ứng chuyển động cho các phần tử trong giao diện bằng cách sử dụng thư viện framer-motion
//Định nghĩa hiệu ứng "Fade In Up" cho các phần tử
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};
//Định nghĩa hiệu ứng "Stagger Container" cho các phần tử
//Stagger Container: Hiệu ứng cho phép chúng ta chuyển động từng phần tử trong một nhóm phần tử
const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

//Phần này để tạo giao diện cho trang Dashboard
export const MainContent: React.FC = () => {
    const router = useRouter();
    const [activeChart, setActiveChart] = useState('length');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); // Lấy thông tin user từ useAuth
    const userInfo = getUserInfo(user);
    const [activeTwin, setActiveTwin] = useState<number>(0); // 0: first twin, 1: second twin
    const [isTwinPregnancy, setIsTwinPregnancy] = useState<boolean>(false);

    // Lấy dữ liệu chuẩn từ API
    const { response: fetalLengthStandard, error: fetalLengthError, loading: fetalLengthLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/length/singleton',
        method: 'get'
    });

    const { response: fetalHeadStandard, error: fetalHeadError, loading: fetalHeadLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/HC/singleton',
        method: 'get'
    });

    const { response: fetalWeightStandard, error: fetalWeightError, loading: fetalWeightLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/weight/singleton',
        method: 'get'
    });

    // Lấy dữ liệu pregnancy theo user ID
    const { response: pregnancyData, error: pregnancyError, loading: pregnancyLoading } = useAxios<any>({
        url: `https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userInfo?.id}`,
        method: 'get',
        dependencies: [userInfo?.id]
    });

    // Lấy active pregnancy từ danh sách pregnancies
    const activePregnancy = pregnancyData?.find(pregnancy => pregnancy.status === 'active' || pregnancy.status === 'Active');
    console.log("activePregnancy", activePregnancy);
    console.log("Active pregnancy id after find", activePregnancy?.id);

    // Kiểm tra nếu là thai kỳ sinh đôi
    useEffect(() => {
        if (activePregnancy) {
            // Check if pregnancy type is "twins"
            setIsTwinPregnancy(activePregnancy.type === "twins");
            console.log("Is twin pregnancy:", activePregnancy.type === "twins");
        }
    }, [activePregnancy]);

    // Lấy danh sách fetus dựa trên pregnancy ID
    const [fetusData, setFetusData] = useState<any[]>([]);
    const [fetusRecordData, setFetusRecordData] = useState<any[]>([]);
    useEffect(() => {
        if (activePregnancy) {
            axios.get(`https://api-mnyt.purintech.id.vn/api/Fetus/pregnancyId/${activePregnancy?.id}`)
                .then(response => {
                    setFetusData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching fetus data:', error);
                });
        }
    }, [activePregnancy]);
    console.log("fetusData", fetusData);
    console.log("fetusData[0] id", fetusData[0]?.id);
    useEffect(() => {
        if (fetusData && fetusData.length > 0) {
            // Nếu là sinh đôi thì lấy theo twin được chọn, nếu không thì luôn lấy [0]
            const selectedFetusIndex = isTwinPregnancy ? activeTwin : 0;
            const selectedFetusId = fetusData[selectedFetusIndex]?.id;

            if (selectedFetusId) {
                axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/FetusId/${selectedFetusId}`)
                    .then(response => {
                        setFetusRecordData(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching fetus record data:', error);
                    });
            }
        }
    }, [fetusData, activeTwin, isTwinPregnancy]);
    console.log("fetusRecordData", fetusRecordData);

    // Sắp xếp fetus record theo period tăng dần
    const sortedFetusRecords = fetusRecordData?.sort((a, b) => a.inputPeriod - b.inputPeriod) || [];
    console.log("sortedFetusRecords", sortedFetusRecords);
    // Add blog data fetching
    const { response: blogData, error: blogError, loading: blogLoading } = useAxios<BlogResponse>({
        url: 'https://api-mnyt.purintech.id.vn/api/BlogPosts/all',
        method: 'get'
    });
    console.log("Blog Data từ API:", blogData); // Kiểm tra toàn bộ dữ liệu
    console.log("Blog Error:", blogError);      // Kiểm tra lỗi nếu có
    // Hàm lấy bài viết blog dựa theo tuần thai hiện tại
    const previewBlogPost = () => {
        try {
            if (!blogData?.data) return null;

            // Lấy tuần thai hiện tại từ bản ghi mới nhất
            let currentPeriod = 0;
            if (sortedFetusRecords?.length > 0) {
                const latestRecord = sortedFetusRecords[sortedFetusRecords.length - 1];
                currentPeriod = latestRecord?.inputPeriod || 0;
            }

            console.log('Current pregnancy period for blog:', currentPeriod);

            // Nếu không có dữ liệu về tuần thai, trả về null
            if (currentPeriod <= 0) {
                console.log('No pregnancy data available for blog selection');
                return null;
            }

            // Lọc bài viết theo tuần thai hiện tại
            const filteredPosts = blogData.data
                .filter(post => post.period === currentPeriod)
                .slice(0, 1); // Lấy bài viết đầu tiên nếu có nhiều bài

            console.log(`Found ${filteredPosts.length} blog posts for period ${currentPeriod}`);

            // Trả về bài viết đầu tiên hoặc null nếu không tìm thấy
            return filteredPosts[0] || null;
        } catch (error) {
            console.error("Error in previewBlogPost:", error);
            return null;
        }
    };

    // Data cho biểu đồ chiều dài
    const generateLengthData = () => {
        const FetusStandard: any[] = [];

        // Thêm dữ liệu chuẩn (minimum và maximum)
        if (fetalLengthStandard) {
            fetalLengthStandard.forEach(standard => {
                FetusStandard.push({
                    week: standard.period,
                    length: standard.maximum,
                    category: 'Giới hạn trên (WHO)'
                });
                FetusStandard.push({
                    week: standard.period,
                    length: standard.minimum,
                    category: 'Giới hạn dưới (WHO)'
                });
            });
        }

        // Xác định tuần hiện tại và dữ liệu thực tế
        let actualDataPoints = [];
        let lastActualWeek = 0;
        let lastActualLength = 0;

        // Thêm dữ liệu thực tế từ fetus records
        if (sortedFetusRecords?.length > 0) {
            sortedFetusRecords.forEach(record => {
                if (record.length && record.inputPeriod) {
                    actualDataPoints.push({
                        week: record.inputPeriod,
                        length: record.length
                    });

                    // Cập nhật tuần và giá trị mới nhất
                    if (record.inputPeriod > lastActualWeek) {
                        lastActualWeek = record.inputPeriod;
                        lastActualLength = record.length;
                    }

                    FetusStandard.push({
                        week: record.inputPeriod,
                        length: record.length,
                        category: 'Chiều dài thực tế'
                    });
                }
            });

            // Đường dự đoán chiều dài
            if (lastActualWeek > 0 && lastActualLength > 0) {
                console.log(`Generating length estimate from week ${lastActualWeek + 1} to 40`);

                // Lấy tất cả các tuần từ tuần sau tuần thực tế mới nhất đến tuần 40
                for (let period = lastActualWeek + 1; period <= 40; period++) {
                    // Dự đoán chiều dài dựa trên dữ liệu hiện tại và tiêu chuẩn WHO
                    const currentStandard = fetalLengthStandard?.find(s => s.period === lastActualWeek);
                    const nextStandard = fetalLengthStandard?.find(s => s.period === period);

                    let estimatedLength = 0;

                    if (currentStandard && nextStandard) {
                        const standardRatio = (nextStandard.maximum + nextStandard.minimum) /
                            (currentStandard.maximum + currentStandard.minimum);
                        estimatedLength = lastActualLength * standardRatio;
                        console.log(`Week ${period}: Using WHO ratio ${standardRatio.toFixed(2)}, estimated length: ${estimatedLength.toFixed(1)}mm`);
                    } else {
                        // Nếu không có tiêu chuẩn, ước lượng tăng 2% mỗi tuần
                        const growthRate = 1 + (period - lastActualWeek) * 0.02;
                        estimatedLength = lastActualLength * growthRate;
                        console.log(`Week ${period}: Using default growth rate ${growthRate.toFixed(2)}, estimated length: ${estimatedLength.toFixed(1)}mm`);
                    }

                    // Đảm bảo giá trị nằm trong khoảng hợp lý (10mm - 600mm)
                    estimatedLength = Math.max(10, Math.min(600, estimatedLength));

                    FetusStandard.push({
                        week: period,
                        length: Math.round(estimatedLength),
                        category: 'Chiều dài ước tính'
                    });
                }
            } else {
                // Nếu không có dữ liệu chiều dài thực tế, sử dụng giá trị trung bình WHO cho tất cả các tuần
                for (let period = 1; period <= 40; period++) {
                    const standard = fetalLengthStandard?.find(s => s.period === period);
                    if (standard) {
                        FetusStandard.push({
                            week: period,
                            length: Math.round((standard.maximum + standard.minimum) / 2),
                            category: 'Chiều dài ước tính'
                        });
                    }
                }
            }
        } else {
            // Nếu không có dữ liệu thực tế nào, sử dụng giá trị trung bình WHO cho tất cả các tuần
            for (let period = 1; period <= 40; period++) {
                const standard = fetalLengthStandard?.find(s => s.period === period);
                if (standard) {
                    FetusStandard.push({
                        week: period,
                        length: Math.round((standard.maximum + standard.minimum) / 2),
                        category: 'Chiều dài ước tính'
                    });
                }
            }
        }

        console.log(`Generated ${FetusStandard.length} data points for length chart`);
        return FetusStandard;
    };

    // Data cho biểu đồ chu vi vòng đầu (HC)
    const generateHeadData = () => {
        const FetusStandard: any[] = [];

        // Thêm dữ liệu chuẩn (minimum và maximum)
        if (fetalHeadStandard) {
            fetalHeadStandard.forEach(standard => {
                FetusStandard.push({
                    week: standard.period,
                    head: standard.maximum,
                    category: 'Giới hạn trên (WHO)'
                });
                FetusStandard.push({
                    week: standard.period,
                    head: standard.minimum,
                    category: 'Giới hạn dưới (WHO)'
                });
            });
        }

        // Xác định tuần hiện tại và dữ liệu thực tế
        let lastActualWeek = 0;
        let lastActualHC = 0;

        // Thêm dữ liệu thực tế từ fetus records
        if (sortedFetusRecords?.length > 0) {
            sortedFetusRecords.forEach(record => {
                if (record.hc && record.inputPeriod) {
                    // Cập nhật tuần và giá trị mới nhất
                    if (record.inputPeriod > lastActualWeek) {
                        lastActualWeek = record.inputPeriod;
                        lastActualHC = record.hc;
                    }

                    FetusStandard.push({
                        week: record.inputPeriod,
                        head: record.hc,
                        category: 'Chu vi vòng đầu thực tế'
                    });
                }
            });

            // Đường dự đoán HC
            if (lastActualWeek > 0 && lastActualHC > 0) {
                console.log(`Generating HC estimate from week ${lastActualWeek + 1} to 40`);

                // Lấy tất cả các tuần từ tuần sau tuần thực tế mới nhất đến tuần 40
                for (let period = lastActualWeek + 1; period <= 40; period++) {
                    // Dự đoán HC dựa trên dữ liệu hiện tại và tiêu chuẩn WHO
                    const currentStandard = fetalHeadStandard?.find(s => s.period === lastActualWeek);
                    const nextStandard = fetalHeadStandard?.find(s => s.period === period);

                    let estimatedHC = 0;

                    if (currentStandard && nextStandard) {
                        const standardRatio = (nextStandard.maximum + nextStandard.minimum) /
                            (currentStandard.maximum + currentStandard.minimum);
                        estimatedHC = lastActualHC * standardRatio;
                        console.log(`Week ${period}: Using WHO ratio ${standardRatio.toFixed(2)}, estimated HC: ${estimatedHC.toFixed(1)}mm`);
                    } else {
                        // Nếu không có tiêu chuẩn, ước lượng tăng 3% mỗi tuần
                        const growthRate = 1 + (period - lastActualWeek) * 0.03;
                        estimatedHC = lastActualHC * growthRate;
                        console.log(`Week ${period}: Using default growth rate ${growthRate.toFixed(2)}, estimated HC: ${estimatedHC.toFixed(1)}mm`);
                    }

                    // Đảm bảo giá trị nằm trong khoảng hợp lý (20mm - 500mm)
                    estimatedHC = Math.max(20, Math.min(500, estimatedHC));

                    FetusStandard.push({
                        week: period,
                        head: Math.round(estimatedHC),
                        category: 'Chu vi vòng đầu ước tính'
                    });
                }
            } else {
                // Nếu không có dữ liệu HC thực tế, sử dụng giá trị trung bình WHO cho tất cả các tuần
                for (let period = 1; period <= 40; period++) {
                    const standard = fetalHeadStandard?.find(s => s.period === period);
                    if (standard) {
                        FetusStandard.push({
                            week: period,
                            head: Math.round((standard.maximum + standard.minimum) / 2),
                            category: 'Chu vi vòng đầu ước tính'
                        });
                    }
                }
            }
        } else {
            // Nếu không có dữ liệu thực tế nào, sử dụng giá trị trung bình WHO cho tất cả các tuần
            for (let period = 1; period <= 40; period++) {
                const standard = fetalHeadStandard?.find(s => s.period === period);
                if (standard) {
                    FetusStandard.push({
                        week: period,
                        head: Math.round((standard.maximum + standard.minimum) / 2),
                        category: 'Chu vi vòng đầu ước tính'
                    });
                }
            }
        }

        console.log(`Generated ${FetusStandard.length} data points for head chart`);
        return FetusStandard;
    };

    // Data cho biểu đồ cân nặng
    const generateWeightData = () => {
        const FetusStandard: any[] = [];

        // Thêm dữ liệu chuẩn (minimum và maximum)
        if (fetalWeightStandard) {
            fetalWeightStandard.forEach(standard => {
                FetusStandard.push({
                    week: standard.period,
                    weight: standard.maximum,
                    category: 'Giới hạn trên (WHO)'
                });
                FetusStandard.push({
                    week: standard.period,
                    weight: standard.minimum,
                    category: 'Giới hạn dưới (WHO)'
                });
            });
        }

        // Xác định tuần hiện tại và dữ liệu thực tế
        let lastActualWeek = 0;
        let lastActualWeight = 0;

        // Thêm dữ liệu thực tế từ fetus records
        if (sortedFetusRecords?.length > 0) {
            sortedFetusRecords.forEach(record => {
                if (record.weight && record.inputPeriod) {
                    // Cập nhật tuần và giá trị mới nhất
                    if (record.inputPeriod > lastActualWeek) {
                        lastActualWeek = record.inputPeriod;
                        lastActualWeight = record.weight;
                    }

                    FetusStandard.push({
                        week: record.inputPeriod,
                        weight: record.weight,
                        category: 'Cân nặng thực tế'
                    });
                }
            });

            // Đường dự đoán cân nặng
            if (lastActualWeek > 0 && lastActualWeight > 0) {
                console.log(`Generating weight estimate from week ${lastActualWeek + 1} to 40`);

                // Lấy tất cả các tuần từ tuần sau tuần thực tế mới nhất đến tuần 40
                for (let period = lastActualWeek + 1; period <= 40; period++) {
                    // Dự đoán cân nặng dựa trên dữ liệu hiện tại và tiêu chuẩn WHO
                    const currentStandard = fetalWeightStandard?.find(s => s.period === lastActualWeek);
                    const nextStandard = fetalWeightStandard?.find(s => s.period === period);

                    let estimatedWeight = 0;

                    if (currentStandard && nextStandard) {
                        const standardRatio = (nextStandard.maximum + nextStandard.minimum) /
                            (currentStandard.maximum + currentStandard.minimum);
                        estimatedWeight = lastActualWeight * standardRatio;
                        console.log(`Week ${period}: Using WHO ratio ${standardRatio.toFixed(2)}, estimated weight: ${estimatedWeight.toFixed(1)}g`);
                    } else {
                        // Bảng tỷ lệ tăng trưởng cân nặng thai nhi theo tuần (xấp xỉ)
                        let weeklyGrowthRate;

                        if (period < 20) {
                            weeklyGrowthRate = 1.15; // 15% mỗi tuần trong 3 tháng giữa
                        } else if (period < 30) {
                            weeklyGrowthRate = 1.12; // 12% mỗi tuần trong 3 tháng cuối đầu
                        } else {
                            weeklyGrowthRate = 1.07; // 7% mỗi tuần trong giai đoạn cuối
                        }

                        // Tính cân nặng với tỷ lệ tăng trưởng cố định
                        const weeksDiff = period - lastActualWeek;
                        estimatedWeight = lastActualWeight * Math.pow(weeklyGrowthRate, weeksDiff);
                        console.log(`Week ${period}: Using growth rate ${weeklyGrowthRate.toFixed(2)} ^ ${weeksDiff}, estimated weight: ${estimatedWeight.toFixed(1)}g`);
                    }

                    // Đảm bảo giá trị nằm trong khoảng hợp lý (1g - 5000g)
                    estimatedWeight = Math.max(1, Math.min(5000, estimatedWeight));

                    FetusStandard.push({
                        week: period,
                        weight: Math.round(estimatedWeight),
                        category: 'Cân nặng ước tính'
                    });
                }
            } else {
                // Nếu không có dữ liệu cân nặng thực tế, sử dụng giá trị trung bình WHO cho tất cả các tuần
                for (let period = 1; period <= 40; period++) {
                    const standard = fetalWeightStandard?.find(s => s.period === period);
                    if (standard) {
                        FetusStandard.push({
                            week: period,
                            weight: Math.round((standard.maximum + standard.minimum) / 2),
                            category: 'Cân nặng ước tính'
                        });
                    }
                }
            }
        } else {
            // Nếu không có dữ liệu thực tế nào, sử dụng giá trị trung bình WHO cho tất cả các tuần
            for (let period = 1; period <= 40; period++) {
                const standard = fetalWeightStandard?.find(s => s.period === period);
                if (standard) {
                    FetusStandard.push({
                        week: period,
                        weight: Math.round((standard.maximum + standard.minimum) / 2),
                        category: 'Cân nặng ước tính'
                    });
                }
            }
        }

        console.log(`Generated ${FetusStandard.length} data points for weight chart`);
        return FetusStandard;
    };

    const getChartData = () => {
        switch (activeChart) {
            case 'length':
                return generateLengthData();
            case 'head':
                return generateHeadData();
            case 'weight':
                return generateWeightData();
            default:
                return generateLengthData();
        }
    };
    // console.log("activeChart", activeChart); //-> check xem state của activeChart có thay đổi không
    // console.log("Dữ liệu chart trả về", getChartData()); //-> check xem chart trả về những dữ liệu gì

    const getChartOptions = () => {
        const data = getChartData();

        // Tách data theo category
        const upperLimit = data.filter(d => d.category.includes('Giới hạn trên')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const lowerLimit = data.filter(d => d.category.includes('Giới hạn dưới')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const actual = data.filter(d => d.category.includes('thực tế')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const predicted = data.filter(d => d.category.includes('ước tính')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        // console.log("upperLimit", upperLimit);
        // console.log("lowerLimit", lowerLimit);
        // console.log("actual", actual);
        // console.log("predicted", predicted);
        return {
            chart: {
                type: 'spline',
                backgroundColor: 'transparent'
            },
            title: {
                text: activeChart === 'length' ? 'Biểu đồ tăng trưởng chiều dài của thai nhi' :
                    activeChart === 'head' ? 'Biểu đồ tăng trưởng chu vi vòng đầu của thai nhi' :
                        'Biểu đồ tăng trưởng cân nặng của thai nhi'
            },
            xAxis: {
                title: {
                    text: 'Tuổi thai (tuần)'
                },
                min: 2,
                max: 40,
                tickInterval: 2
                //min là 12 vì từ tuần 12~13 đổ đi các chỉ số cần thiết
                //để tính toán, render được biểu đồ đã có thể được đo đầy đủ thông qua siêu âm
            },
            yAxis: {
                title: {
                    text: activeChart === 'length' ? 'Chiều Dài (mm)' :
                        activeChart === 'head' ? 'Đường Kính Vòng Đầu (mm)' :
                            'Cân Nặng (g)'
                },
                min: activeChart === 'length' ? 40 ://chiều dài thai nhi ở tuần 12 trung bình là 50~60mm
                    activeChart === 'head' ? 0 : //chu vi vòng đầu thai nhi ở tuần 13 trung bình là 40~50mm
                        10, //  cân nặng thai nhi ở tuần 12~13 trung bình là 15~20 Gram
                max: activeChart === 'length' ? 600 : //chiều dài thai nhi trung bình ở tuần 40 rơi vào khoảng 500~550mm
                    activeChart === 'head' ? 500 : //chu vi vòng đầu thai nhi trung bình ở tuần 40 rơi vào khoảng 380~400mm
                        5000, // cân nặng thai nhi trung bình khi mới sinh ra là 3.5kg
                tickInterval: activeChart === 'length' ? 50 :
                    activeChart === 'head' ? 50 :
                        500
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Giới hạn trên (WHO)',
                data: upperLimit,
                color: '#ff4d4f',
                marker: {
                    enabled: false
                }
            }, {
                name: 'Giới hạn dưới (WHO)',
                data: lowerLimit,
                color: '#1890ff',
                marker: {
                    enabled: false
                }
            }, {
                name: activeChart === 'length' ? 'Chiều dài thực tế' :
                    activeChart === 'head' ? 'Chu vi vòng đầu thực tế' :
                        'Cân nặng thực tế',
                data: actual,
                color: '#52c41a',
                lineWidth: 2,
                marker: {
                    enabled: false
                }
            }, {
                name: activeChart === 'length' ? 'Chiều dài ước tính' :
                    activeChart === 'head' ? 'Chu vi vòng đầu ước tính' :
                        'Cân nặng ước tính',
                data: predicted,
                dashStyle: 'Dash',
                color: '#d48cff',
                marker: {
                    enabled: false
                }
            }]
        };
    };

    // Định nghĩa interface cho cấu trúc dữ liệu đo lường


    const getStatusColor = () => {
        // Cấu hình cho từng loại đo
        const measurementConfigs: Record<string, MeasurementConfig> = {
            'weight': {
                standard: fetalWeightStandard,
                currentValue: 0,
                unit: 'g',
                measurementName: 'Cân nặng'
            },
            'length': {
                standard: fetalLengthStandard,
                currentValue: 0,
                unit: 'mm',
                measurementName: 'Chiều dài'
            },
            'head': {
                standard: fetalHeadStandard,
                currentValue: 0,
                unit: 'mm',
                measurementName: 'Chu vi vòng đầu'
            }
        };

        // Tìm bản ghi mới nhất cho từng loại đo
        let lastActualWeek = 0;
        let lastActualValues = {
            weight: 0,
            length: 0,
            head: 0
        };

        if (sortedFetusRecords?.length > 0) {
            // Tìm bản ghi cuối cùng cho từng loại đo lường
            sortedFetusRecords.forEach(record => {
                if (record.inputPeriod > lastActualWeek) {
                    lastActualWeek = record.inputPeriod;

                    // Chỉ cập nhật giá trị nếu nó tồn tại trong bản ghi
                    if (record.weight) lastActualValues.weight = record.weight;
                    if (record.length) lastActualValues.length = record.length;
                    if (record.hc) lastActualValues.head = record.hc;
                }
            });

            // Cập nhật giá trị hiện tại
            measurementConfigs.weight.currentValue = lastActualValues.weight;
            measurementConfigs.length.currentValue = lastActualValues.length;
            measurementConfigs.head.currentValue = lastActualValues.head;
        }

        const currentConfig = measurementConfigs[activeChart];
        console.log('Current measurement config:', currentConfig);

        if (currentConfig && currentConfig.standard) {
            // Nếu không có dữ liệu hoặc tuần hiện tại bằng 0
            if (lastActualWeek === 0 || currentConfig.currentValue === 0) {
                console.log('No data available for status calculation');
                return {
                    color: '#1890ff', // Màu xanh dương nhẹ
                    status: 'Chưa có dữ liệu',
                    detail: 'Vui lòng cập nhật chỉ số thai nhi để xem trạng thái phát triển'
                };
            }

            // Tìm tiêu chuẩn cho tuần hiện tại
            const currentWeekData = currentConfig.standard.find(
                standard => standard.period === lastActualWeek
            );

            console.log('Current week standard data:', currentWeekData);

            if (currentWeekData) {
                const { minimum, maximum } = currentWeekData;
                const { currentValue, unit, measurementName } = currentConfig;

                console.log(`Comparing ${measurementName}: ${currentValue}${unit} with range ${minimum}${unit}-${maximum}${unit} for week ${lastActualWeek}`);

                // Tính tỷ lệ để xác định mức độ
                const range = maximum - minimum;
                const deviation = currentValue < minimum
                    ? (minimum - currentValue) / range * 100
                    : currentValue > maximum
                        ? (currentValue - maximum) / range * 100
                        : 0;

                // Hàm helper để tạo thông báo chi tiết hơn
                const createDetailedMessage = (status: string, level: string, color: string) => {
                    let message = `${measurementName} hiện tại (${currentValue}${unit}) ${status} (${minimum}${unit} - ${maximum}${unit}) cho tuần ${lastActualWeek}`;

                    if (level !== 'normal') {
                        message += `. Chênh lệch khoảng ${Math.round(deviation)}% so với mức ${status === 'thấp hơn bình thường' ? 'tối thiểu' : 'tối đa'}.`;
                    }

                    return {
                        color,
                        status: `Em bé có ${measurementName.toLowerCase()} ${status}`,
                        detail: message,
                        level: level
                    };
                };

                if (currentValue < minimum) {
                    if (deviation > 30) {
                        // Rất thấp
                        return createDetailedMessage('thấp hơn bình thường', 'critical', '#ff1f1f');
                    } else if (deviation > 15) {
                        // Khá thấp
                        return createDetailedMessage('thấp hơn bình thường', 'warning', '#ff4d4f');
                    } else {
                        // Hơi thấp
                        return createDetailedMessage('hơi thấp hơn bình thường', 'caution', '#ff7a45');
                    }
                } else if (currentValue > maximum) {
                    if (deviation > 30) {
                        // Rất cao
                        return createDetailedMessage('cao hơn bình thường', 'critical', '#d4380d');
                    } else if (deviation > 15) {
                        // Khá cao
                        return createDetailedMessage('cao hơn bình thường', 'warning', '#fa8c16');
                    } else {
                        // Hơi cao
                        return createDetailedMessage('hơi cao hơn bình thường', 'caution', '#faad14');
                    }
                } else {
                    // Phân loại chi tiết hơn trong phạm vi bình thường
                    const ratio = (currentValue - minimum) / range;

                    if (ratio < 0.25) {
                        // Nằm ở phần tư dưới của phạm vi bình thường
                        return createDetailedMessage('nằm trong khoảng bình thường (gần ngưỡng dưới)', 'normal', '#73d13d');
                    } else if (ratio > 0.75) {
                        // Nằm ở phần tư trên của phạm vi bình thường
                        return createDetailedMessage('nằm trong khoảng bình thường (gần ngưỡng trên)', 'normal', '#73d13d');
                    } else {
                        // Nằm ở giữa phạm vi bình thường
                        return createDetailedMessage('nằm trong khoảng bình thường', 'normal', '#52c41a');
                    }
                }
            }
        }

        // Mặc định trả về trạng thái "không có dữ liệu"
        return {
            color: '#8c8c8c', // Màu xám
            status: 'Không có dữ liệu để đánh giá',
            detail: 'Vui lòng cập nhật chỉ số thai nhi hoặc chọn loại đo khác'
        };
    };

    const exportChart = () => {
        const options = { bgcolor: '#FFFFFF' };

        if (chartRef.current) {
            domtoimage.toPng(chartRef.current, options)
                .then((dataUrl) => {
                    setPreviewUrl(dataUrl);
                    setIsPreviewVisible(true); // Hiển thị popup
                })
                .catch((error) => {
                    console.error('Lỗi khi xuất biểu đồ:', error);
                });
        }
    };

    const downloadImage = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `bieu-do-${activeChart}-thai-nhi.png`;
        link.click();
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
        >
            <motion.div variants={fadeInUp}>
                <Card
                    title={
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>Biểu đồ theo dõi thai nhi</span>
                                <Space>
                                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                        Cập nhật chỉ số
                                    </Button>
                                    <Button onClick={exportChart}>
                                        Xuất biểu đồ
                                    </Button>
                                </Space>
                            </Space>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Radio.Group
                                    value={activeChart}
                                    onChange={(e) => setActiveChart(e.target.value)}
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="length">Chiều dài</Radio.Button>
                                    <Radio.Button value="head">Đường kính đầu</Radio.Button>
                                    <Radio.Button value="weight">Cân nặng</Radio.Button>
                                </Radio.Group>

                                {isTwinPregnancy && (
                                    <Radio.Group
                                        value={activeTwin}
                                        onChange={(e) => setActiveTwin(e.target.value)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value={0}>Thai nhi 1</Radio.Button>
                                        <Radio.Button value={1}>Thai nhi 2</Radio.Button>
                                    </Radio.Group>
                                )}
                            </div>
                        </Space>
                    }
                    style={{ marginBottom: '20px' }}
                >
                    <div ref={chartRef}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={getChartOptions()}
                        />
                    </div>
                </Card>
            </motion.div>

            <Row gutter={16} className={styles.row}>
                <Col span={12} className={styles.col}>
                    <motion.div variants={fadeInUp} className={styles.motionContainer}>
                        {blogLoading ? (
                            <Card loading={true} className={styles.blogCard} />
                        ) : (
                            (() => {
                                const post = previewBlogPost();

                                // Xác định tuần thai hiện tại để hiển thị trong thông báo
                                let currentPeriod = 0;
                                if (sortedFetusRecords?.length > 0) {
                                    const latestRecord = sortedFetusRecords[sortedFetusRecords.length - 1];
                                    currentPeriod = latestRecord?.inputPeriod || 0;
                                }

                                return post ? (
                                    <Card
                                        hoverable
                                        onClick={() => router.push('/blog')}
                                        className={styles.blogCard}
                                        bodyStyle={{ padding: 0 }}
                                        cover={
                                            <div className={styles.imageContainer}>
                                                <img
                                                    alt="blog cover"
                                                    src="https://res.cloudinary.com/drvn1tizc/image/upload/v1742278926/dinhduong-16903446267511906346206_eahhse.jpg"
                                                    className={styles.coverImage}
                                                />
                                                <div className={styles.contentOverlay}>
                                                    <div className={styles.metaInfo}>
                                                        {post.authorName} | {new Date(post.publishedDay).toLocaleDateString('vi-VN')} |
                                                        Tuần thai {post.period}
                                                    </div>
                                                    <h3 className={styles.blogTitle}>
                                                        {post.title}
                                                    </h3>
                                                    <p className={styles.blogDescription}>
                                                        {post.description}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                ) : (
                                    <Card className={styles.blogCard}>
                                        <Card.Meta
                                            title={currentPeriod > 0 ?
                                                `Không có bài viết cho tuần thai ${currentPeriod}` :
                                                "Chưa có dữ liệu thai kỳ"}
                                            description={currentPeriod > 0 ?
                                                "Hiện tại chưa có bài viết phù hợp với tuần thai của bạn" :
                                                "Vui lòng cập nhật thông tin thai kỳ để xem bài viết phù hợp"}
                                        />
                                    </Card>
                                );
                            })()
                        )}
                    </motion.div>
                </Col>
                <Col span={12} className={styles.col}>
                    <motion.div variants={fadeInUp} className={styles.motionContainer}>
                        <Card
                            style={{
                                backgroundColor: getStatusColor().color,
                                height: '100%',
                                color: 'white'
                            }}
                        >
                            <h3>Trạng Thái Phát Triển</h3>
                            <p>{getStatusColor().status}</p>
                            <p style={{ fontSize: '14px' }}>{getStatusColor().detail}</p>
                            <a href="#" style={{ color: 'white' }}>Xem Chi Tiết →</a>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            <Modal
                title={`Cập nhật chỉ số thai nhi${isTwinPregnancy ? " (Sinh đôi)" : ""}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <UpdateForm
                    onClose={() => setIsModalVisible(false)}
                    isTwins={isTwinPregnancy}
                    activeTwin={activeTwin}
                />
            </Modal>

            <Modal
                title="Bản Xem Nhanh"
                visible={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                footer={null}
            >
                {previewUrl && (
                    <div>
                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%' }} />
                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <Button onClick={() => downloadImage(previewUrl)}>Tải về máy</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};
export default MainContent;