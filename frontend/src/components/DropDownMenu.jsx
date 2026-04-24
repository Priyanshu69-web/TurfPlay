import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { USER_MENU_DATA, ADMIN_MENU_DATA } from '../utils/data';

const DropdownMenu = ({ label }) => {
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

    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition
                    ${isDark
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
            >
                {label}
                <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {open && (
                <div
                    className={`absolute right-0 z-30 mt-1.5 w-52 origin-top-right rounded-lg shadow-lg ring-1
                        ${isDark
                            ? 'bg-gray-900 ring-gray-700'
                            : 'bg-white ring-gray-200'
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
                                        className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition
                                            ${isLogout
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
