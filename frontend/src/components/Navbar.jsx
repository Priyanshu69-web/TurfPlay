import React, { useState } from 'react'
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { useAuth } from '../context/AuthContext';
function Navigation() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login")
    }
    if (loading) return null;

    return (
        <ul className='nav-ul flex gap-6 items-center flex-col sm:flex-row'>
            <li className='nav-li'>
                <a href="/" className='nav-link hover:backdrop-blur-lg'>Home</a>
            </li>
            <li className='nav-li'>
                <a href="/booking" className='nav-link'>Book Slot</a>
            </li>
            <li className='nav-li'>
                <a href="/contact" className='nav-link'>Contact</a>
            </li>

            {user ? (<>
                <li className='nav-li'><DropdownMenu label={user.name} /></li>
                <li className='nav-li'>
                    <button onClick={handleLogout} className='nav-link'>Logout</button>
                </li>
            </>
            ) : (
                <>
                    <li className='nav-li'>
                        <button onClick={() => navigate("/login")} className='nav-link'>Login</button>
                    </li>
                </>
            )}
        </ul >
    )
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='sticky top-0 inset-x-0 z-20 w-full backdrop-blur-lg bg-transparent p-4 px-6 shadow-lg'>
            <div className='mx-auto c-space max-w-7xl'>
                <div className='flex items-center justify-between py-2 sm:py-0'>
                    {/* <a href='/' className='text-xl font-bold transistion-colors text-neutral-400 hover:text-white'>
                        TurfPlay
                    </a> */}
                    <Link to="/">
                        <div className="flex items-center space-x-2">

                            <h1 className="text-2xl font-bold transistion-colors text-neutral-400 hover:text-white font-pacifico">TurfPlay</h1>
                        </div>
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className='flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden'>
                        <img src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} className='w-6 h-6' alt='toggle' />
                    </button>
                    <nav className='hidden sm:flex'>
                        <Navigation />
                    </nav>
                </div>
            </div>
            {isOpen && (<motion.div className='block overflow-hidden text-center sm:hidden'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ maxHeight: "100vh" }}
                transition={{ duration: 1 }}
            >
                <nav className='pb-5'>
                    <Navigation />
                </nav>
            </motion.div>)}
        </div>
    )
}

export default Navbar
