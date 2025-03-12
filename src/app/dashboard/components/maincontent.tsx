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

    });
    const { response: fetalHeadStandard, error: fetalHeadError, loading: fetalHeadLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/head/singleton',
        method: 'get'

    });
    const { response: fetalWeightStandard, error: fetalWeightError, loading: fetalWeightLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/weight/singleton',
        method: 'get'

    });
    console.log("list", fetalLengthStandard);
    // Data cho biểu đồ chiều dài
    const generateLengthData = () => {
        const FetusStandard: any[] = [];
        if (fetalLengthStandard) {
            fetalLengthStandard.forEach(standard => {
                // console.log("sau for each", FetusStandard);
                // console.log("kiểm tra từng đối tượng standard", standard);
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
                        value: (standard.maximum + standard.minimum) / 2,
                        category: 'Chiều dài ước tính'
                    });
                }

            });
        }
        return FetusStandard;


        // for (let week = 20; week <= 40; week += 0.5) {
        //     data.push({
        //         week: week,
        //         length: 45 + (week - 20) * 2.75,
        //         category: 'Giới hạn trên (WHO)'
        //     });
        //     data.push({
        //         week: week,
        //         length: 42 + (week - 20) * 2.2,
        //         category: 'Giới hạn dưới (WHO)'
        //     });
        //     if (week <= 28 && week >= 20) {
        //         data.push({
        //             week: week,
        //             length: 44 + (week - 20) * 2.4,
        //             category: 'Chiều dài thực tế'
        //         });
        //     }
        //     if (week >= 28) {
        //         data.push({
        //             week: week,
        //             length: 63 + (week - 28) * 0.4,
        //             category: 'Chiều dài ước tính'
        //         });
        //     }
        // }
        // return data;
    };

    // Data cho biểu đồ đường kính đầu
    const generateHeadData = () => {
        const data = [];
        for (let week = 20; week <= 40; week += 0.5) {
            data.push({
                week: week,
                value: 85 + (week - 20) * 2.5,
                category: 'Giới hạn trên (WHO)'
            });
            data.push({
                week: week,
                value: 75 + (week - 20) * 2,
                category: 'Giới hạn dưới (WHO)'
            });
            if (week <= 28 && week >= 20) {
                data.push({
                    week: week,
                    value: 80 + (week - 20) * 2.2,
                    category: 'Đường kính thực tế'
                });
            }
            if (week >= 28) {
                data.push({
                    week: week,
                    value: 95 + (week - 28) * 0.5,
                    category: 'Đường kính ước tính'
                });
            }
        }
        return data;
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
    // console.log("activeChart", activeChart);
    console.log("Dữ liệu chart trả về", getChartData());

    const getChartOptions = () => {
        const data = getChartData();

        // Tách data theo category
        const upperLimit = data.filter(d => d.category.includes('Giới hạn trên')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const lowerLimit = data.filter(d => d.category.includes('Giới hạn dưới')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const actual = data.filter(d => d.category.includes('thực tế')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const predicted = data.filter(d => d.category.includes('ước tính')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
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
                    text: 'Tuần Thai'
                },
                min: 20,
                max: 40,
                tickInterval: 2
            },
            yAxis: {
                title: {
                    text: activeChart === 'length' ? 'Chiều Dài (mm)' :
                        activeChart === 'head' ? 'Đường Kính Đầu (mm)' :
                            'Cân Nặng (g)'
                },
                min: activeChart === 'length' ? 0 :
                    activeChart === 'head' ? 70 :
                        200,
                max: activeChart === 'length' ? 500 :
                    activeChart === 'head' ? 120 :
                        4000
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
                    activeChart === 'head' ? 'Đường kính thực tế' :
                        'Cân nặng thực tế',
                data: actual,
                color: '#52c41a',
                lineWidth: 2,
                marker: {
                    enabled: false
                }
            }, {
                name: activeChart === 'length' ? 'Chiều dài ước tính' :
                    activeChart === 'head' ? 'Đường kính ước tính' :
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

    const getStatusColor = () => {
        // Logic để xác định trạng thái dựa trên dữ liệu
        return '#52c41a'; // Mặc định là màu xanh
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
                                backgroundColor: getStatusColor(),
                                height: '100%',
                                color: 'white'
                            }}
                        >
                            <h3>Trạng Thái Phát Triển</h3>
                            <p>Em Bé Của Bạn Đang Phát Triển Bình Thường</p>
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