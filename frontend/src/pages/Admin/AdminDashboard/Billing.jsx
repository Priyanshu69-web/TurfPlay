import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';
import { useSelector } from 'react-redux';

const Billing = () => {
    // In a real app, you'd fetch the tenant's current plan from the backend
    const { user } = useSelector(state => state.auth);
    
    // Hardcoded for demo purposes
    const currentPlan = "Basic Plan";
    const status = "Active (Trial)";
    const daysLeft = 5;

    return (
        <div className="p-6 max-w-6xl mx-auto text-[var(--app-text)]">
            <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Current Plan Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="soft-panel rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap size={100} className="text-emerald-500" />
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted font-medium uppercase tracking-wider mb-1">Current Plan</p>
                                <h2 className="text-2xl font-bold text-emerald-400">{currentPlan}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-500/20">
                                        {status}
                                    </span>
                                    <span className="text-sm text-muted">{daysLeft} days left in trial</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold">₹999<span className="text-lg text-muted font-normal">/mo</span></p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--app-border)]">
                            <h3 className="text-sm font-semibold mb-4">Plan Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {["Manage up to 2 turfs", "Unlimited bookings", "Basic analytics", "Email support"].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="mt-8 flex gap-4">
                            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:scale-105 transition">
                                Upgrade to Pro
                            </button>
                            <button className="bg-white/5 border border-[var(--app-border)] px-6 py-2 rounded-xl font-medium hover:bg-white/10 transition">
                                Cancel Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="soft-panel rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Payment Method</h3>
                        </div>
                        
                        <div className="border border-[var(--app-border)] rounded-xl p-4 flex items-center gap-4 bg-white/5">
                            <div className="bg-slate-800 p-2 rounded-lg">
                                <CreditCard className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-medium">No card on file</p>
                                <p className="text-xs text-muted">Add a card before your trial ends</p>
                            </div>
                        </div>

                        <button className="w-full mt-4 bg-white/10 border border-[var(--app-border)] py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition">
                            Add Payment Method
                        </button>
                    </div>

                    <div className="soft-panel rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Billing History</h3>
                        <div className="text-center py-6 border border-dashed border-[var(--app-border)] rounded-xl">
                            <p className="text-sm text-muted">No invoices yet.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Billing;
