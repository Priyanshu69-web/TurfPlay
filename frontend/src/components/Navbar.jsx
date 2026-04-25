import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

function Navigation({ isMobile = false }) {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }
    if (loading) return null;

    return (
        <ul className='nav-ul flex gap-4 items-center flex-col sm:flex-row'>
            <li className='nav-li'>
                <Link to="/" className='nav-link hover:backdrop-blur-lg'>Home</Link>
            </li>
            <li className='nav-li'>
                <Link to="/booking" className='nav-link'>Book Slot</Link>
            </li>
            <li className='nav-li'>
                <Link to="/contact" className='nav-link'>Contact</Link>
            </li>

            {user ? (
                <li className='nav-li'>
                    <DropdownMenu label={user.name} inMobileNav={isMobile} />
                </li>
            ) : (
                <li className='nav-li'>
                    <button onClick={() => navigate("/login")} className='nav-link'>Login</button>
                </li>
            )}
        </ul>
    )
}

const ThemeToggleBtn = () => {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className='p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex-shrink-0'
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? (
                <Sun size={20} className='text-yellow-400' />
            ) : (
                <Moon size={20} className='text-gray-700' />
            )}
        </button>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDark } = useTheme();

    return (
        <div className={`sticky top-0 inset-x-0 z-20 w-full backdrop-blur-lg ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} p-4 px-6 shadow-lg border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className='mx-auto max-w-7xl'>
                <div className='flex items-center justify-between py-2 sm:py-0'>
                    <Link to="/">
                        <div className="flex items-center space-x-2">
                            <h1 className={`text-2xl font-bold font-pacifico ${isDark ? 'text-white' : 'text-gray-800'}`}>TurfPlay</h1>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className='hidden sm:flex'>
                        <Navigation />
                    </nav>

                    {/* Mobile: Theme toggle + hamburger */}
                    <div className='flex items-center gap-2 sm:hidden'>
                        <ThemeToggleBtn />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex cursor-pointer ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} focus:outline-none`}
                        >
                            <img src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} className='w-6 h-6' alt='toggle' />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className='block overflow-hidden text-center sm:hidden'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <nav className='pb-5 pt-4'>
                            <Navigation isMobile={true} />
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar
