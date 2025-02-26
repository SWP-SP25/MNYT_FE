'use client'
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingPlan {
    name: string;
    price: number;
    period: string;
    features: PricingFeature[];
    isPopular?: boolean;
    buttonVariant: string;
}

const pricingPlans: PricingPlan[] = [
    {
        name: 'Cơ Bản',
        price: 0,
        period: 'tháng',
        buttonVariant: 'outline-primary',
        features: [
            { text: 'Xem thông tin cơ bản', included: true },
            { text: 'Nhận thông báo quan trọng', included: true },
            { text: 'Tương tác cơ bản', included: true },
            { text: 'Hỗ trợ qua email', included: true },
            { text: 'Các tính năng nâng cao', included: false },
            { text: 'Ưu tiên hỗ trợ 24/7', included: false },
        ]
    },
    {
        name: 'Phổ Thông',
        price: 199000,
        period: 'tháng',
        buttonVariant: 'primary',
        isPopular: true,
        features: [
            { text: 'Tất cả tính năng Cơ Bản', included: true },
            { text: 'Xem thông tin chi tiết', included: true },
            { text: 'Tương tác không giới hạn', included: true },
            { text: 'Hỗ trợ qua điện thoại', included: true },
            { text: 'Các tính năng nâng cao', included: true },
            { text: 'Ưu tiên hỗ trợ 24/7', included: false },
        ]
    },
    {
        name: 'Cao Cấp',
        price: 399000,
        period: 'tháng',
        buttonVariant: 'primary',
        features: [
            { text: 'Tất cả tính năng Phổ Thông', included: true },
            { text: 'Truy cập sớm tính năng mới', included: true },
            { text: 'Hỗ trợ ưu tiên 24/7', included: true },
            { text: 'Tư vấn trực tiếp', included: true },
            { text: 'Báo cáo chi tiết', included: true },
            { text: 'Tùy chỉnh theo yêu cầu', included: true },
        ]
    }
];

const MembershipPage: React.FC = () => {
    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Gói Thành Viên</h1>
                <p className="lead text-muted">
                    Chọn gói phù hợp với nhu cầu của bạn
                </p>
            </div>

            <Row className="justify-content-center">
                {pricingPlans.map((plan, index) => (
                    <Col key={index} lg={4} md={6} className="mb-4">
                        <Card className={`h-100 ${plan.isPopular ? 'border-primary' : ''}`}>
                            {plan.isPopular && (
                                <div className="card-header text-center text-primary">
                                    <strong>Phổ biến nhất</strong>
                                </div>
                            )}
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="text-center">
                                    <h3 className="mb-4">{plan.name}</h3>
                                    <h2 className="display-4 mb-3">
                                        {plan.price.toLocaleString()}đ
                                        <small className="text-muted fs-6">/{plan.period}</small>
                                    </h2>
                                </Card.Title>
                                <Card.Text as="div" className="flex-grow-1">
                                    <ul className="list-unstyled">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="mb-3 d-flex align-items-center">
                                                <FaCheck className={`me-2 ${feature.included ? 'text-success' : 'text-muted'}`} />
                                                <span className={feature.included ? '' : 'text-muted'}>
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Text>
                                <Button
                                    variant={plan.buttonVariant}
                                    className="w-100 mt-auto py-2"
                                >
                                    {plan.price === 0 ? 'Dùng Miễn Phí' : 'Đăng Ký Ngay'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MembershipPage;