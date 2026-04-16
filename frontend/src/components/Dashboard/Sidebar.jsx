import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[color:var(--app-surface-strong)] text-[var(--app-text)] shadow-lg backdrop-blur-xl lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 transform transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="m-3 flex h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-[color:var(--app-surface-strong)] p-4 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-[var(--app-border)] px-3 pb-5 pt-3">
            <div className="flex items-center gap-3">
              <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                {user?.role === 1 ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--app-text)]">TurfPlay</h1>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  {user?.role === 1 ? 'Admin panel' : 'User dashboard'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Signed in as</p>
            <p className="mt-2 truncate text-sm font-semibold text-[var(--app-text)]">{user?.name || 'User'}</p>
            <p className="truncate text-sm text-muted">{user?.email}</p>
          </div>

          <nav className="premium-scrollbar mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  isActive(item.path)
                    ? 'brand-gradient text-white shadow-lg shadow-emerald-500/20'
                    : 'text-muted hover:bg-white/8 hover:text-[var(--app-text)]'
                }`}
              >
                <item.icon size={18} />
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight size={16} className={isActive(item.path) ? 'opacity-100' : 'opacity-40'} />
              </button>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-[var(--app-text)]">Operations are live</p>
            <p className="mt-1 text-sm text-muted">Slots, bookings, and customer actions stay visible in one workspace.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
