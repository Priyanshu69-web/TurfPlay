import { Link } from 'react-router-dom';
import { CalendarClock, CircleHelp, Instagram, Linkedin, Mail, MapPin, Phone, ShieldCheck, Sparkles, Twitter } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        Platform: ['Browse Turfs', 'Book Now', 'Live Availability', 'Flexible Scheduling'],
        Support: ['Help Center', 'Contact Us', 'FAQ', 'Feedback'],
        Company: ['About Us', 'Careers', 'Partners', 'Press'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance']
    };

    const socialLinks = [
        { icon: Instagram, label: 'Instagram' },
        { icon: Twitter, label: 'Twitter' },
        { icon: Linkedin, label: 'LinkedIn' },
    ];

    return (
        <footer className="relative z-10 px-4 pb-6 pt-10 sm:px-6">
            <div className="surface-card mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-[var(--app-text)]">TurfPlay</h3>
                                <p className="text-sm text-muted">Modern facility operations for players and teams.</p>
                            </div>
                        </div>
                        <p className="max-w-md text-sm leading-7 text-muted">
                            A polished booking experience for premium sports venues, with real-time availability, confident operations, and a UI that feels ready for production.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { icon: Mail, label: 'contact@turfplay.com' },
                                { icon: Phone, label: '+91 90000 00000' },
                                { icon: MapPin, label: 'India operations' },
                                { icon: CalendarClock, label: 'Open daily, 24/7 bookings' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3">
                                    <item.icon size={16} className="text-emerald-500" />
                                    <span className="text-sm text-muted">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {socialLinks.map((item) => (
                                <a key={item.label} href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white/5 text-muted transition hover:-translate-y-0.5 hover:text-[var(--app-text)]">
                                    <item.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--app-text)]">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link to={link === "Book Now" ? "/booking" : link === "Browse Turfs" ? "/#popular-turfs" : link === "Contact Us" ? "/contact" : "#"} className="text-sm text-muted transition hover:text-emerald-500">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-[1.5rem] border border-[var(--app-border)] bg-white/5 p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-[var(--app-text)]">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                <h4 className="font-semibold">Stay Updated</h4>
                            </div>
                            <p className="text-sm text-muted">Product updates, venue drops, and premium offers. No spam.</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="min-w-0 rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500 sm:min-w-[18rem]"
                            />
                            <button className="brand-gradient rounded-2xl px-6 py-3 font-medium text-white transition hover:-translate-y-0.5">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-[var(--app-border)] pt-8 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted">
                        © 2026 TurfPlay. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
                        <Link to="#" className="transition hover:text-emerald-500">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="transition hover:text-emerald-500">
                            Terms of Service
                        </Link>
                        <Link to="#" className="transition hover:text-emerald-500">
                            Cookie Settings
                        </Link>
                        <div className="flex items-center gap-2">
                            <CircleHelp size={16} />
                            Support ready
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
