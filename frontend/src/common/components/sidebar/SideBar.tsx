'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, CheckSquare, Settings, Activity, Sparkles, Dumbbell, Menu, X, User, Cpu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Habits', href: '/habits', icon: CheckSquare },
    { name: 'Insights', href: '/insights', icon: Sparkles },
    { name: 'Health', href: '/health', icon: Dumbbell },
    { name: 'Operations', href: '/operations', icon: Cpu },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="text-emerald-500 w-5 h-5" />
                    <span className="text-lg font-bold tracking-tight text-zinc-100">EVOSAN</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Slide-out Menu */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex-col z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
                    <Activity className="text-emerald-500 w-6 h-6" />
                    <span className="text-xl font-bold tracking-tight text-zinc-100">EVOSAN</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <Link
                        href="/settings"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-zinc-500 text-sm hover:text-zinc-300 w-full transition-colors"
                    >
                        <Settings size={18} />
                        Settings
                    </Link>
                </div>
            </aside>

            {/* Desktop Sidebar (unchanged) */}
            <aside className="hidden md:flex w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex-col fixed left-0 top-0 z-40">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
                    <Activity className="text-emerald-500 w-6 h-6" />
                    <span className="text-xl font-bold tracking-tight text-zinc-100">EVOSAN</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-zinc-500 text-sm hover:text-zinc-300 w-full transition-colors">
                        <Settings size={18} />
                        Settings
                    </Link>
                </div>
            </aside>
        </>
    );
}
