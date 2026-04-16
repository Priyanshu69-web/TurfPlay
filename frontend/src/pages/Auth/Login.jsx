import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import AuthShell from "../../components/ui/AuthShell";
import { useLoginMutation } from "../../redux/api/authApi";
import { setUser } from "../../redux/slices/authSlice";

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
        <AuthShell
            eyebrow="Secure sign in"
            title="Welcome back"
            subtitle="Log in to manage bookings, handle operations, and keep every game on schedule."
            aside={
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-muted">
                    Players and admins use the same calm design language, so the product feels trustworthy from the first screen.
                </div>
            }
        >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/6 p-4">
                    <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--app-text)]">Account access</p>
                        <p className="text-sm text-muted">Continue with your existing TurfPlay credentials.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Email Address
                        </label>
                        <EmailInput
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Password
                        </label>
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isLoading}
                        className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                        <label className="flex items-center gap-2 text-muted">
                            <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400">
                            Forgot Password?
                        </Link>
                    </div>

                    <p className="text-center text-sm text-muted">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
                        >
                            Sign up here
                        </Link>
                    </p>
                </form>
            </motion.div>
        </AuthShell>
    );
};

export default Login;
