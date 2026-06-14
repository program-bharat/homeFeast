import Navbar from "../components/Layout/NavBar.jsx";
import Footer from "../components/Layout/Footer.jsx";
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