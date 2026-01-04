
import { useState, useEffect } from 'react';

export default function Stats() {
    const [counters, setCounters] = useState({
        turfs: 0,
        bookings: 0,
        players: 0,
        cities: 0
    });

    const targetValues = {
        turfs: 500,
        bookings: 25000,
        players: 100000,
        cities: 50
    };

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = duration / steps;

        const timer = setInterval(() => {
            setCounters(prev => ({
                turfs: Math.min(prev.turfs + Math.ceil(targetValues.turfs / steps), targetValues.turfs),
                bookings: Math.min(prev.bookings + Math.ceil(targetValues.bookings / steps), targetValues.bookings),
                players: Math.min(prev.players + Math.ceil(targetValues.players / steps), targetValues.players),
                cities: Math.min(prev.cities + Math.ceil(targetValues.cities / steps), targetValues.cities)
            }));
        }, increment);

        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            label: 'Premium Turfs',
            value: counters.turfs,
            suffix: '+',
            icon: 'ri-football-line',
            color: 'from-green-400 to-green-600'
        },
        {
            label: 'Bookings Completed',
            value: counters.bookings,
            suffix: '+',
            icon: 'ri-calendar-check-line',
            color: 'from-blue-400 to-blue-600'
        },
        {
            label: 'Happy Players',
            value: counters.players,
            suffix: '+',
            icon: 'ri-group-line',
            color: 'from-purple-400 to-purple-600'
        },
        {
            label: 'Cities Covered',
            value: counters.cities,
            suffix: '+',
            icon: 'ri-map-pin-line',
            color: 'from-yellow-400 to-yellow-600'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Our
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Impact</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Join thousands of sports enthusiasts who trust TurfPlay for their sporting needs across the globe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative mb-6">
                                {/* Animated Circle */}
                                <div className="w-24 h-24 mx-auto relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                                    <div className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r ${stat.color} animate-spin-slow`}></div>
                                    <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                                        <i className={`${stat.icon} text-2xl text-white group-hover:scale-110 transition-transform duration-300`}></i>
                                    </div>
                                </div>
                            </div>

                            {/* Counter */}
                            <div className="mb-2">
                                <span className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                                    {stat.value.toLocaleString()}
                                </span>
                                <span className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                                    {stat.suffix}
                                </span>
                            </div>

                            {/* Label */}
                            <p className="text-gray-300 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="mt-20 text-center">
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className="ri-star-fill text-yellow-400 text-2xl"></i>
                            ))}
                        </div>
                        <blockquote className="text-2xl text-white mb-6 italic">
                            "TurfPlay has revolutionized how we book sports facilities. The seamless experience and premium turfs make every game memorable."
                        </blockquote>
                        <div className="flex items-center justify-center space-x-4">
                            <img
                                src="https://readdy.ai/api/search-image?query=Professional%20athlete%20headshot%20photo%2C%20male%20soccer%20player%2C%20confident%20expression%2C%20sports%20jersey%2C%20stadium%20background%2C%20clean%20professional%20lighting%2C%20high-quality%20portrait%20photography&width=80&height=80&seq=testimonial&orientation=squarish"
                                alt="Player"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-white font-semibold">Marcus Johnson</p>
                                <p className="text-gray-400">Team Captain, City FC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}