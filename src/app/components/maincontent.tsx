'use client'
import React from 'react';
import { Card, Row, Col } from 'antd';
import { Line } from '@ant-design/plots';
import { useFetch } from '@/hooks/useFetch';
import { FetusStandard } from '@/types/fetusStandard';
import useAxios from '@/hooks/useFetchAxios';


export const MainContent: React.FC = () => {

    const { response: fetalLengthStandard, error, loading } = useAxios<FetusStandard[]>({
        url: `https://api-mnyt.purintech.id.vn/api/PregnancyStandard`,
        method: "get"
      });

      console.log("list",fetalLengthStandard)

      fetalLengthStandard && fetalLengthStandard.forEach(standard => {console.log(standard.type + " - " + standard.period + " - " + standard.minimum + " - " + standard.maximum)})
    // Data cho biểu đồ
    const generateData = () => {
        const FetusStandard : any[] = [];
        // Dữ liệu từ tuần 20 đến tuần 40
        fetalLengthStandard && fetalLengthStandard.forEach(standard => {
            FetusStandard.push({
                week:standard.period,
                length: standard?.maximum,
                category: 'Giới hạn trên (WHO)'
            })
            FetusStandard.push({
                week:standard.period,
                length: standard?.minimum,
                category: 'Giới hạn dưới (WHO)'
            })
        });
        
        for (let week = 20; week <= 40; week += 0.5) {
            // Giới hạn trên WHO
            
            // data.push({
            //     week: fetalLengthStandard?.period,
            //     length: 45 + (week - 20) * 2.75,
            //     category: 'Giới hạn trên (WHO)'
            // });

            // Giới hạn dưới WHO
            

            // Thêm dữ liệu thực tế chỉ từ tuần 20-28
            // if (week <= 28 && week >= 20) {
            //     data.push({
            //         week: week,
            //         length: 44 + (week - 20) * 2.4,
            //         category: 'Chiều dài thực tế'
            //     });
            // }

            // Đường dự đoán từ tuần 28 trở đi
            // if (week >= 28) {
            //     data.push({
            //         week: week,
            //         length: 63 + (week - 28) * 0.4,
            //         category: 'Chiều dài ước tính'
            //     });
            // }
        }
        return FetusStandard;
    };

    const data = generateData();

    return (
        <>
            <Card title="Biểu đồ chiều dài thai nhi theo tuần" style={{ marginBottom: '20px' }}>
                <Line
                    data={data}
                    xField="week"
                    yField="length"
                    seriesField="category"
                    smooth={true}
                    animation={true}
                    xAxis={{
                        title: { text: 'Tuần Thai' },
                        min: 20,
                        max: 40,
                        tickCount: 11,
                    }}
                    yAxis={{
                        title: { text: 'Chiều Dài (mm)' },
                        min: 40,
                        max: 100,
                    }}
                    legend={{
                        position: 'top',
                    }}
                    color={['#ff4d4f', '#1890ff', '#52c41a', '#d48cff']}
                    lineStyle={(fetalLengthStandard) => {
                        if (fetalLengthStandard.category === 'Giới hạn trên (WHO)') {
                            return { lineDash: [4, 4], stroke: '#ff4d4f' };
                        }
                        if (fetalLengthStandard.category === 'Giới hạn dưới (WHO)') {
                            return { lineDash: [4, 4], stroke: '#1890ff' };
                        }
                        if (fetalLengthStandard.category === 'Chiều dài ước tính') {
                            return { lineDash: [4, 4], stroke: '#d48cff' };
                        }
                        if (fetalLengthStandard.category === 'Chiều dài thực tế') {
                            return { stroke: '#52c41a' };
                        }
                    }}
                    tooltip={{
                        formatter: (fetalLengthStandard) => {
                            return {
                                name: fetalLengthStandard.category,
                                value: `${fetalLengthStandard.length.toFixed(1)}mm`
                            };
                        },
                    }}
                />
            </Card>

            <Row gutter={16}>
                <Col span={12}>
                    <Card
                        hoverable
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
                </Col>
                <Col span={12}>
                    <Card
                        style={{ backgroundColor: '#ffc53d', height: '100%' }}
                    >
                        <h3>Không Ổn Lắm</h3>
                        <p>Có Vẻ Như Em Bé Của Bạn Đang Phát Triển Dưới Mức Trung Bình Một Chút. Hãy Chú Ý Tới Chế Độ Dinh Dưỡng Của Bạn Thân Nhé</p>
                        <a href="#">Tham Khảo Thêm Tại Đây →</a>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default MainContent;