'use client'
import React from 'react';
import { Layout, Row, Col } from 'antd';
import { Sidebar } from './app.sidebar';
import { MainContent } from './maincontent';
import { UpdateForm } from './form.update';

const { Content } = Layout;

const Dashboard: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Row>
                <Col span={5}>
                    <Sidebar />
                </Col>
                <Col span={13}>
                    <Content style={{ padding: '20px' }}>
                        <MainContent />
                    </Content>
                </Col>
                <Col span={6}>
                    <UpdateForm />
                </Col>
            </Row>
        </Layout>
    );
};

export default Dashboard;