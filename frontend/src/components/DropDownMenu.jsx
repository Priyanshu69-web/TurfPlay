import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { USER_MENU_DATA, ADMIN_MENU_DATA } from '../utils/data';
import { ChevronDown } from 'lucide-react';

const DropdownMenu = ({ label, inMobileNav = false }) => {
    const { isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const baseMenuData = user?.role === 1 ? ADMIN_MENU_DATA : USER_MENU_DATA;

    const menuData = baseMenuData.map((item) => ({
        ...item,
        onClick:
            item.path === 'logout'
                ? () => {
                      logout();
                      navigate('/login');
                      setOpen(false);
                  }
                : () => {
                      navigate(item.path);
                      setOpen(false);
                  },
    }));

    // Close on outside click (desktop only — mobile nav handles it differently)
    useEffect(() => {
        if (inMobileNav) return;
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [inMobileNav]);

    /* ─── Mobile nav version: inline expandable list ───────────── */
    if (inMobileNav) {
        return (
            <div className="w-full text-center">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                        isDark
                            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    {label}
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && (
                    <ul className="mt-2 space-y-1">
                        {menuData.map((item) => {
                            const IconComp = item.icon;
                            const isLogout = item.path === 'logout';
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={item.onClick}
                                        className={`flex w-full items-center justify-center gap-2 px-3.5 py-2 text-sm transition rounded-xl ${
                                            isLogout
                                                ? 'text-red-500 hover:bg-red-500/10'
                                                : isDark
                                                ? 'text-gray-200 hover:bg-gray-800'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {IconComp && (
                                            <span className="shrink-0 opacity-70">
                                                <IconComp size={14} strokeWidth={2} />
                                            </span>
                                        )}
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    /* ─── Desktop version: absolute dropdown ───────────────────── */
    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    isDark
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
                {label}
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className={`absolute right-0 z-50 mt-1.5 w-52 origin-top-right rounded-xl shadow-xl ring-1 ${
                        isDark ? 'bg-gray-900 ring-gray-700' : 'bg-white ring-gray-200'
                    }`}
                >
                    <ul className="py-1">
                        {menuData.map((item) => {
                            const IconComp = item.icon;
                            const isLogout = item.path === 'logout';
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={item.onClick}
                                        className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition ${
                                            isLogout
                                                ? isDark
                                                    ? 'text-red-400 hover:bg-red-500/10'
                                                    : 'text-red-600 hover:bg-red-50'
                                                : isDark
                                                ? 'text-gray-200 hover:bg-gray-800'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {IconComp && (
                                            <span className="shrink-0 opacity-70">
                                                <IconComp size={14} strokeWidth={2} />
                                            </span>
                                        )}
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
