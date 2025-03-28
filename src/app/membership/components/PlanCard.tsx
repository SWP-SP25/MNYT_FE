import { IconType } from 'react-icons';
import styles from '../page.module.css';
import FeatureItem from './FeatureItem';

interface Feature {
    isIncluded: boolean;
    text: string;
}

interface PlanCardProps {
    icon: IconType;
    title: string;
    features: Feature[];
    buttonText: string;
    isDefault?: boolean;
    isBestValue?: boolean;
    onButtonClick?: () => void;
    price: number;
    disabled?: boolean;
}

const PlanCard = ({
    icon: Icon,
    title,
    features,
    buttonText,
    isDefault,
    isBestValue,
    onButtonClick,
    price,
    disabled
}: PlanCardProps) => {
    return (
        <div className={styles.plan}>
            {isBestValue && <div className={styles.bestValue}>Phổ biến nhất</div>}
            <div className={styles.planTitle}>
                <Icon size={24} />
                <h2>{title}</h2>
            </div>
            <div className={styles.price}>
                {price.toLocaleString('vi-VN')}đ
            </div>
            <div className={styles.features}>
                {features.map((feature, index) => (
                    <FeatureItem
                        key={index}
                        isIncluded={feature.isIncluded}
                        text={feature.text}
                    />
                ))}
            </div>
            <button 
                className={`${isDefault ? styles.defaultButton : styles.button} ${disabled ? styles.disabledButton : ''}`}
                onClick={onButtonClick}
                disabled={disabled}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default PlanCard; 