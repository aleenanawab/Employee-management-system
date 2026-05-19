'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, DollarSign,
  Settings, UserCircle, LogOut, Zap, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: Users,           label: 'Employees',   href: '/employees' },
  { icon: Building2,       label: 'Departments', href: '/departments' },
  { icon: DollarSign,      label: 'Salary',      href: '/salary' },
  { icon: UserCircle,      label: 'Profile',     href: '/profile' },
  { icon: Settings,        label: 'Settings',    href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? '';
  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    hr_manager: 'HR Manager',
    employee_viewer: 'Viewer',
  };

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
      className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col"
    >
      {/* Logo */}
      <div style={{ borderBottom: '1px solid var(--border)' }} className="flex h-16 items-center gap-3 px-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 shadow-lg">
          <Zap size={16} className="text-white" fill="white" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 blur-md opacity-40 -z-10" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight" style={{ color: 'var(--fg)' }}>EMS Pro</h1>
          <p className="text-[10px] font-medium" style={{ color: 'var(--neon-purple)' }}>Enterprise Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-muted)' }}>
          Navigation
        </p>
        <div className="space-y-0.5">
          {menuItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 + 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive ? 'text-white' : ''
                  )}
                  style={!isActive ? { color: 'var(--fg-muted)' } : {}}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #6d28d9, #059669)',
                        boxShadow: '0 0 16px rgba(109,40,217,0.35), 0 0 32px rgba(5,150,105,0.15)',
                      }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                    />
                  )}
                  {/* Hover background */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'var(--primary-light)' }}
                    />
                  )}
                  <item.icon size={16} className="relative z-10 shrink-0" />
                  <span className="relative z-10 group-hover:text-[var(--primary-text)] transition-colors" style={isActive ? {} : { color: 'inherit' }}>{item.label}</span>
                  {isActive && <ChevronRight size={13} className="relative z-10 ml-auto opacity-60" />}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--border)' }} className="p-3 space-y-1">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ background: 'var(--primary-light)' }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-xs font-bold text-white shadow-sm">
            {session?.user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold" style={{ color: 'var(--fg)' }}>
              {session?.user?.name ?? 'User'}
            </p>
            <p className="truncate text-[10px] capitalize" style={{ color: 'var(--fg-muted)' }}>
              {roleLabel[role] ?? role}
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
          style={{ color: 'var(--fg-muted)' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}
