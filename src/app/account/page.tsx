'use client'
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './components/sidebar';
import AccountForm from './components/account-form';
import styles from './page.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const { Header, Content } = Layout;

const AccountPage: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userData = Cookies.get("user");
        if (userData) {
            const user = JSON.parse(userData);
            setIsAdmin(user.role === "Admin");
        } else {
            router.push('/login');
        }
    }, [router]);

    if (!isAdmin) {
        return <div>Bạn không có quyền truy cập trang này.</div>;
    }

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