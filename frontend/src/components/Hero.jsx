import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, CalendarDays, Grid2x2, Star, TimerReset } from 'lucide-react';

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            className="relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, var(--hero-bg-start) 0%, var(--hero-bg-mid) 55%, var(--hero-bg-end) 100%)'
            }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute left-[-6rem] top-20 h-72 w-72 rounded-full bg-green-500/12 blur-3xl animate-pulse sm:h-96 sm:w-96"></div>
                <div className="absolute bottom-10 right-[-4rem] h-64 w-64 rounded-full bg-teal-400/16 blur-3xl animate-pulse delay-1000 sm:h-80 sm:w-80"></div>
                <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-green-500/8 to-blue-500/6 blur-3xl animate-spin-slow sm:h-[38rem] sm:w-[38rem]"></div>
            </div>

            {/* Floating Cricket Ball Animation */}
            <div className="absolute right-[12%] top-28 hidden h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg animate-bounce lg:block">
                <div className="absolute inset-2 border-2 border-white/30 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 rotate-45 origin-center"></div>
            </div>
            {/* Hero Content */}
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:px-8 lg:pb-20 lg:pt-12">
                <div className={`w-full max-w-2xl space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h1 className="text-5xl font-bold leading-[0.95] text-[var(--app-text)] sm:text-6xl lg:text-7xl xl:text-8xl">
                        Book Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 block">
                            Dream Turf
                        </span>
                    </h1>

                    <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                        Experience premium sports facilities with real-time booking, instant confirmation, and seamless gameplay. Your perfect match awaits.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            to="/booking"
                            className="brand-gradient cursor-pointer whitespace-nowrap rounded-full px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/25"
                        >
                            <CalendarDays size={18} className="mr-2 inline-flex" />
                            Book Now
                        </Link>
                        <Link
                            to="/#popular-turfs"
                            className="cursor-pointer whitespace-nowrap rounded-full border-2 border-[var(--app-border)] px-8 py-4 text-center text-lg font-semibold text-[var(--app-text)] transition-all duration-300 backdrop-blur-sm hover:bg-[var(--app-surface)]"
                        >
                            <Grid2x2 size={18} className="mr-2 inline-flex" />
                            View Turfs
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 sm:max-w-md sm:gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">500+</div>
                            <div className="text-sm text-muted">Premium Turfs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">10K+</div>
                            <div className="text-sm text-muted">Happy Players</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">24/7</div>
                            <div className="text-sm text-muted">Support</div>
                        </div>
                    </div>
                </div>

                {/* 3D Turf Animation */}
                <div className="relative w-full max-w-2xl">
                    <div className="soft-panel-strong relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
                        <img
                            src="https://readdy.ai/api/search-image?query=Modern%203D%20rendered%20football%20soccer%20turf%20field%20with%20vibrant%20green%20grass%2C%20stadium%20lights%20creating%20dramatic%20shadows%2C%20futuristic%20holographic%20elements%2C%20neon%20green%20goal%20posts%2C%20digital%20scoreboard%2C%20high-tech%20sports%20facility%20with%20glass%20and%20steel%20architecture%2C%20professional%20lighting%20with%20bokeh%20effects%2C%20ultra-modern%20design%20aesthetic%2C%20clean%20minimal%20background&width=800&height=600&seq=hero-turf&orientation=landscape"
                            alt="3D Turf Field"
                            className="h-auto w-full rounded-[1.5rem] object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                        />

                        {/* Floating UI Elements */}
                        <div className="soft-panel absolute right-3 top-3 rounded-2xl p-4 animate-float sm:right-6 sm:top-6">
                            <div className="flex items-center space-x-2 text-green-500">
                                <TimerReset size={16} />
                                <span className="text-sm font-medium">Available Now</span>
                            </div>
                        </div>

                        <div className="soft-panel absolute bottom-3 left-3 rounded-2xl p-4 animate-float delay-500 sm:bottom-6 sm:left-6">
                            <div className="flex items-center space-x-2 text-green-500">
                                <Star size={16} fill="currentColor" />
                                <span className="text-sm font-medium">4.9 Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-muted lg:block">
                <ArrowDown size={24} />
            </div>
        </div>
    );
}
