import { useState, useEffect } from 'react';
import { CalendarCheck2, MapPin, ShieldCheck, Star, Users } from 'lucide-react';

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
            icon: ShieldCheck,
            color: 'from-green-400 to-green-600'
        },
        {
            label: 'Bookings Completed',
            value: counters.bookings,
            suffix: '+',
            icon: CalendarCheck2,
            color: 'from-blue-400 to-blue-600'
        },
        {
            label: 'Happy Players',
            value: counters.players,
            suffix: '+',
            icon: Users,
            color: 'from-purple-400 to-purple-600'
        },
        {
            label: 'Cities Covered',
            value: counters.cities,
            suffix: '+',
            icon: MapPin,
            color: 'from-yellow-400 to-yellow-600'
        }
    ];

    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
                        Our
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Impact</span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg text-muted sm:text-xl">
                        Join thousands of sports enthusiasts who trust TurfPlay for their sporting needs across the globe.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative mb-6">
                                {/* Animated Circle */}
                                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                                    <div className="absolute inset-0 rounded-full border-4 border-[var(--app-border)]"></div>
                                    <div className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r ${stat.color} animate-spin-slow`}></div>
                                    <div className="absolute inset-2 flex items-center justify-center rounded-full bg-[var(--app-bg-secondary)]">
                                        <stat.icon className="text-[var(--app-text)] transition-transform duration-300 group-hover:scale-110" size={24} />
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
                            <p className="font-medium text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="mt-20 text-center">
                    <div className="soft-panel mx-auto max-w-4xl rounded-[1.75rem] p-6 sm:p-8">
                        <div className="flex items-center justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={22} className="text-yellow-400" fill="currentColor" />
                            ))}
                        </div>
                        <blockquote className="mb-6 text-xl italic text-[var(--app-text)] sm:text-2xl">
                            "TurfPlay has revolutionized how we book sports facilities. The seamless experience and premium turfs make every game memorable."
                        </blockquote>
                        <div className="flex items-center justify-center space-x-4">
                            <img
                                src="https://readdy.ai/api/search-image?query=Professional%20athlete%20headshot%20photo%2C%20male%20soccer%20player%2C%20confident%20expression%2C%20sports%20jersey%2C%20stadium%20background%2C%20clean%20professional%20lighting%2C%20high-quality%20portrait%20photography&width=80&height=80&seq=testimonial&orientation=squarish"
                                alt="Player"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-[var(--app-text)]">Marcus Johnson</p>
                                <p className="text-muted">Team Captain, City FC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
