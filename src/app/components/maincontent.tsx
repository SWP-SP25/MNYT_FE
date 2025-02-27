'use client'
import React from 'react';
import { Card, Row, Col } from 'antd';
import { Line } from '@ant-design/plots';

export const MainContent: React.FC = () => {
    // Data cho biểu đồ
    const data = {
        // Thêm dữ liệu biểu đồ của bạn ở đây
    };

    return (
        <>
            <Card title="Biểu đồ tăng trưởng của thai nhi" style={{ marginBottom: '20px' }}>
                <Line
                    data={data}
                    // Cấu hình biểu đồ
                    xField="week"
                    yField="weight"
                    seriesField="category"
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