import { Outlet } from "react-router-dom";
const AdminLayout = () => {
    return (
        <div className="min-h-screen flex bg-zinc-900 text-white">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;