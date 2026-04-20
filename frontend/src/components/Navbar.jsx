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
        <ul className='nav-ul flex flex-col items-center gap-5 sm:flex-row sm:gap-6'>
            {links.map((link) => (
                <li key={link.to} className='nav-li'>
                    <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'text-[var(--app-text)]' : ''}`
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
                    <button onClick={handleLogout} className='nav-link text-rose-500 hover:text-rose-500'>Logout</button>
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
        <header className="sticky top-0 inset-x-0 z-40 px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 shadow-[var(--app-shadow)] backdrop-blur-xl sm:px-6">
                <div className="flex items-center justify-between gap-4 py-1 sm:py-0">
                    <Link to="/" className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={18} />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-bold text-[var(--app-text)]">TurfPlay</h1>
                                <p className="truncate text-xs uppercase tracking-[0.24em] text-muted">Premium turf booking</p>
                            </div>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[var(--app-text-muted)] transition hover:text-[var(--app-text)] sm:hidden"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <nav className="hidden sm:flex sm:items-center">
                        <Navigation />
                    </nav>
                </div>

                <AnimatePresence>
                    {isOpen ? (
                        <motion.div
                            className="block overflow-hidden text-center sm:hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <nav className='pb-3 pt-5'>
                                <Navigation />
                            </nav>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;
