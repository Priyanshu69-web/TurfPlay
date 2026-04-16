import React from 'react';
import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[var(--app-text)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20 ${className}`}
    >
      {isDark ? <SunMedium size={18} className="text-amber-300" /> : <Moon size={18} className="text-slate-700" />}
    </button>
  );
};

export default ThemeToggle;
