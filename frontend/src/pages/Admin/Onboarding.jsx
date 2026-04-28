import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateTurfMutation } from '../../../redux/api/turfApi';
import Spinner from '../../../components/ui/Spinner';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', location: '', pricePerHour: '', facilities: [] });
    const navigate = useNavigate();
    const [createTurf, { isLoading }] = useCreateTurfMutation();

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const facilityArray = form.facilities.length > 0 
            ? (Array.isArray(form.facilities) ? form.facilities : form.facilities.split(',').map(f => f.trim()))
            : ['Lights', 'Water'];

        try {
            await createTurf({ ...form, facilities: facilityArray }).unwrap();
            toast.success("Turf created successfully!");
            setStep(2);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create turf");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full soft-panel rounded-[2rem] p-8 relative overflow-hidden"
            >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

                <div className="relative">
                    {step === 1 ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Welcome to TurfPlay! 🎉</h2>
                                <p className="text-muted mt-2">Let's set up your first turf to start accepting bookings.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Turf Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Green Park Arena"
                                        className="w-full bg-white/5 border border-[var(--app-border)] rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="City, Area"
                                            className="w-full bg-white/5 border border-[var(--app-border)] rounded-xl pl-10 pr-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price per Hour (₹)</label>
                                    <input
                                        type="number"
                                        name="pricePerHour"
                                        required
                                        value={form.pricePerHour}
                                        onChange={handleChange}
                                        placeholder="1200"
                                        className="w-full bg-white/5 border border-[var(--app-border)] rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    {isLoading ? <Spinner size={20} /> : <>Create Turf <ArrowRight size={18} /></>}
                                </motion.button>
                                
                                <button 
                                    type="button"
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="w-full text-center text-sm text-muted hover:text-[var(--app-text)] mt-4"
                                >
                                    Skip for now
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
                            <p className="text-muted mb-8">Your turf is live. Now you can view your dashboard and manage bookings.</p>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/admin/dashboard')}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20"
                            >
                                Go to Dashboard
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
