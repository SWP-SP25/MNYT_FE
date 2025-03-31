'use client'
import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import { MainContent } from './maincontent';
import { UpdateForm } from './form-update';

const { Content } = Layout;

const Dashboard: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Row>
                <Col span={isFormVisible ? 12 : 24} offset={isFormVisible ? 6 : 0}>
                    <Content style={{ padding: '10px', margin: '0 auto', maxWidth: '1200px' }}>
                        <MainContent />
                    </Content>
                </Col>
                {isFormVisible && (
                    <Col span={6}>
                        <UpdateForm />
                    </Col>
                )}
            </Row>
        </Layout>
    );
};

export default Dashboard;