'use client';

import { useSession, signOut } from 'next-auth/react';
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface HeaderProps { onMenuClick: () => void; }

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? '';
  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    hr_manager: 'HR Manager',
    employee_viewer: 'Viewer',
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-6"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          style={{ color: 'var(--fg-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary-text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
          style={{ color: 'var(--fg-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-light)';
            e.currentTarget.style.color = 'var(--primary-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--fg-muted)';
          }}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px" style={{ background: 'var(--border)' }} />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 border"
              style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--neon-purple)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(109,40,217,0.15)';
                e.currentTarget.style.background = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-emerald-500 text-white text-xs font-bold">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none" style={{ color: 'var(--fg)' }}>
                  {session?.user?.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                  {roleLabel[role] ?? role}
                </p>
              </div>
              <div className="hidden sm:block h-1.5 w-1.5 rounded-full bg-emerald-400 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <DropdownMenuLabel className="font-normal px-2 py-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-sm font-bold text-white">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>{session?.user?.name}</p>
                  <p className="text-xs truncate max-w-[140px]" style={{ color: 'var(--fg-muted)' }}>{session?.user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: 'var(--border)' }} />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors" style={{ color: 'var(--fg)' }}>
                <User size={14} style={{ color: 'var(--fg-muted)' }} /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors" style={{ color: 'var(--fg)' }}>
                <Settings size={14} style={{ color: 'var(--fg-muted)' }} /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: 'var(--border)' }} />
            <DropdownMenuItem
              className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={() => signOut()}
            >
              <LogOut size={14} /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
