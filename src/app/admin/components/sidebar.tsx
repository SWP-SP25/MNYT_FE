"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BsGrid,
  BsPersonFill,
  BsCalendarCheck,
  BsFileText,
  BsChevronRight,
  BsChevronLeft,
} from "react-icons/bs";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {collapsed ? <BsChevronRight /> : <BsChevronLeft />}
      </button>

      {/* Dashboards */}
      <div className={styles.menuGroup}>
        <h3>Dashboards</h3>
        <nav>
          <Link href="/admin" className={styles.menuItem}>
            <BsGrid className={styles.icon} />
            <span className={styles.itemText}>Main</span>
            <span className={styles.tooltip}>Main</span>
          </Link>
          <Link href="/admin/insights" className={styles.menuItem}>
            <BsGrid className={styles.icon} />
            <span className={styles.itemText}>User Insights</span>
            <span className={styles.tooltip}>User Insights</span>
          </Link>
        </nav>
      </div>

      {/* Management */}
      <div className={styles.menuGroup}>
        <h3>Management</h3>
        <nav>
          <Link href="/admin/content" className={styles.menuItem}>
            <BsFileText className={styles.icon} />
            <span className={styles.itemText}>Home page content</span>
            <span className={styles.tooltip}>Home page content</span>
          </Link>
          <Link href="/admin/tips" className={styles.menuItem}>
            <BsFileText className={styles.icon} />
            <span className={styles.itemText}>Tips of the week</span>
            <span className={styles.tooltip}>Tips of the week</span>
          </Link>
          <Link href="/admin/users" className={styles.menuItem}>
            <BsPersonFill className={styles.icon} />
            <span className={styles.itemText}>Users</span>
            <span className={styles.tooltip}>Users</span>
          </Link>
        </nav>
      </div>

      {/* Default Schedule */}
      <div className={styles.menuGroup}>
        <h3>Default Schedule</h3>
        <nav>
          <Link href="/admin/schedule/single" className={styles.menuItem}>
            <BsCalendarCheck className={styles.icon} />
            <span className={styles.itemText}>Single birth</span>
            <span className={styles.tooltip}>Single birth</span>
          </Link>
          <Link href="/admin/schedule/twin" className={styles.menuItem}>
            <BsCalendarCheck className={styles.icon} />
            <span className={styles.itemText}>Twin birth</span>
            <span className={styles.tooltip}>Twin birth</span>
          </Link>
          <Link href="/admin/schedule/reminder" className={styles.menuItem}>
            <BsCalendarCheck className={styles.icon} />
            <span className={styles.itemText}>Schedule&apos;s reminder</span>
            <span className={styles.tooltip}>Schedule&apos;s reminder</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};
