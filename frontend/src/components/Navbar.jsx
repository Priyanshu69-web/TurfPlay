import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import { Menu, X, Sparkles } from 'lucide-react';

function Navigation() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return null;

    const links = [
        { label: 'Home', to: '/' },
        { label: 'Book Slot', to: '/booking' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <ul className='nav-ul flex gap-2 items-center flex-col sm:flex-row'>
            {links.map((link) => (
                <li key={link.to} className='nav-li'>
                    <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'bg-white/12 text-[var(--app-text)] shadow-sm' : ''}`
                        }
                    >
                        {link.label}
                    </NavLink>
                </li>
            ))}

            <li className='nav-li'>
                <ThemeToggle />
            </li>

            {user ? (<>
                <li className='nav-li'><DropdownMenu label={user.name} /></li>
                <li className='nav-li'>
                    <button onClick={handleLogout} className='nav-link text-rose-500'>Logout</button>
                </li>
            </>
            ) : (
                <>
                    <li className='nav-li'>
                        <button onClick={() => navigate("/login")} className='nav-link'>Login</button>
                    </li>
                </>
            )}
        </ul>
    );
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 inset-x-0 z-40 px-3 py-3 sm:px-6">
            <div className='surface-card mx-auto max-w-7xl px-4 py-3 sm:px-6'>
                <div className='flex items-center justify-between gap-4 py-1'>
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight text-[var(--app-text)] sm:text-2xl">TurfPlay</h1>
                                <p className="text-xs uppercase tracking-[0.24em] text-muted">Premium turf booking</p>
                            </div>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white/5 text-[var(--app-text)] transition hover:bg-white/10 sm:hidden"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <nav className='hidden sm:flex'>
                        <Navigation />
                    </nav>
                </div>
            </div>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        className="mx-3 mt-3 sm:hidden sm:px-6"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                    >
                        <div className="surface-card px-4 py-5 text-center">
                            <nav className='pb-1'>
                                <Navigation />
                            </nav>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
