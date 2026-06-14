import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleBasedRoute = ({ role, children }) => {
    const { role: userRole } = useSelector((state) => state.auth);
    if (userRole !== role) {
        if (userRole === "cook") return <Navigate to="/cook/dashboard" replace />;
        if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default RoleBasedRoute;