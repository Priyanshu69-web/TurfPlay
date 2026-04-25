import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import AuthShell from "../../components/ui/AuthShell";
import Spinner from "../../components/ui/Spinner";
import { useLoginMutation } from "../../redux/api/authApi";
import { setUser } from "../../redux/slices/authSlice";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const validate = () => {
        const errs = {};
        if (!formData.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address";
        if (!formData.password) errs.password = "Password is required";
        else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on type
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const toastId = toast.loading("Signing in…");
        try {
            const response = await login(formData).unwrap();
            const { token, user } = response;

            dispatch(setUser({ user, token }));
            localStorage.setItem("token", token);
            toast.success("Welcome back, " + user.name + "!", { id: toastId });

            if (user?.role === 1) navigate("/admin/dashboard");
            else navigate("/user/dashboard");
        } catch (error) {
            toast.error(error?.data?.message || "Login failed. Please try again.", { id: toastId });
        }
    };

    const inputBase = "w-full rounded-2xl border bg-white/10 py-3 pl-11 pr-4 text-[var(--app-text)] placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40";
    const inputNormal = "border-[var(--app-border)] focus:border-emerald-500";
    const inputError = "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30";

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

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                                <span>⚠</span> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={`${inputBase} pr-12 ${errors.password ? inputError : inputNormal}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--app-text)] transition"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                                <span>⚠</span> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember me + forgot password */}
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <label className="flex cursor-pointer items-center gap-2 text-muted select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-[var(--app-border)] accent-emerald-500"
                            />
                            Remember me
                        </label>
                        <Link
                            to="/forgot-password"
                            className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isLoading}
                        className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition-all duration-300 disabled:opacity-60"
                    >
                        {isLoading ? (
                            <>
                                <Spinner size={18} />
                                Signing in…
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>

                    <p className="text-center text-sm text-muted">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400">
                            Sign up here
                        </Link>
                    </p>
                </form>
            </motion.div>
        </AuthShell>
    );
};

export default Login;
