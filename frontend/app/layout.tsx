// frontend/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar'; // Import the sidebar

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
          {/* 1. The Sidebar (Fixed width) */}
          <Sidebar />

          {/* 2. The Main Content (Fills rest of screen) */}
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}