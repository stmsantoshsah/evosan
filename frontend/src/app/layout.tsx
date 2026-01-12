import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'EVOSAN - System',
    description: 'Personal Evolution OS',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-zinc-950 text-zinc-100`}>
                <ReduxProvider>
                    <div className="flex bg-zinc-950 min-h-screen">
                        <Sidebar />
                        <main className="flex-1 md:ml-64 p-8">
                            {children}
                        </main>
                    </div>
                </ReduxProvider>
            </body>
        </html>
    );
}
