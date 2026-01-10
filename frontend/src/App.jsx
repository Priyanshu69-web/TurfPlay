
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setToken, setUser, setLoading } from "./redux/slices/authSlice";
import { useLazyGetUserQuery } from "./redux/api/authApi";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import MainLayout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Userdashboard from "./pages/User/Userdashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import MySlots from "./pages/User/MySlots";
import { toast } from "sonner";


function App() {
  const dispatch = useDispatch();
  const [triggerGetUser] = useLazyGetUserQuery();

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
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>


          {/* Admin route */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>


          {/* user route */}
          <Route element={< PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<Userdashboard />} />
            <Route path="user/slots" element={<MySlots />} />
          </Route>

          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
