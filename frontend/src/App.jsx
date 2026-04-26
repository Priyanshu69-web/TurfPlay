import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setToken, setUser, setLoading } from "./redux/slices/authSlice";
import { useLazyGetUserQuery } from "./redux/api/authApi";
import { AuthProvider } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import MainLayout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import UserDashboard from "./pages/User/Userdashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import NotFound from "./pages/NotFound";

import { Toaster } from "sonner";

function AppContent() {
  const dispatch = useDispatch();
  const [triggerGetUser] = useLazyGetUserQuery();
  const { isDark } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        dispatch(setToken(token));

        const res = await triggerGetUser().unwrap();
        dispatch(setUser({ token, user: res.user }));
      } catch (err) {
        dispatch(logout());
        localStorage.removeItem("token");
        toast.error(err.message || "Session expired. Please login again.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, triggerGetUser]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <Toaster
        position="top-right"
        theme={isDark ? 'dark' : 'light'}
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            fontFamily: 'inherit',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Guest only routes */}
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>

          {/* User routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard/*" element={<UserDashboard />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
