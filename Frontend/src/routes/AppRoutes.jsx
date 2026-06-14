import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "../layouts/MainLayout.jsx";
import CookLayout from "../layouts/CookLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import Home from "../pages/Home.jsx";
import BrowseCook from "../pages/BrowseCook.jsx";
import BrowseMenu from "../pages/BrowseMenu.jsx";
import PlaceOrder from "../pages/PlaceOrder.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import OrderDetails from "../pages/OrderDetails.jsx";
import Profile from "../pages/Profile.jsx";
import CookProfile from "../pages/CookProfile.jsx";

import CookDashboard from "../pages/Cook/CookDashboard.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

import PrivateRoute from "./PrivateRoute.jsx";
import RoleBasedRoute from "./RoleBasedRoute.jsx";

const HomeOrDashboardRedirect = () => {
    const { token, role } = useSelector((state) => state.auth);

    if (token) {
        if (role === "cook") return <Navigate to="/cook/dashboard" replace />;
        if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    }
    return <Home />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomeOrDashboardRedirect />} />
                <Route path="/cooks" element={<BrowseCook />} />
                <Route path="/menu" element={<BrowseMenu />} />
                <Route path="/cook-profile/:id" element={<CookProfile />} />

                <Route
                    path="/place-order"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="user">
                                <PlaceOrder />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="user">
                                <MyOrders />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/orders-details/:id"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="user">
                                <OrderDetails />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="user">
                                <Profile />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
            </Route>

            {/* COOK ROUTES */}
            <Route element={<CookLayout />}>
                <Route
                    path="/cook/dashboard"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="cook">
                                <CookDashboard />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cook/menu"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="cook">
                                <CookDashboard />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cook/orders"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="cook">
                                <CookDashboard />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cook/earnings"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="cook">
                                <CookDashboard />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cook/profile"
                    element={
                        <PrivateRoute>
                            <RoleBasedRoute role="cook">
                                <CookDashboard />
                            </RoleBasedRoute>
                        </PrivateRoute>
                    }
                />
            </Route>

            {/* ADMIN ROUTES */}
            <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={
                    <PrivateRoute>
                        <RoleBasedRoute role="admin">
                            <AdminDashboard />
                        </RoleBasedRoute>
                    </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                    <PrivateRoute>
                        <RoleBasedRoute role="admin">
                            <AdminDashboard />
                        </RoleBasedRoute>
                    </PrivateRoute>
                } />
                <Route path="/admin/requests" element={
                    <PrivateRoute>
                        <RoleBasedRoute role="admin">
                            <AdminDashboard />
                        </RoleBasedRoute>
                    </PrivateRoute>
                } />
                <Route path="/admin/orders" element={
                    <PrivateRoute>
                        <RoleBasedRoute role="admin">
                            <AdminDashboard />
                        </RoleBasedRoute>
                    </PrivateRoute>
                } />
            </Route>

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;