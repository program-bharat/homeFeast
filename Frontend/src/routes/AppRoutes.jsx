import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home.jsx";
import BrowseCook from "../pages/BrowseCook.jsx"
import BrowseMenu from "../pages/BrowseMenu.jsx"

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cooks" element={<BrowseCook />} />
                <Route path="/menu" element={<BrowseMenu />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;