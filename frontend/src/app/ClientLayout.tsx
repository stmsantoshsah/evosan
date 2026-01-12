'use client';

import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <ReduxProvider>
            <AuthGuard>
                <div className="flex min-h-screen">
                    {!isAuthPage && <Sidebar />}
                    <main className={`flex-1 ${!isAuthPage ? 'md:ml-64' : ''} p-8`}>
                        {children}
                    </main>
                </div>
            </AuthGuard>
        </ReduxProvider>
    );
}
