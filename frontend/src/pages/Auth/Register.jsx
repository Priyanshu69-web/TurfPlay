import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ArrowRight, UserPlus } from "lucide-react";
import NameInput from "../../components/ui/NameInput";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import AuthShell from "../../components/ui/AuthShell";
import { useRegisterMutation } from "../../redux/api/authApi";

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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Full Name
                        </label>
                        <NameInput
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Email Address
                        </label>
                        <EmailInput
                            name="email"
                            value={form.email}
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
                            value={form.password}
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
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="divider my-6 text-slate-400">or</div>

                <p className="text-center text-sm text-muted">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
                    >
                        Login here
                    </Link>
                </p>
            </motion.div>
        </AuthShell>
    );
};

export default Register;
