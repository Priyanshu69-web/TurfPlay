import { motion } from 'motion/react';
import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import BookingSection from '../components/BookingSection';
import PopularTurfs from '../components/PopularTurfs';

// Reusable glass card component
const GlassCard = ({ children, className = '' }) => (
    <div
        className={`backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-6 ${className}`}
    >
        {children}
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-t from-gray-900 to-black text-white overflow-x-hidden">
            {/* Hero Section
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                    >
                        Book Your Turf. <span className="text-cyan-400">Play Without Limits.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
                    >
                        Instant turf & box cricket slot booking with real-time availability.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-400 text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all">
                            Book a Slot
                        </button>
                        <button className="px-8 py-3 bg-transparent border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-colors">
                            View Turfs
                        </button>
                    </motion.div>
                </div>
                {/* Optional: abstract background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
            {/* </section> */}
            <Hero />

            {/* How It Works */}
            <section className=" border-t border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl font-bold text-center text-white mb-6">
                        How It
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Works</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: 1, title: 'Choose Turf', icon: '🏟️' },
                            { step: 2, title: 'Select Time Slot', icon: '🕒' },
                            { step: 3, title: 'Play & Enjoy', icon: '🏏' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -8 }}
                                className="text-center"
                            >
                                <GlassCard className="h-full flex flex-col items-center justify-center gap-4">
                                    <div className="text-4xl">{item.icon}</div>
                                    <div className="text-green-400 font-bold">Step {item.step}</div>
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="border-t border-gray-700 my-12 mx-4 sm:mx-6 lg:mx-8">
                <BookingSection />
            </section>

            {/* Features */}
            {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Players Love TurfPlay</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            'Real-time slot availability',
                            '7-day auto-generated slots',
                            'Easy online booking',
                            'Secure payments',
                            'Instant confirmation',
                            '24/7 customer support',
                        ].map((feature, idx) => (
                            <GlassCard key={idx} className="flex items-start gap-3">
                                <span className="text-cyan-400 text-xl">✓</span>
                                <span>{feature}</span>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Popular Turfs */}
            <section className=" border-t border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
                <PopularTurfs />
            </section>

            {/* Why TurfPlay */}
            {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
                <GlassCard className="max-w-3xl mx-auto text-center py-12">
                    <h2 className="text-2xl font-bold mb-6">Why TurfPlay?</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-cyan-400">✓</span> Trusted by 5,000+ players
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-cyan-400">✓</span> Hassle-free booking in under 60 seconds
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-cyan-400">✓</span> Built by cricket lovers, for cricket lovers
                        </li>
                    </ul>
                </GlassCard>
            </section> */}
            <section className="border-t border-gray-700 my-12 mx-4 sm:mx-6 lg:mx-8">
                <Stats />
            </section>

        </div>
    );
};

export default Home;
