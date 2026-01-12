'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../slices/authSlice';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        if (!isAuthenticated && !isAuthPage) {
            router.push('/login');
        } else if (isAuthenticated && isAuthPage) {
            router.push('/');
        }
    }, [isAuthenticated, isAuthPage, router]);

    return <>{children}</>;
};
