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

    const handlePayment = async (planId: number) => {
        if (!user?.id) return;
        
        try {
            const response = await fetch('https://api-mnyt.purintech.id.vn/api/CashPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: user.id,
                    membershipPlanId: planId
                })
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            // Handle successful payment
            alert('Thanh toán thành công!');
            // You might want to refresh the membership data here
        } catch (error) {
            console.error('Payment error:', error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        }
    };

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
    const getButtonText = (planId: number, index: number) => {
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
            return "Gói hiện tại";
        }

        if (!isActive || isExpired) {
            return "Đăng ký ngay";
        }

        // If user has an active plan but wants to upgrade
        if (currentPlanId && planId > currentPlanId) {
            return "Nâng cấp ngay";
        }

        // For lower level plans when user has a higher level
        if (currentPlanId && planId < currentPlanId) {
            return "Đã có";
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
                        buttonText={getButtonText(plan.id, index)}
                        isDefault={Boolean(plan.id === currentPlanId || (currentPlanId && plan.id < currentPlanId))}
                        isBestValue={index === 2}
                        onButtonClick={() => handlePayment(plan.id)}
                        price={plan.price}
                        disabled={getButtonText(plan.id, index) === "Đã có" || getButtonText(plan.id, index) === "Gói hiện tại"}
                    />
                ))}
            </div>
        </div>
    );
};

export default Membership;
