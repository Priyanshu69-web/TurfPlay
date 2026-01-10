import { useState } from "react";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useLoginMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '' }) => (
    <div
        className={`backdrop-blur-lg bg-black/30 border border-white/10 rounded-2xl p-8 ${className}`}
    >
        {children}
    </div>
);

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData).unwrap();
            const token = response.token;
            const user = response.user;

            dispatch(setUser({ user, token }));
            localStorage.setItem('token', token);
            toast.success("Login successful");

            const role = user?.role;
            if (role === 1) {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            toast.error("Login failed: " + (error?.data?.message || error.message));
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
                        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-gray-300">Login to your TurfPlay account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="w-full">
                            <label className="block text-sm font-semibold mb-2 text-gray-200">
                                Email Address
                            </label>
                            <EmailInput
                                name="email"
                                value={formData.email}
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
                                value={formData.password}
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
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </motion.button>
                    </form>

                    <div className="divider my-6 text-gray-400">or</div>

                    <p className="text-center text-gray-300">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                        >
                            Sign up here
                        </Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default Login;
