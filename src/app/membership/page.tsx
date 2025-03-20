'use client';
import styles from './page.module.css';
import { FaBabyCarriage, FaHeart, FaCrown } from 'react-icons/fa';
import PlanCard from './components/PlanCard';
import useAxios from '@/hooks/useFetchAxios';
import { MembersipOnwers } from '@/types/membershipOwner';
import { useAuth } from '@/hooks/useAuth';

const basicFeatures = [
    { isIncluded: true, text: 'Theo dõi lịch thai kỳ cơ bản' },
    { isIncluded: true, text: 'Nhắc nhở lịch khám định kỳ' },
    { isIncluded: true, text: 'Tham gia cộng đồng mẹ bầu' },
    { isIncluded: true, text: 'Tra cứu thông tin cơ bản' },
    { isIncluded: false, text: 'Tư vấn dinh dưỡng chi tiết' },
    { isIncluded: false, text: 'Gói tập luyện cho mẹ bầu' }
];

const standardFeatures = [
    { isIncluded: true, text: 'Tất cả quyền lợi gói Cơ Bản' },
    { isIncluded: true, text: 'Lịch dinh dưỡng theo tuần' },
    { isIncluded: true, text: 'Gói bài tập cho mẹ bầu' },
    { isIncluded: true, text: 'Tư vấn trực tuyến' },
    { isIncluded: true, text: 'Theo dõi cân nặng & dinh dưỡng' },
    { isIncluded: true, text: 'Nhận thông báo quan trọng' }
];

const premiumFeatures = [
    { isIncluded: true, text: 'Tất cả quyền lợi gói Tiện Ích' },
    { isIncluded: true, text: 'Tư vấn bác sĩ 24/7' },
    { isIncluded: true, text: 'Gói khám thai định kỳ' },
    { isIncluded: true, text: 'Hỗ trợ đặt lịch ưu tiên' },
    { isIncluded: true, text: 'Quà tặng cho mẹ và bé' },
    { isIncluded: true, text: 'Chế độ chăm sóc đặc biệt' }
];

const Membership = () => {
    // get membership của user đã login
    const { user } = useAuth();
    const { response: membershipData, loading, error } = useAxios<MembersipOnwers>(
        {
            url: user?.id ? `https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${user.id}` : '',
            method: 'get'
        }
    );

    console.log("Account membership:", membershipData?.data);

    return (
        <div className={styles.membershipContainer}>
            <h1 className={styles.title}>Chọn Gói Đồng Hành</h1>
            <p className={`${styles.subtitle} fancy-font`}>
                Hãy để chúng tôi đồng hành cùng bạn trong hành trình làm mẹ tuyệt vời
            </p>

            <div className={styles.membershipPlans}>
                <PlanCard
                    icon={FaBabyCarriage}
                    title="Cơ Bản"
                    features={basicFeatures}
                    buttonText="Gói Hiện Tại"
                    isDefault={true}
                />

                <PlanCard
                    icon={FaHeart}
                    title="Tiện Ích"
                    features={standardFeatures}
                    buttonText="Nâng cấp ngay"
                />

                <PlanCard
                    icon={FaCrown}
                    title="Cao Cấp"
                    features={premiumFeatures}
                    buttonText="Trải nghiệm ngay"
                    isBestValue={true}
                />
            </div>
        </div>
    );
};

export default Membership;
