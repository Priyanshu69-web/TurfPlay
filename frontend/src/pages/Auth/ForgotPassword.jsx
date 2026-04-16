import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import AuthShell from "../../components/ui/AuthShell";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email }).unwrap();
      toast.success(response.message || "Reset token sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reset token");
    }
  };

  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Forgot password?"
      subtitle="Enter your email and we’ll send a reset code so you can get back in quickly."
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/6 p-4">
          <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
            <Mail size={18} />
          </div>
          <div>
            <p className="font-semibold text-[var(--app-text)]">Email recovery</p>
            <p className="text-sm text-muted">We’ll guide you through verification and reset.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : <>Send Reset Code <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-emerald-500 hover:text-emerald-400">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthShell>
  );
};

export default ForgotPassword;
