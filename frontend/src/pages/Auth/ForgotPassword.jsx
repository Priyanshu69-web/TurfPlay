import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Mail, ShieldAlert } from "lucide-react";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import AuthShell from "../../components/ui/AuthShell";
import Spinner from "../../components/ui/Spinner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Sending reset code…");
        try {
            await forgotPassword({ email }).unwrap();
            toast.success("Reset code sent to your email!", { id: toastId });
            navigate("/reset-password", { state: { email } });
        } catch (error) {
            toast.error(error?.data?.message || "Failed to send reset code.", { id: toastId });
        }
    };

    return (
        <AuthShell
            eyebrow="Account Recovery"
            title="Forgot password?"
            subtitle="Enter the email address associated with your account and we'll send you a 6-digit code to reset your password."
        >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-500/80">
                    <ShieldAlert size={18} />
                    <p className="text-sm font-medium">Verify your identity to reset password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-3 pl-11 pr-4 text-[var(--app-text)] placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isLoading}
                        className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                    >
                        {isLoading ? <><Spinner size={18} /> Sending…</> : <>Send Reset Code <ArrowRight size={18} /></>}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-muted">
                        Suddenly remembered?{" "}
                        <Link to="/login" className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400">
                            Go back to Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </AuthShell>
    );
};

export default ForgotPassword;
