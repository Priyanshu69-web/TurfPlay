import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="pt-0">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
