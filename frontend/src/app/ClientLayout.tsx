'use client';

import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <ReduxProvider>
            <AuthGuard>
                <div className="flex min-h-screen">
                    {!isAuthPage && <Sidebar />}
                    <main className={`flex-1 ${!isAuthPage ? 'md:ml-64 pt-16 md:pt-0' : ''} p-4 md:p-8`}>
                        {children}
                    </main>
                </div>
                <Toaster position="bottom-right" toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: '1px solid #27272a'
                    }
                }} />
            </AuthGuard>
        </ReduxProvider>
    );
}
