import { Outlet } from "react-router-dom";
const CookLayout = () => {
    return (
        <div className="min-h-screen flex bg-slate-50">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default CookLayout;