'use client'
import React, { useState, useRef } from 'react';
import { Card, Row, Col, Button, Space, Radio, Modal } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRouter } from 'next/navigation';
import { UpdateForm } from './form-update';
import { motion } from 'framer-motion';
import useAxios from '@/hooks/useFetchAxios';
import { useFetusData } from '@/hooks/useFetusData'; // Import hook mới
import { FetusStandard } from '@/types/fetusStandard';
import { MeasurementConfig } from '@/types/measurement';
import domtoimage from 'dom-to-image';
import { BlogResponse } from '@/types/blog';
import styles from './maincontent.module.css';
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

    // Sử dụng hook mới để lấy dữ liệu thai nhi
    const {
        loading: fetusDataLoading,
        error: fetusDataError,
        processedData,
        currentPeriod
    } = useFetusData();

    const { response: fetalLengthStandard, error: fetalLengthError, loading: fetalLengthLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/length/singleton',
        method: 'get'
        //CLR ( Chiều dài đầu mông ) và FL ( Chiều dài xương đùi ) sẽ là chỉ số dùng để tính toán chiều dài thai nhi ở 2 giai đoạn khác nhau
        //Cụ thể là trong tam cá nguyệt thứ nhất và tam cá nguyệt thứ 2
    });
    const { response: fetalHeadStandard, error: fetalHeadError, loading: fetalHeadLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/HC/singleton',
        method: 'get'
        //Đây là HC - chu vi vòng đầu, không phải là BDP - đường kính lưỡng đỉnh
    });
    const { response: fetalWeightStandard, error: fetalWeightError, loading: fetalWeightLoading } = useAxios<FetusStandard[]>({
        url: 'https://api-mnyt.purintech.id.vn/api/PregnancyStandard/weight/singleton',
        method: 'get'

    });

    // Add blog data fetching
    const { response: blogData, error: blogError, loading: blogLoading } = useAxios<BlogResponse>({
        url: 'https://api-mnyt.purintech.id.vn/api/BlogPosts/all',
        method: 'get'
    });
    console.log("Blog Data từ API:", blogData); // Kiểm tra toàn bộ dữ liệu
    console.log("Blog Error:", blogError);      // Kiểm tra lỗi nếu có
    //api kéo toàn bộ dữ liệu blog từ dưới data về
    const previewBlogPost = () => {
        try {
            if (!blogData?.data || !currentPeriod) return null;

            // Lọc trực tiếp từ blogData.data vì đó là mảng chứa các bài viết
            const filteredPosts = blogData.data
                .filter(post => post.period === currentPeriod)
                .slice(0, 1);

            return filteredPosts[0] || null;
        } catch (error) {
            console.error("Error in previewBlogPost:", error);
            return null;
        }
    };

    // Data cho biểu đồ chiều dài
    const generateLengthData = () => {
        console.log('Length standard data:', fetalLengthStandard);
        console.log('Processed data for length chart:', processedData);

        const FetusStandard: any[] = [];
        if (fetalLengthStandard) {
            fetalLengthStandard.forEach(standard => {
                // Thêm giới hạn trên/dưới từ dữ liệu chuẩn
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

        // Thêm dữ liệu thực tế từ các lần đo
        if (processedData.actualData.length > 0) {
            const lengthData = processedData.actualData.filter(
                data => data.category === 'Chiều dài thực tế' && data.length !== undefined
            );
            console.log('Actual length data:', lengthData);
            FetusStandard.push(...lengthData);
        }

        // Thêm dữ liệu ước tính
        if (processedData.estimatedData.length > 0) {
            const estimatedData = processedData.estimatedData.filter(
                data => data.category === 'Chiều dài ước tính' && data.length !== undefined
            );
            console.log('Estimated length data:', estimatedData);
            FetusStandard.push(...estimatedData);
        }

        console.log('Generated length data:', FetusStandard);
        return FetusStandard;
    };

    // Data cho biểu đồ chu vi vòng đầu (HC)
    const generateHeadData = () => {
        console.log('Head standard data:', fetalHeadStandard);
        console.log('Processed data for head chart:', processedData);

        const FetusStandard: any[] = [];
        if (fetalHeadStandard) {
            fetalHeadStandard.forEach(standard => {
                // Thêm giới hạn trên/dưới từ dữ liệu chuẩn
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

        // Thêm dữ liệu thực tế từ các lần đo
        if (processedData.actualData.length > 0) {
            const headData = processedData.actualData.filter(
                data => data.category === 'Chu vi vòng đầu thực tế' && data.head !== undefined
            );
            console.log('Actual head data:', headData);
            FetusStandard.push(...headData);
        }

        // Thêm dữ liệu ước tính
        if (processedData.estimatedData.length > 0) {
            const estimatedData = processedData.estimatedData.filter(
                data => data.category === 'Chu vi vòng đầu ước tính' && data.head !== undefined
            );
            console.log('Estimated head data:', estimatedData);
            FetusStandard.push(...estimatedData);
        }

        console.log('Generated head data:', FetusStandard);
        return FetusStandard;
    };

    // Data cho biểu đồ cân nặng
    const generateWeightData = () => {
        console.log('Weight standard data:', fetalWeightStandard);
        console.log('Processed data for weight chart:', processedData);

        const FetusStandard: any[] = [];
        if (fetalWeightStandard) {
            fetalWeightStandard.forEach(standard => {
                // Thêm giới hạn trên/dưới từ dữ liệu chuẩn
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

        // Thêm dữ liệu thực tế từ các lần đo
        if (processedData.actualData.length > 0) {
            const weightData = processedData.actualData.filter(
                data => data.category === 'Cân nặng thực tế' && data.weight !== undefined
            );
            console.log('Actual weight data:', weightData);
            FetusStandard.push(...weightData);
        }

        // Thêm dữ liệu ước tính
        if (processedData.estimatedData.length > 0) {
            const estimatedData = processedData.estimatedData.filter(
                data => data.category === 'Cân nặng ước tính' && data.weight !== undefined
            );
            console.log('Estimated weight data:', estimatedData);
            FetusStandard.push(...estimatedData);
        }

        console.log('Generated weight data:', FetusStandard);
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
                    enabled: false,
                    radius: 5
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
        if (!currentPeriod || fetusDataLoading || processedData.actualData.length === 0) {
            return {
                color: '#6c757d',
                status: 'Đang tải dữ liệu...',
                detail: 'Vui lòng đợi trong khi chúng tôi tải dữ liệu thai nhi của bạn'
            };
        }

        // Lấy dữ liệu mới nhất của thai nhi
        const latestData = {
            weight: processedData.actualData.find(d => d.category === 'Cân nặng thực tế' && d.week === currentPeriod)?.weight,
            length: processedData.actualData.find(d => d.category === 'Chiều dài thực tế' && d.week === currentPeriod)?.length,
            head: processedData.actualData.find(d => d.category === 'Chu vi vòng đầu thực tế' && d.week === currentPeriod)?.head
        };

        console.log('Latest data for status calculation:', latestData);

        // Nếu không có dữ liệu cho chỉ số đang xem
        if (
            (activeChart === 'weight' && latestData.weight === undefined) ||
            (activeChart === 'length' && latestData.length === undefined) ||
            (activeChart === 'head' && latestData.head === undefined)
        ) {
            return {
                color: '#6c757d',
                status: 'Chưa có dữ liệu',
                detail: `Chưa có dữ liệu ${activeChart === 'weight' ? 'cân nặng' :
                    activeChart === 'length' ? 'chiều dài' : 'chu vi vòng đầu'
                    } cho tuần thai ${currentPeriod}`
            };
        }

        // Cấu hình cho từng loại đo
        const measurementConfigs: Record<string, MeasurementConfig> = {
            'weight': {
                standard: fetalWeightStandard,
                currentValue: latestData.weight,
                unit: 'g',
                measurementName: 'Cân nặng'
            },
            'length': {
                standard: fetalLengthStandard,
                currentValue: latestData.length,
                unit: 'mm',
                measurementName: 'Chiều dài'
            },
            'head': {
                standard: fetalHeadStandard,
                currentValue: latestData.head,
                unit: 'mm',
                measurementName: 'Chu vi vòng đầu'
            }
        };

        const currentConfig = measurementConfigs[activeChart];
        console.log('Current measurement config:', currentConfig);

        if (currentConfig && currentConfig.standard && currentConfig.currentValue !== undefined) {
            const currentWeekData = currentConfig.standard.find(
                standard => standard.period === currentPeriod
            );

            if (currentWeekData) {
                const { minimum, maximum } = currentWeekData;
                const { currentValue, unit, measurementName } = currentConfig;

                // Hàm helper để tạo thông báo
                const createMessage = (status: string, color: string) => ({
                    color,
                    status: `Em bé có ${measurementName.toLowerCase()} ${status}`,
                    detail: `${measurementName} hiện tại (${currentValue}${unit}) ${status} (${minimum}${unit} - ${maximum}${unit}) cho tuần ${currentPeriod}`
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

        // Trường hợp không có dữ liệu chuẩn cho tuần thai hiện tại
        return {
            color: '#6c757d',
            status: 'Không có dữ liệu chuẩn',
            detail: `Không có dữ liệu chuẩn cho tuần thai ${currentPeriod}`
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
                                                    src="https://res.cloudinary.com/duhhxflsl/image/upload/v1741087885/k8pj8etunyklwrtojami.png"
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
                                            title="Không có bài viết cho tuần này"
                                            description="Hiện tại chưa có bài viết phù hợp với tuần thai của bạn"
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
                title="Cập nhật chỉ số thai nhi"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <UpdateForm onClose={() => setIsModalVisible(false)} />
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
                            <Button onClick={() => downloadImage(previewUrl)}>Tải xuống</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};
export default MainContent;