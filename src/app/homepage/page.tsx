'use client';

import Dashboard from '@/app/components/dashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return <Dashboard />;
}

