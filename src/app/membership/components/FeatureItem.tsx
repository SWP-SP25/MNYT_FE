import { FaCheck, FaTimes } from 'react-icons/fa';
import styles from '../page.module.css';

interface FeatureItemProps {
    isIncluded: boolean;
    text: string;
}

const FeatureItem = ({ isIncluded, text }: FeatureItemProps) => {
    return (
        <div className={styles.featureItem}>
            {isIncluded ? (
                <FaCheck color="#279357" />
            ) : (
                <FaTimes color="#E53E3E" />
            )}
            <p>{text}</p>
        </div>
    );
};

export default FeatureItem; 