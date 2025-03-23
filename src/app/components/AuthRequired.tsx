'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AuthRequiredProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;  // thêm className để linh hoạt trong styling
}

export const AuthRequired: React.FC<AuthRequiredProps> = ({
    children,
    onClick,
    className
}) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        if (!loading && !user) {
            e.preventDefault();
            router.push('/authenticate');
            return;
        }
        onClick?.();
    };

    return (
        <div onClick={handleClick} className={className}>
            {children}
        </div>
    );
};