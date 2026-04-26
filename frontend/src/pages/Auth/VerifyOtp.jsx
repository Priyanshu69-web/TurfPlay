import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AuthShell from "../../components/ui/AuthShell";
import Spinner from "../../components/ui/Spinner";
import { useVerifyOtpMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit code.");
            return;
        }

        const toastId = toast.loading("Verifying code…");
        try {
            const res = await verifyOtp({ email, otp }).unwrap();
            toast.success("Email verified successfully!", { id: toastId });
            
            localStorage.setItem("token", res.token);
            dispatch(setUser({ user: res.user, token: res.token }));
            navigate("/");
        } catch (err) {
            toast.error(err?.data?.message || "Verification failed.", { id: toastId });
        }
    };

    return (
        <AuthShell
            eyebrow="Verification"
            title="Check your email"
            subtitle={`We've sent a 6-digit code to ${email}. Please enter it below to verify your account.`}
        >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400">
                    <CheckCircle2 size={18} />
                    <p className="text-sm font-medium">Verify your email to continue.</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="mb-4 block text-center text-sm font-semibold text-[var(--app-text)]">
                            Enter 6-digit Code
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-5 text-center text-4xl font-bold tracking-[0.8em] text-[var(--app-text)] outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isLoading}
                        className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                    >
                        {isLoading ? <><Spinner size={20} /> Verifying…</> : <>Verify Account <ArrowRight size={20} /></>}
                    </motion.button>

                    <button 
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full text-center text-sm text-muted hover:text-[var(--app-text)] transition"
                    >
                        Back to Login
                    </button>
                </form>
            </motion.div>
        </AuthShell>
    );
};

export default VerifyOtp;
