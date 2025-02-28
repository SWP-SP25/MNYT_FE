'use client'
import React from 'react';
import { Menu, Card, Checkbox, Space } from 'antd';
import { CalendarOutlined, LineChartOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
    {
        key: 'home',
        icon: <HomeOutlined />,
        label: 'Trang chủ',
    },
    {
        key: 'calendar',
        icon: <CalendarOutlined />,
        label: 'Lịch khám',
    },
    {
        key: 'blog',
        icon: <BookOutlined />,
        label: 'Blog',
    },
    {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ sơ',
    },
];

export const Sidebar = () => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            items={items}
            style={{ height: '100%' }}
        />
    );
};

export default Sidebar;