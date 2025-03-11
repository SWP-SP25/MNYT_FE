'use client'
import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import { Sidebar } from '../sidebar/app-sidebar';
import { MainContent } from './maincontent';
import { UpdateForm } from './form.update';

const { Content } = Layout;

const Dashboard: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Row>
                <Col span={5}>
                    <Sidebar />
                </Col>
                <Col span={isFormVisible ? 13 : 19}>
                    <Content style={{ padding: '20px' }}>
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