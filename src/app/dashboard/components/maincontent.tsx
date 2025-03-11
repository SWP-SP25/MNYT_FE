'use client'
import React, { useState } from 'react';
import { Card, Row, Col, Button, Space, Radio, Modal } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRouter } from 'next/navigation';
import { UpdateForm } from './form.update';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const MainContent: React.FC = () => {
    const router = useRouter();
    const [activeChart, setActiveChart] = useState('length');
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Data cho biểu đồ chiều dài
    const generateLengthData = () => {
        const data = [];
        for (let week = 20; week <= 40; week += 0.5) {
            data.push({
                week: week,
                length: 45 + (week - 20) * 2.75,
                category: 'Giới hạn trên (WHO)'
            });
            data.push({
                week: week,
                length: 42 + (week - 20) * 2.2,
                category: 'Giới hạn dưới (WHO)'
            });
            if (week <= 28 && week >= 20) {
                data.push({
                    week: week,
                    length: 44 + (week - 20) * 2.4,
                    category: 'Chiều dài thực tế'
                });
            }
            if (week >= 28) {
                data.push({
                    week: week,
                    length: 63 + (week - 28) * 0.4,
                    category: 'Chiều dài ước tính'
                });
            }
        }
        return data;
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
        const data = [];
        for (let week = 20; week <= 40; week += 0.5) {
            data.push({
                week: week,
                weight: 400 + (week - 20) * 150,
                category: 'Giới hạn trên (WHO)'
            });
            data.push({
                week: week,
                weight: 300 + (week - 20) * 100,
                category: 'Giới hạn dưới (WHO)'
            });
            if (week <= 28 && week >= 20) {
                data.push({
                    week: week,
                    weight: 350 + (week - 20) * 120,
                    category: 'Cân nặng thực tế'
                });
            }
            if (week >= 28) {
                data.push({
                    week: week,
                    weight: 1310 + (week - 28) * 180,
                    category: 'Cân nặng ước tính'
                });
            }
        }
        return data;
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

    const getChartOptions = () => {
        const data = getChartData();

        // Tách data theo category
        const upperLimit = data.filter(d => d.category.includes('Giới hạn trên')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const lowerLimit = data.filter(d => d.category.includes('Giới hạn dưới')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const actual = data.filter(d => d.category.includes('thực tế')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);
        const predicted = data.filter(d => d.category.includes('ước tính')).map(d => [d.week, activeChart === 'length' ? d.length : activeChart === 'head' ? d.value : d.weight]);

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
                min: activeChart === 'length' ? 40 :
                    activeChart === 'head' ? 70 :
                        200,
                max: activeChart === 'length' ? 100 :
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