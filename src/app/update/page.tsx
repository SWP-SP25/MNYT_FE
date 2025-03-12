'use client'
import React from 'react';
import { Layout, Row, Col } from 'antd';
import { Sidebar } from '../dashboard/sidebar/app-sidebar';
import { UpdateForm } from '../dashboard/components/form-update';
import { useRouter } from 'next/navigation';

const { Content } = Layout;

const UpdatePage: React.FC = () => {
    const router = useRouter();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Row>
                <Col span={5}>
                    <Sidebar />
                </Col>
                <Col span={19}>
                    <Content style={{ padding: '20px' }}>
                        <UpdateForm onClose={() => router.push('/')} />
                    </Content>
                </Col>
            </Row>
        </Layout>
    );
};

export default UpdatePage; 