'use client'
import React, { useState } from 'react';
import { Card, Row, Col, Button, Space, Radio, Modal } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRouter } from 'next/navigation';
import { UpdateForm } from './form-update';
import { motion } from 'framer-motion';
import useAxios from '@/hooks/useFetchAxios';
import { FetusStandard } from '@/types/fetusStandard';
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
    const { response: fetalLengthStandard, error: fetalLengthError, loading: fetalLengthLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/length/singleton',
        method: 'get'
        //CLR ( Chiều dài đầu mông ) và FL ( Chiều dài xương đùi ) sẽ là chỉ số dùng để tính toán chiều dài thai nhi ở 2 giai đoạn khác nhau
        //Cụ thể là trong tam cá nguyệt thứ nhất và tam cá nguyệt thứ 2
    });
    const { response: fetalHeadStandard, error: fetalHeadError, loading: fetalHeadLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/BPD/singleton',
        method: 'get'
        //Đây là HC - chu vi vòng đầu, không phải là BDP - đường kính lưỡng đỉnh
    });
    const { response: fetalWeightStandard, error: fetalWeightError, loading: fetalWeightLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/weight/singleton',
        method: 'get'

    });

    // Data cho biểu đồ chiều dài
    const generateLengthData = () => {
        const FetusStandard: any[] = [];
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
                if (standard.period <= 28 && standard.period >= 20) {
                    FetusStandard.push({
                        week: standard.period,
                        length: (standard.maximum + standard.minimum) / 2,
                        category: 'Chiều dài thực tế'
                    });
                }
                if (standard.period >= 28) {
                    FetusStandard.push({
                        week: standard.period,
                        length: (standard.maximum + standard.minimum) / 2,
                        category: 'Chiều dài ước tính'
                    });
                }

            });
        }
        return FetusStandard;
    };

    // Data cho biểu đồ chu vi vòng đầu (HC)
    const generateHeadData = () => {
        const FetusStandard: any[] = [];
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
                if (standard.period <= 28 && standard.period >= 20) {
                    FetusStandard.push({
                        week: standard.period,
                        head: (standard.maximum + standard.minimum) / 2,
                        category: 'Chu vi vòng đầu thực tế'
                    });
                }
                if (standard.period >= 28) {
                    FetusStandard.push({
                        week: standard.period,
                        head: (standard.maximum + standard.minimum) / 2,
                        category: 'Chu vi vòng đầu ước tính'
                    });
                }

            });
        }
        return FetusStandard;
    };

    // Data cho biểu đồ cân nặng
    const generateWeightData = () => {
        const FetusStandard: any[] = [];
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
                if (standard.period <= 28 && standard.period >= 20) {
                    FetusStandard.push({
                        week: standard.period,
                        weight: (standard.maximum + standard.minimum) / 2,
                        category: 'Cân nặng thực tế'
                    });
                }
                if (standard.period >= 28) {
                    FetusStandard.push({
                        week: standard.period,
                        weight: (standard.maximum + standard.minimum) / 2,
                        category: 'Cân nặng ước tính'
                    });
                }

            });
        }
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
    console.log("activeChart", activeChart); //-> check xem state của activeChart có thay đổi không
    console.log("Dữ liệu chart trả về", getChartData()); //-> check xem chart trả về những dữ liệu gì

    const getChartOptions = () => {
        const data = getChartData();

        // Tách data theo category
        const upperLimit = data.filter(d => d.category.includes('Giới hạn trên')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const lowerLimit = data.filter(d => d.category.includes('Giới hạn dưới')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const actual = data.filter(d => d.category.includes('thực tế')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        const predicted = data.filter(d => d.category.includes('ước tính')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.head : d.weight]);
        console.log("upperLimit", upperLimit);
        console.log("lowerLimit", lowerLimit);
        console.log("actual", actual);
        console.log("predicted", predicted);
        return {
            chart: {
                type: 'spline',
                backgroundColor: 'transparent'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Tuổi thai (tuần)'
                },
                min: 12,
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
                        4000, // cân nặng thai nhi trung bình khi mới sinh ra là 3.5kg
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
    interface MeasurementConfig {
        standard: FetusStandard[] | undefined;
        currentValue: number;
        unit: string;
        measurementName: string;
    }

    const getStatusColor = () => {
        // Cấu hình cho từng loại đo
        const measurementConfigs: Record<string, MeasurementConfig> = {
            'weight': {
                standard: fetalWeightStandard,
                currentValue: 1499, // Lấy từ API
                unit: 'g',
                measurementName: 'Cân nặng'
            },
            'length': {
                standard: fetalLengthStandard,
                currentValue: 250, // Lấy từ API
                unit: 'mm',
                measurementName: 'Chiều dài'
            },
            'head': {
                standard: fetalHeadStandard,
                currentValue: 180, // Lấy từ API
                unit: 'mm',
                measurementName: 'Chu vi vòng đầu'
            }
        };

        const currentConfig = measurementConfigs[activeChart];

        if (currentConfig && currentConfig.standard) {
            const currentWeek = 28; // Lấy từ API người dùng
            const currentWeekData = currentConfig.standard.find(
                standard => standard.period === currentWeek
            );

            if (currentWeekData) {
                const { minimum, maximum } = currentWeekData;
                const { currentValue, unit, measurementName } = currentConfig;

                // Hàm helper để tạo thông báo
                const createMessage = (status: string, color: string) => ({
                    color,
                    status: `Em bé có ${measurementName.toLowerCase()} ${status}`,
                    detail: `${measurementName} hiện tại (${currentValue}${unit}) ${status} (${minimum}${unit} - ${maximum}${unit}) cho tuần ${currentWeek}`
                });

                if (currentValue < minimum) {
                    return createMessage('thấp hơn bình thường', '#ff4d4f');
                } else if (currentValue > maximum) {
                    return createMessage('cao hơn bình thường', '#faad14');
                } else {
                    return createMessage('nằm trong khoảng bình thường', '#52c41a');
                }
            }
        }

        // Mặc định trả về trạng thái bình thường
        return {
            color: '#52c41a',
            status: 'Em bé đang phát triển bình thường',
            detail: 'Các chỉ số nằm trong khoảng bình thường'
        };
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
                                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                    Cập nhật chỉ số
                                </Button>
                            </Space>
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
                        </Space>
                    }
                    style={{ marginBottom: '20px' }}
                >
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={getChartOptions()}
                    />
                </Card>
            </motion.div>

            <Row gutter={16}>
                <Col span={12}>
                    <motion.div variants={fadeInUp}>
                        <Card
                            hoverable
                            onClick={() => router.push('/blog')}
                            cover={<img alt="nutrition" src="/path-to-your-image.jpg" />}
                        >
                            <Card.Meta
                                title="Những Thực Phẩm Mẹ Nên Ăn Và Nên Tránh Trong Thai Kì"
                                description="Mẹ nên tránh gì giúp bé phát triển khoẻ mạnh"
                            />
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                                B.S Lương.. | 02 December 2022 | 3 Min. To Read
                            </div>
                        </Card>
                    </motion.div>
                </Col>
                <Col span={12}>
                    <motion.div variants={fadeInUp}>
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
                title="Cập nhật chỉ số thai nhi"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <UpdateForm onClose={() => setIsModalVisible(false)} />
            </Modal>
        </motion.div>
    );
};
export default MainContent;