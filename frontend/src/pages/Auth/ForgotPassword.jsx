import { useState } from "react";
import EmailInput from "../../components/ui/EmailInput";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-black/30 border border-white/10 rounded-2xl p-8 ${className}`}>
    {children}
  </div>
);

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
            <h1 className="text-4xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-gray-300">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full">
              <label className="block text-sm font-semibold mb-2 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-white/20 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Remember your password?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
