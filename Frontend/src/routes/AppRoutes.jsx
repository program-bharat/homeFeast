import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home.jsx";
import BrowseCook from "../pages/BrowseCook.jsx";
import BrowseMenu from "../pages/BrowseMenu.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PlaceOrder from "../pages/PlaceOrder.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import RoleBasedRoute from "./RoleBasedRoute.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import OrderDetails from "../pages/OrderDetails.jsx";
import Profile from "../pages/Profile.jsx";
import CookProfile from "../pages/CookProfile.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;