'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Settings,
  Activity,
  Sparkles,
  Dumbbell,
  Menu,
  X,
  User,
  Cpu,
  Terminal,
  Sun,
  Moon,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/common/contexts/ThemeContext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Protocol', href: '/protocol', icon: Target },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Insights', href: '/insights', icon: Sparkles },
  { name: 'Health', href: '/health', icon: Dumbbell },
  { name: 'Operations', href: '/operations', icon: Cpu },
  { name: 'Codex', href: '/codex', icon: Terminal },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-5 h-5" />
          <span className="text-lg font-bold tracking-tight text-foreground">EVOSAN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40" onClick={closeMobileMenu} />
      )}

      {/* Mobile Slide-out Menu */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-foreground">EVOSAN</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-muted text-primary border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={() => {
              toggleTheme();
              closeMobileMenu();
            }}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground text-sm hover:text-foreground w-full transition-colors rounded-lg hover:bg-muted/50"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <Link
            href="/settings"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground text-sm hover:text-foreground w-full transition-colors rounded-lg hover:bg-muted/50"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-card border-r border-border flex-col fixed left-0 top-0 z-40 transition-colors duration-300">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-foreground">EVOSAN</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-muted text-primary border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground text-sm hover:text-foreground w-full transition-colors rounded-lg hover:bg-muted/50"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground text-sm hover:text-foreground w-full transition-colors rounded-lg hover:bg-muted/50"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
