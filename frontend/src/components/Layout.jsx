import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
