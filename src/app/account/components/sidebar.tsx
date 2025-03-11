// src/components/Sidebar.tsx
'use client'
import React from 'react';
import { Menu } from 'antd';
import styles from './sidebar.module.css'; // Tạo tệp CSS cho Sidebar nếu cần

const Sidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <Menu mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">My details</Menu.Item>
                <Menu.Item key="2">My address book</Menu.Item>
                <Menu.Item key="3">My orders</Menu.Item>
                <Menu.Item key="4">My newsletters</Menu.Item>
                <Menu.Item key="5">Account settings</Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;