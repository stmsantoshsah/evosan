import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
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
        <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
            <body className="bg-zinc-950 text-white antialiased" suppressHydrationWarning>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
