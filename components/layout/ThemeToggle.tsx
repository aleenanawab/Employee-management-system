'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
      style={{ color: 'var(--fg-muted)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--primary-light)';
        e.currentTarget.style.color = 'var(--primary-text)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(109,40,217,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--fg-muted)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark'
        ? <Sun size={17} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
        : <Moon size={17} className="transition-transform duration-300" />
      }
    </button>
  );
}
