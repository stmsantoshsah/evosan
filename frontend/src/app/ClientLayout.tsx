'use client';

import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isFocusPage = pathname === '/focus';
    const shouldHideSidebar = isAuthPage || isFocusPage;

    return (
        <ReduxProvider>
            <AuthGuard>
                <div className="flex min-h-screen">
                    {!shouldHideSidebar && <Sidebar />}
                    <main className={`flex-1 ${!shouldHideSidebar ? 'md:ml-64 pt-16 md:pt-0' : ''} ${isFocusPage ? 'p-0' : 'p-4 md:p-8'}`}>
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
