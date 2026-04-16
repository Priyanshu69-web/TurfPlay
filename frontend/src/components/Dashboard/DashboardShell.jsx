import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';

const DashboardShell = ({ title, subtitle, menuItems, onLogout, children }) => {
  return (
    <div className="app-shell">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar menuItems={menuItems} />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-2">
          <header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-[color:var(--app-surface)]/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="pl-14 lg:pl-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">TurfPlay workspace</p>
                <h1 className="mt-1 text-2xl font-semibold text-[var(--app-text)]">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
              </div>
              <div className="flex items-center gap-3 pl-14 sm:pl-0">
                <div className="hidden rounded-2xl border border-[var(--app-border)] bg-white/5 p-2 text-muted sm:inline-flex">
                  <Bell size={18} />
                </div>
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-500/15"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
