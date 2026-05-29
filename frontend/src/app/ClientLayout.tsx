'use client';

import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/common/contexts/ThemeContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' || pathname === '/signup' || pathname === '/reset-password';
  const isFocusPage = pathname === '/focus';
  const shouldHideSidebar = isAuthPage || isFocusPage;

  return (
    <ReduxProvider>
      <ThemeProvider>
        <AuthGuard>
          <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {!shouldHideSidebar && <Sidebar />}
            <main
              className={`flex-1 ${!shouldHideSidebar ? 'md:ml-64 pt-16 md:pt-0' : ''} ${(isFocusPage || isAuthPage) ? 'p-0' : 'p-4 md:p-8'}`}
            >
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" />
        </AuthGuard>
      </ThemeProvider>
    </ReduxProvider>
  );
}
