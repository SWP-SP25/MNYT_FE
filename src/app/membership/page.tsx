"use client";
import styles from "./page.module.css";
import {
  FaBabyCarriage,
  FaHeart,
  FaCrown,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ActiveMembership {
  planId: number;
  // Add other membership details as needed
}

const Membership = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMembership, setActiveMembership] =
    useState<ActiveMembership | null>(null);

  useEffect(() => {
    const fetchActiveMembership = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setActiveMembership(data);
        }
      } catch (err) {
        console.error("Error fetching active membership:", err);
      }
    };

    fetchActiveMembership();
  }, [user]);

  const handlePayment = async (planId: number) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const membershipResponse = await fetch(
        `https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${user.id}`
      );
      if (membershipResponse.ok) {
        const membershipData = await membershipResponse.json();
        console.log("membershipData", membershipData.data);

        setActiveMembership(membershipData.data);
      }

      if (activeMembership == null) {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: user.id,
            planId: planId,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment failed");
        }

        // Handle successful payment
        alert("Payment successful!");
        // Refresh active membership after successful payment
      }
      else {
        alert("This account has existing membership")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyle = (planId: number) => {
    if (!activeMembership) return styles.button;
    return activeMembership.planId === planId
      ? styles.defaultButton
      : styles.button;
  };

  const getButtonText = (planId: number) => {
    if (!activeMembership) return "Đăng ký ngay";
    if (activeMembership.planId === planId) return "Gói Hiện Tại";
    if (activeMembership.planId > planId) return "Hạ cấp";
    return "Nâng cấp ngay";
  };

  const getButtonType = (planId: number) => {
    if (!activeMembership) return "primary";
    if (activeMembership.planId === planId) return "default";
    if (activeMembership.planId > planId) return "secondary";
    return "primary";
  };

  return (
    <div className={styles.membershipContainer}>
      <h1 className={styles.title}>Chọn Gói Đồng Hành</h1>
      <p className={`${styles.subtitle} fancy-font`}>
        Hãy để chúng tôi đồng hành cùng bạn trong hành trình làm mẹ tuyệt vời
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.membershipPlans}>
        {/* Gói Cơ Bản */}
        <div className={styles.plan}>
          <div className={styles.planTitle}>
            <FaBabyCarriage size={24} />
            <h2>Cơ Bản</h2>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Theo dõi lịch thai kỳ cơ bản</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Nhắc nhở lịch khám định kỳ</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tham gia cộng đồng mẹ bầu</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tra cứu thông tin cơ bản</p>
            </div>
            <div className={styles.featureItem}>
              <FaTimes color="#E53E3E" />
              <p>Tư vấn dinh dưỡng chi tiết</p>
            </div>
            <div className={styles.featureItem}>
              <FaTimes color="#E53E3E" />
              <p>Gói tập luyện cho mẹ bầu</p>
            </div>
          </div>
          <button
            className={`${getButtonStyle(7)} ${styles[getButtonType(7)]}`}
            onClick={() => handlePayment(7)}
            disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : getButtonText(7)}
          </button>
        </div>

        {/* Gói Tiện Ích */}
        <div className={styles.plan}>
          <div className={styles.planTitle}>
            <FaHeart size={24} />
            <h2>Tiện Ích</h2>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tất cả quyền lợi gói Cơ Bản</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Lịch dinh dưỡng theo tuần</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Gói bài tập cho mẹ bầu</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tư vấn trực tuyến</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Theo dõi cân nặng & dinh dưỡng</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Nhận thông báo quan trọng</p>
            </div>
          </div>
          <button
            className={`${getButtonStyle(8)} ${styles[getButtonType(8)]}`}
            onClick={() => handlePayment(8)}
            disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : getButtonText(8)}
          </button>
        </div>

        {/* Gói Cao Cấp */}
        <div className={styles.plan}>
          <div className={styles.bestValue}>Phổ biến nhất</div>
          <div className={styles.planTitle}>
            <FaCrown size={24} />
            <h2>Cao Cấp</h2>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tất cả quyền lợi gói Tiện Ích</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Tư vấn bác sĩ 24/7</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Gói khám thai định kỳ</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Hỗ trợ đặt lịch ưu tiên</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Quà tặng cho mẹ và bé</p>
            </div>
            <div className={styles.featureItem}>
              <FaCheck color="#279357" />
              <p>Chế độ chăm sóc đặc biệt</p>
            </div>
          </div>
          <button
            className={`${getButtonStyle(9)} ${styles[getButtonType(9)]}`}
            onClick={() => handlePayment(9)}
            disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : getButtonText(9)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Membership;
