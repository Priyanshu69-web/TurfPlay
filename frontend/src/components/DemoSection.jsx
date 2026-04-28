import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Users, Calendar } from 'lucide-react';

const DemoSection = () => {
    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                
                {/* Text Content */}
                <div className="lg:col-span-5 mb-12 lg:mb-0">
                    <h2 className="text-3xl font-extrabold text-[var(--app-text)] sm:text-4xl">
                        Everything you need to <span className="text-emerald-400">manage your turf</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted">
                        Stop managing bookings on WhatsApp and Excel. TurfPlay gives you a powerful dashboard to oversee operations, revenue, and customers in real-time.
                    </p>
                    
                    <div className="mt-8 space-y-6">
                        {[
                            { icon: Calendar, title: "Automated Slot Generation", desc: "Set your hours once, and let our system generate slots 7 days in advance." },
                            { icon: TrendingUp, title: "Revenue Analytics", desc: "Track your earnings daily, weekly, and monthly with beautiful charts." },
                            { icon: Users, title: "Customer Management", desc: "Build a database of your regular players and track their booking history." }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-[var(--app-text)]">{feature.title}</h3>
                                    <p className="mt-1 text-sm text-muted">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Mockup Image/Graphic */}
                <div className="lg:col-span-7 relative">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-2"
                    >
                        {/* Fake browser header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="ml-4 px-3 py-1 text-xs text-slate-400 bg-slate-800 rounded-md">admin.turfplay.com</div>
                        </div>
                        {/* Mockup Body */}
                        <div className="bg-slate-950 aspect-[16/10] p-4 flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
                                <div className="h-8 w-8 bg-slate-800 rounded-full animate-pulse"></div>
                            </div>
                            
                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                                        <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                                        <div className="h-8 w-3/4 bg-slate-700 rounded"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex gap-4 mt-2">
                                {/* Chart Area */}
                                <div className="flex-[2] bg-slate-900 rounded-xl border border-slate-800 p-4">
                                    <div className="h-4 w-1/3 bg-slate-800 rounded mb-4"></div>
                                    <div className="h-[80%] w-full bg-slate-800/50 rounded flex items-end gap-2 p-2">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-emerald-500/50 rounded-t" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Recent Bookings */}
                                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
                                    <div className="h-4 w-1/2 bg-slate-800 rounded mb-2"></div>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-full bg-slate-800/50 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default DemoSection;
