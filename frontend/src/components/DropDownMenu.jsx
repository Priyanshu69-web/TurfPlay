import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_MENU_DATA, ADMIN_MENU_DATA } from '../utils/data';

const DropdownMenu = ({ label }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const { user, logout } = useAuth();
    const [menuData, setMenuData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = user?.role === 1;
        const baseMenuData = isAdmin ? ADMIN_MENU_DATA : USER_MENU_DATA;

        setMenuData(baseMenuData.map(item => ({
            ...item,
            onClick: item.path === 'logout'
                ? () => {
                    logout();
                    navigate('/login');
                    setOpen(false);
                }
                : () => {
                    navigate(item.path);
                    setOpen(false);
                }
        })));
    }, [user, user?.role, navigate, logout]);

    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
            >
                {label}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <ul className="py-1">
                        {menuData.map((item, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    item.onClick?.();
                                }}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                {item.icon && <span className="mr-2">{React.createElement(item.icon)}</span>}
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
