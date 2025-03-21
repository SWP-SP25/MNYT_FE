'use client';
import styles from './page.module.css';
import { FaBabyCarriage, FaHeart, FaCrown } from 'react-icons/fa';
import PlanCard from './components/PlanCard';
import useAxios from '@/hooks/useFetchAxios';
import { MembersipOnwers } from '@/types/membershipOwner';
import { useAuth } from '@/hooks/useAuth';
import { MembershipPlans } from '@/types/membershipPlan';

const Membership = () => {
    // get membership của user đã login
    const { user } = useAuth();
    const { response: membershipData, loading, error } = useAxios<MembersipOnwers>(
        {
            url: user?.id ? `https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${user.id}` : '',
            method: 'get'
        }
    );

    const {response: membershipView, error: membershipError, loading: membershipLoading} = useAxios<MembershipPlans>(
        {
            url: 'https://api-mnyt.purintech.id.vn/api/MembershipPlan',
            method: 'get'
        });

    if (membershipLoading) {
        return <div className={styles.membershipContainer}>Loading...</div>;
    }

    if (membershipError) {
        return <div className={styles.membershipContainer}>Error loading membership plans</div>;
    }

    const plans = membershipView?.data || [];
    const currentMembership = membershipData?.data;
    const currentPlanId = currentMembership?.membershipPlanId;

    // Function to convert description into features array
    const getFeaturesFromDescription = (description: string) => {
        return description.split('.').map(feature => ({
            isIncluded: true,
            text: feature.trim()
        })).filter(feature => feature.text.length > 0);
    };

    // Function to determine button text based on membership status
    const getButtonText = (planId: number) => {
        if (!currentMembership) {
            return "Đăng ký ngay";
        }

        const isActive = currentMembership.status === "Active";
        const isExpired = new Date(currentMembership.endDate) < new Date();
        const isCurrentPlan = planId === currentPlanId;

        if (isCurrentPlan) {
            if (isExpired) {
                return "Gia hạn ngay";
            }
            return "Gói Hiện Tại";
        }

        if (!isActive || isExpired) {
            return "Đăng ký ngay";
        }

        // If user has an active plan but wants to upgrade
        if (planId > currentPlanId) {
            return "Nâng cấp ngay";
        }

        return "Đăng ký ngay";
    };

    return (
        <div className={styles.membershipContainer}>
            <h1 className={styles.title}>Chọn Gói Đồng Hành</h1>
            <p className={`${styles.subtitle} fancy-font`}>
                Hãy để chúng tôi đồng hành cùng bạn trong hành trình làm mẹ tuyệt vời
            </p>

            <div className={styles.membershipPlans}>
                {plans.map((plan, index) => (
                    <PlanCard
                        key={plan.id}
                        icon={index === 0 ? FaBabyCarriage : index === 1 ? FaHeart : FaCrown}
                        title={plan.name}
                        features={getFeaturesFromDescription(plan.description)}
                        buttonText={getButtonText(plan.id)}
                        isDefault={plan.id === currentPlanId}
                        isBestValue={index === 2}
                    />
                ))}
            </div>
        </div>
    );
};

export default Membership;
