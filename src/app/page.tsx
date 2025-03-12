'use client';
import { useAuth } from "@/hooks/useAuth";
import PublicHomePage from "./homepage/public/public-homepage";
import AuthenticatedHomePage from "./homepage/authentication/auth-homepage";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Có lỗi xảy ra: {error}</p>
      </div>
    );
  }
  console.log(user);

  return (
    <main className={styles.main}>
      {user ? <AuthenticatedHomePage /> : <PublicHomePage />}
    </main>
  );
}
