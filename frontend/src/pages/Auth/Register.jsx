import { useState } from "react";
import NameInput from "../../components/ui/NameInput";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/authApi";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '' }) => (
    <div
        className={`backdrop-blur-lg bg-black/30 border border-white/10 rounded-2xl p-8 ${className}`}
    >
        {children}
    </div>
);

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await register(form).unwrap();
            toast.success('Registration successful');
            navigate("/login");
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden flex items-center justify-center py-12 px-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <GlassCard>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">Join TurfPlay</h1>
                        <p className="text-gray-300">Create your account and start booking</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="w-full">
                            <label className="block text-sm font-semibold mb-2 text-gray-200">
                                Full Name
                            </label>
                            <NameInput
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all box-border"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-semibold mb-2 text-gray-200">
                                Email Address
                            </label>
                            <EmailInput
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all box-border"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-semibold mb-2 text-gray-200">
                                Password
                            </label>
                            <PasswordInput
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all box-border"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>
                    </form>

                    <div className="divider my-6 text-gray-400">or</div>

                    <p className="text-center text-gray-300">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                        >
                            Login here
                        </Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default Register;
