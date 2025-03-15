'use client';

import React from 'react';
import Link from 'next/link';
import { BsGrid, BsPersonFill, BsCalendarCheck, BsFileText } from 'react-icons/bs';
import styles from './sidebar.module.css';

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.menuGroup}>
                <h3>Dashboards</h3>
                <nav>
                    <Link href="/admin" className={styles.menuItem}>
                        <BsGrid />
                        <span>Main</span>
                    </Link>
                </nav>
            </div>

            <div className={styles.menuGroup}>
                <h3>Management</h3>
                <nav>
                    <Link href="/admin/blog-manager" className={styles.menuItem}>
                        <BsFileText />
                        <span>Blog</span>
                    </Link>
                    <Link href="/admin/account-manager" className={styles.menuItem}>
                        <BsGrid />
                        <span>Account</span>
                    </Link>
                </nav>
            </div>

            <div className={styles.menuGroup}>
                <h3>Configure</h3>
                <nav>
                    <Link href="/admin/pregnacy-standard-config" className={styles.menuItem}>
                        <BsCalendarCheck />
                        <span>Pregnacy Standard</span>
                    </Link>
                    <Link href="/admin/schedule-template-config" className={styles.menuItem}>
                        <BsCalendarCheck />
                        <span>Schedule Template</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};