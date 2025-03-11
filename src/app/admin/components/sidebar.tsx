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
                    <Link href="/admin/insights" className={styles.menuItem}>
                        <BsGrid />
                        <span>User Insights</span>
                    </Link>
                </nav>
            </div>

            <div className={styles.menuGroup}>
                <h3>Management</h3>
                <nav>
                    <Link href="/admin/content" className={styles.menuItem}>
                        <BsFileText />
                        <span>Home page content</span>
                    </Link>
                    <Link href="/admin/tips" className={styles.menuItem}>
                        <BsFileText />
                        <span>Tips of the week</span>
                    </Link>
                    <Link href="/admin/users" className={styles.menuItem}>
                        <BsPersonFill />
                        <span>Users</span>
                    </Link>
                </nav>
            </div>

            <div className={styles.menuGroup}>
                <h3>Default Schedule</h3>
                <nav>
                    <Link href="/admin/schedule/single" className={styles.menuItem}>
                        <BsCalendarCheck />
                        <span>Single birth</span>
                    </Link>
                    <Link href="/admin/schedule/twin" className={styles.menuItem}>
                        <BsCalendarCheck />
                        <span>Twin birth</span>
                    </Link>
                    <Link href="/admin/schedule/reminder" className={styles.menuItem}>
                        <BsCalendarCheck />
                        <span>Schedule's reminder</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};