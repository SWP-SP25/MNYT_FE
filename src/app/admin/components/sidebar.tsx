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
import { AccountBookOutlined, CarryOutOutlined, FundProjectionScreenOutlined } from "@ant-design/icons";
import { ClassNames } from "@emotion/react";
import PaidIcon from '@mui/icons-material/Paid';

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
          <Link href="/admin/blog" className={styles.menuItem}>
            <BsFileText />
            <span>Blogs</span>
          </Link>
          <Link href="/admin/account" className={styles.menuItem}>
            <BsPersonFill />
            <span>Accounts</span>
          </Link>
        </nav>
      </div>

      <div className={styles.menuGroup}>
        <h3>Configure</h3>
        <nav>
          <Link href="/admin/schedule-template" className={styles.menuItem}>
          <CarryOutOutlined />
            <span>Schedule Template</span>
          </Link>
          <Link href="/admin/membership-plan" className={styles.menuItem}>
          <AccountBookOutlined />
            <span>Membership Plan</span>
          </Link>
          <Link href="/admin/preganacy-standard" className={styles.menuItem}>
          <FundProjectionScreenOutlined />
            <span>Pregnancy Standard</span>
          </Link>
        </nav>
      </div>
      <div className={styles.menuGroup}> 
        <h3>Report</h3>
        <nav>
          <Link href="/admin/membership-sale" className={styles.menuItem}>
          <PaidIcon fontSize="small"/>
          <span>Membership Report</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};
