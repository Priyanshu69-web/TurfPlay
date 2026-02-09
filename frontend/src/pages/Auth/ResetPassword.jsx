import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput";
import toast from "react-hot-toast";
import { useVerifyResetTokenMutation, useResetPasswordMutation } from "../../redux/api/authApi";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-black/30 border border-white/10 rounded-2xl p-8 ${className}`}>
    {children}
  </div>
);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
          <p className="text-gray-400 mb-6">Please start from forgot password page</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden flex items-center justify-center py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-300">
              {step === 1 ? "Enter the reset code sent to your email" : "Create your new password"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleVerifyToken} className="space-y-6">
              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg">
                We sent a 6-digit code to <span className="text-green-400">{email}</span>
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-center text-2xl tracking-widest focus:outline-none focus:border-green-500/50 focus:bg-white/20 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="w-full">
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-white/20 transition"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-white/20 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
