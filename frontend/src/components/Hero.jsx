import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, CalendarDays, Grid2x2, Star, TimerReset } from 'lucide-react';

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
            </div>

            {/* Floating Cricket Ball Animation */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg animate-bounce">
                <div className="absolute inset-2 border-2 border-white/30 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 rotate-45 origin-center"></div>
            </div>
            {/* Hero Content */}
            <div className="relative z-10 flex items-center justify-between px-8 py-0 max-w-7xl mx-auto">
                <div className={`w-full max-w-2xl space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
                        Book Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 block">
                            Dream Turf
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                        Experience premium sports facilities with real-time booking, instant confirmation, and seamless gameplay. Your perfect match awaits.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/booking"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 cursor-pointer whitespace-nowrap text-center"
                        >
                            <CalendarDays size={18} className="mr-2 inline-flex" />
                            Book Now
                        </Link>
                        <Link
                            to="/#popular-turfs"
                            className="border-2 border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer whitespace-nowrap text-center"
                        >
                            <Grid2x2 size={18} className="mr-2 inline-flex" />
                            View Turfs
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center space-x-8 pt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">500+</div>
                            <div className="text-gray-400 text-sm">Premium Turfs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">10K+</div>
                            <div className="text-gray-400 text-sm">Happy Players</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">24/7</div>
                            <div className="text-gray-400 text-sm">Support</div>
                        </div>
                    </div>
                </div>

                {/* 3D Turf Animation */}
                <div className="hidden lg:block relative w-full max-w-2xl">
                    <div className="relative">
                        <img
                            src="https://readdy.ai/api/search-image?query=Modern%203D%20rendered%20football%20soccer%20turf%20field%20with%20vibrant%20green%20grass%2C%20stadium%20lights%20creating%20dramatic%20shadows%2C%20futuristic%20holographic%20elements%2C%20neon%20green%20goal%20posts%2C%20digital%20scoreboard%2C%20high-tech%20sports%20facility%20with%20glass%20and%20steel%20architecture%2C%20professional%20lighting%20with%20bokeh%20effects%2C%20ultra-modern%20design%20aesthetic%2C%20clean%20minimal%20background&width=800&height=600&seq=hero-turf&orientation=landscape"
                            alt="3D Turf Field"
                            className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700  object-cover"
                        />

                        {/* Floating UI Elements */}
                        <div className="absolute -top-8 -right-8 bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-green-500/20 animate-float">
                            <div className="flex items-center space-x-2 text-green-400">
                                <TimerReset size={16} />
                                <span className="text-sm font-medium">Available Now</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-8 -left-8 bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-green-500/20 animate-float delay-500">
                            <div className="flex items-center space-x-2 text-green-400">
                                <Star size={16} fill="currentColor" />
                                <span className="text-sm font-medium">4.9 Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
                <ArrowDown size={24} />
            </div>
        </div>
    );
}
