import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;