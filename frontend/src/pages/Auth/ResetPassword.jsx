import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { useVerifyResetTokenMutation, useResetPasswordMutation } from "../../redux/api/authApi";
import AuthShell from "../../components/ui/AuthShell";
import Spinner from "../../components/ui/Spinner";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [step, setStep] = useState(1);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [verifyToken, { isLoading: isVerifying }] = useVerifyResetTokenMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    if (!email) {
        return (
            <AuthShell eyebrow="Error" title="Invalid session" subtitle="Please go back to the forgot password page to initiate a reset.">
                <button onClick={() => navigate("/forgot-password")} className="brand-gradient w-full py-3 rounded-2xl font-semibold text-white">
                    Return to Forgot Password
                </button>
            </AuthShell>
        );
    }

    const handleVerifyToken = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Verifying code…");
        try {
            const res = await verifyToken({ email, resetToken }).unwrap();
            if (res.isValid) {
                setStep(2);
                toast.success("Identity verified! Set your new password.", { id: toastId });
            } else {
                toast.error("Invalid or expired code.", { id: toastId });
            }
        } catch (err) {
            toast.error(err?.data?.message || "Verification failed.", { id: toastId });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        const toastId = toast.loading("Updating password…");
        try {
            await resetPassword({ email, resetToken, newPassword }).unwrap();
            toast.success("Password updated successfully!", { id: toastId });
            navigate("/login");
        } catch (err) {
            toast.error(err?.data?.message || "Reset failed.", { id: toastId });
        }
    };

    const inputBase = "w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-3 pl-11 pr-4 text-[var(--app-text)] placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

    return (
        <AuthShell
            eyebrow="Account Security"
            title="Reset password"
            subtitle={step === 1 ? "Verify the 6-digit code sent to your email." : "Choose a strong password to secure your account."}
        >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/6 p-4">
                    <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                        <KeyRound size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--app-text)]">Security check</p>
                        <p className="text-sm text-muted">{step === 1 ? "Step 1: Verification" : "Step 2: New Password"}</p>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleVerifyToken} className="space-y-6">
                        <div>
                            <label className="mb-4 block text-center text-sm font-semibold text-[var(--app-text)]">Verification Code</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-4 text-center text-4xl font-bold tracking-[0.8em] text-[var(--app-text)] outline-none focus:border-emerald-500"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isVerifying}
                            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                        >
                            {isVerifying ? <><Spinner size={18} /> Verifying…</> : <>Verify Code <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">New Password</label>
                            <div className="relative">
                                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className={`${inputBase} pr-12`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--app-text)] transition">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    className={`${inputBase} pr-12`}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isResetting}
                            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                        >
                            {isResetting ? <><Spinner size={18} /> Updating…</> : "Reset Password"}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </AuthShell>
    );
};

export default ResetPassword;
