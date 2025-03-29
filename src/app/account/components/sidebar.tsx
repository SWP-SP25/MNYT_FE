"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./sidebar.module.css";

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <h2>Tài khoản</h2>
      <ul className={styles.tabList}>
        <li
          className={`${styles.tabItem} ${
            pathname === "/account" ? styles.activeTab : ""
          }`}
        >
          <Link href="/account">Thông tin tài khoản</Link>
        </li>
        <li
          className={`${styles.tabItem} ${
            pathname === "/account/pregnancy-history" ? styles.activeTab : ""
          }`}
        >
          <Link href="/account/pregnancy-history">Lịch sử thai kỳ</Link>
        </li>
        <li
          className={`${styles.tabItem} ${
            pathname === "/account/saved-blogs" ? styles.activeTab : ""
          }`}
        >
          <Link href="/account/saved-blogs">Bài viết đã lưu</Link>
        </li>
        <li
          className={`${styles.tabItem} ${
            pathname === "/account/membership-history" ? styles.activeTab : ""
          }`}
        >
          <Link href="/account/membership-history">Gói thành viên</Link>
        </li>
      </ul>
    </div>
  );
}
