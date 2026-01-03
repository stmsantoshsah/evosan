// frontend/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav'; // <--- Import this

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Evosan',
  description: 'Personal Growth System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200`}>
        <div className="flex min-h-screen">
          
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <Sidebar />

          {/* Main Content Area */}
          {/* md:ml-64 = Left margin only on Desktop */}
          {/* pb-20 = Padding bottom so content isn't hidden behind Mobile Nav */}
          <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Nav (Hidden on Desktop) */}
          <MobileNav />
          
        </div>
      </body>
    </html>
  );
}