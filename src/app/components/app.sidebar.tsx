'use client'
import React from 'react';
import { Menu, Card, Checkbox, Space } from 'antd';
import { CalendarOutlined, LineChartOutlined, DashboardOutlined } from '@ant-design/icons';

export const Sidebar: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['1']}
                style={{ marginBottom: '20px' }}
            >
                <Menu.Item key="1" icon={<CalendarOutlined />}>
                    Development Milestone
                </Menu.Item>
                <Menu.Item key="2" icon={<LineChartOutlined />}>
                    Fetal Weight Estimation
                </Menu.Item>
                <Menu.Item key="3" icon={<DashboardOutlined />}>
                    View Dashboard
                </Menu.Item>
            </Menu>

            <Card
                style={{
                    backgroundColor: '#52c41a',
                    color: 'white',
                    marginBottom: '20px'
                }}
            >
                Tuần thai thứ 4
            </Card>

            <Menu
                mode="vertical"
                style={{ marginBottom: '20px' }}
                title="Tips for this week"
            >
                <Menu.Item key="4">Only For You</Menu.Item>
                <Menu.Item key="5">Important Milestone</Menu.Item>
            </Menu>

            <Card title="Những việc cần làm" style={{ backgroundColor: '#237804', color: 'white' }}>
                <Space direction="vertical">
                    <Checkbox style={{ color: 'white' }}>Đi khám thai</Checkbox>
                    <Checkbox style={{ color: 'white' }}>Đi tiêm phòng</Checkbox>
                    <Checkbox style={{ color: 'white' }}>Empty Task</Checkbox>
                    <Checkbox style={{ color: 'white' }}>Empty Task</Checkbox>
                </Space>
            </Card>
        </div>
    );
};
export default Sidebar;