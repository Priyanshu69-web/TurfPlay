import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, User, Mail, Lock, UserPlus } from "lucide-react";
import AuthShell from "../../components/ui/AuthShell";
import Spinner from "../../components/ui/Spinner";
import { useRegisterMutation } from "../../redux/api/authApi";

const passwordStrength = (pw) => {
    if (!pw) return { label: "", color: "", pct: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
        { label: "", color: "", pct: 0 },
        { label: "Weak", color: "bg-rose-500", pct: 25 },
        { label: "Fair", color: "bg-amber-400", pct: 50 },
        { label: "Good", color: "bg-blue-400", pct: 75 },
        { label: "Strong", color: "bg-emerald-500", pct: 100 },
    ];
    return levels[score] || levels[0];
};

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const strength = passwordStrength(form.password);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Full name is required";
        else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const toastId = toast.loading("Creating your account…");
        try {
            await register(form).unwrap();
            toast.success("Account created! Please sign in.", { id: toastId });
            navigate("/login");
        } catch (err) {
            toast.error(err?.data?.message || "Registration failed. Please try again.", { id: toastId });
        }
    };

    const inputBase = "w-full rounded-2xl border bg-white/10 py-3 pl-11 pr-4 text-[var(--app-text)] placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40";
    const inputNormal = "border-[var(--app-border)] focus:border-emerald-500";
    const inputError = "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30";

    return (
        <AuthShell
            eyebrow="Create account"
            title="Join TurfPlay"
            subtitle="Sign up once and move between discovery, booking, and account management without friction."
        >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/6 p-4">
                    <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                        <UserPlus size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--app-text)]">New player setup</p>
                        <p className="text-sm text-muted">Create an account and start booking right away.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">Full Name</label>
                        <div className="relative">
                            <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Arjun Sharma"
                                value={form.name}
                                onChange={handleChange}
                                className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                                <span>⚠</span> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={form.email}
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
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">Password</label>
                        <div className="relative">
                            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="new-password"
                                placeholder="Min. 6 characters"
                                value={form.password}
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

                        {/* Password strength bar */}
                        {form.password.length > 0 && (
                            <div className="mt-2">
                                <div className="h-1.5 w-full rounded-full bg-white/10">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${strength.color}`}
                                        style={{ width: `${strength.pct}%` }}
                                    />
                                </div>
                                {strength.label && (
                                    <p className="mt-1 text-xs text-muted">
                                        Password strength:{" "}
                                        <span className="font-semibold text-[var(--app-text)]">{strength.label}</span>
                                    </p>
                                )}
                            </div>
                        )}
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
                                Creating account…
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--app-border)]" />
                    </div>
                    <div className="relative flex justify-center text-xs text-muted">
                        <span className="bg-[var(--app-bg)] px-3">or</span>
                    </div>
                </div>

                <p className="text-center text-sm text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </AuthShell>
    );
};

export default Register;
