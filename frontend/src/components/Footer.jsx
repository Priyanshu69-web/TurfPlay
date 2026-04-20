import { Link } from 'react-router-dom';
import { Instagram, Linkedin, ShieldCheck, Sparkles, Twitter } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        Platform: ['Browse Turfs', 'Book Now', 'Tournaments', 'Teams', 'Mobile App'],
        Support: ['Help Center', 'Contact Us', 'Live Chat', 'FAQ', 'Feedback'],
        Company: ['About Us', 'Careers', 'Press', 'Partners', 'Investors'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Protection', 'Compliance']
    };

    const socialLinks = [
        { icon: Twitter, label: 'Twitter' },
        { icon: Instagram, label: 'Instagram' },
        { icon: Linkedin, label: 'LinkedIn' },
    ];

    const resolveLink = (link) => {
        if (link === 'Book Now') return '/booking';
        if (link === 'Browse Turfs') return '/#popular-turfs';
        if (link === 'Contact Us') return '/contact';
        return '#';
    };

    return (
        <footer
            className="relative z-10 border-t px-4 sm:px-6"
            style={{
                borderColor: 'var(--app-border)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-secondary) 88%, transparent), color-mix(in srgb, var(--app-bg) 94%, #000 6%))'
            }}
        >
            <div className="mx-auto max-w-7xl px-2 py-14 sm:px-4 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={18} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--app-text)]">TurfPlay</h3>
                        </div>
                        <p className="mb-6 max-w-md leading-7 text-muted">
                            Revolutionizing sports facility booking with cutting-edge technology and premium turfs. Your game, your way.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href="#"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition-colors hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                                >
                                    <item.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="mb-4 font-semibold text-[var(--app-text)]">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            to={resolveLink(link)}
                                            className="text-sm text-muted transition-colors hover:text-emerald-500"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t border-[var(--app-border)] pt-8">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-[var(--app-text)]">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                <h4 className="font-semibold">Stay Updated</h4>
                            </div>
                            <p className="text-sm text-muted">Get the latest news and exclusive offers</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="min-w-0 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-[var(--app-text)] outline-none transition focus:border-emerald-500 sm:min-w-[16rem]"
                            />
                            <button className="brand-gradient rounded-xl px-6 py-2.5 font-medium text-white transition hover:-translate-y-0.5">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[var(--app-border)] pt-8 md:flex-row md:items-center">
                    <p className="text-sm text-muted">© 2026 TurfPlay. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                        <Link to="#" className="transition hover:text-emerald-500">Privacy Policy</Link>
                        <Link to="#" className="transition hover:text-emerald-500">Terms of Service</Link>
                        <Link to="#" className="transition hover:text-emerald-500">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
