// src/pages/account.tsx
'use client'
import React from 'react';
import { Layout } from 'antd';
import Sidebar from './components/sidebar';
import AccountForm from './components/account-form';
import styles from './page.module.css';

const { Header, Content } = Layout;

const AccountPage: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className={styles.header}>
                <h1>My Account</h1>
            </Header>
            <Layout>
                <Sidebar />
                <Layout style={{ padding: '24px' }}>
                    <Content className={styles.content}>
                        <h2>My details</h2>
                        <AccountForm />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AccountPage;