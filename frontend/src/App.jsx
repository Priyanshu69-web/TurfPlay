
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import MainLayout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Userdashboard from "./pages/User/Userdashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import MySlots from "./pages/User/MySlots";

function App() {
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
