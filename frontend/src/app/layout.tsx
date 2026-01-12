import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Sidebar from '@/common/components/sidebar/SideBar';
import { ReduxProvider } from '@/store/providers/ReduxProvider';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-heading',
});

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
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="bg-zinc-950 text-white antialiased">
                <ReduxProvider>
                    <div className="flex min-h-screen">
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
