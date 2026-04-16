import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { ArrowRight, KeyRound } from "lucide-react";
import { useVerifyResetTokenMutation, useResetPasswordMutation } from "../../redux/api/authApi";
import AuthShell from "../../components/ui/AuthShell";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verifyToken, { isLoading: isVerifying }] = useVerifyResetTokenMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  if (!email) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="surface-card-strong max-w-md p-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--app-text)]">Invalid access</h1>
          <p className="mt-3 text-muted">Please start from the forgot password page.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="brand-gradient mt-6 rounded-2xl px-6 py-3 font-medium text-white"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyToken({ email, resetToken }).unwrap();
      if (response.isValid) {
        setStep(2);
        toast.success("Token verified!");
      } else {
        toast.error("Invalid or expired token");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Token verification failed");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await resetPassword({
        email,
        resetToken,
        newPassword,
      }).unwrap();
      toast.success(response.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <AuthShell
      eyebrow="Reset access"
      title="Reset password"
      subtitle="Verify the code we sent, then choose a new password to secure your account."
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-white/6 p-4">
          <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white">
            <KeyRound size={18} />
          </div>
          <div>
            <p className="font-semibold text-[var(--app-text)]">Verification flow</p>
            <p className="text-sm text-muted">
              {step === 1 ? "Enter the reset code sent to your email" : "Create your new password"}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyToken} className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted">
              We sent a 6-digit code to <span className="text-emerald-500">{email}</span>
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                Reset Code
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-center text-2xl tracking-widest text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : <>Verify Code <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none"
                required
              />
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition disabled:opacity-50"
            >
              {isResetting ? "Resetting..." : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </motion.div>
    </AuthShell>
  );
};

export default ResetPassword;
