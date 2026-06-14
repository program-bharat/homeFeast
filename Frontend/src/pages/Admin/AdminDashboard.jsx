import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { logout } from '../../rtk/slices/authSlice.js';
import { notify } from '../../utils/toast.jsx';
import {
    getAllUsers,
    getAllOrders,
    getPendingCooks,
    approveCook,
    rejectCook,
    getAdminStats,
    deleteUser,
} from '../../api/adminAPI.js';

import SideBar from '../../components/Layout/SideBar.jsx';
import { ADMIN_NAV } from '../../components/Layout/navigation.js';

import AdminOverviewPanel from './AdminOverviewPanel.jsx';
import AdminUsersPanel from './AdminUsersPanel.jsx';
import AdminRequestsPanel from './AdminRequestsPanel.jsx';
import AdminOrdersPanel from './AdminOrdersPanel.jsx';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeView = location.pathname.split('/').pop();

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [cookRequests, setCookRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [usersRes, ordersRes, requestsRes, statsRes] = await Promise.all([
                    getAllUsers(),
                    getAllOrders(),
                    getPendingCooks(),
                    getAdminStats(),
                ]);
                setUsers(usersRes.data?.data || []);
                setOrders(ordersRes.data?.data || []);
                setCookRequests(requestsRes.data?.data || []);
                setStats(statsRes.data?.data || null);
            } catch (err) {
                notify.error('Failed to load admin data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        notify.success('Logged out.');
        navigate('/login', { replace: true });
    };

    const handleCookRequest = async (cookId, action) => {
        try {
            setUpdatingId(cookId);
            if (action === 'approve') {
                await approveCook(cookId);
            } else {
                await rejectCook(cookId);
            }
            setCookRequests((prev) =>
                prev.map((c) =>
                    c._id === cookId
                        ? {
                              ...c,
                              cookingRequestStatus: action === 'approve' ? 'approved' : 'rejected',
                              isApproved: action === 'approve',
                          }
                        : c
                )
            );
            notify.success(`Cook ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
        } catch (err) {
            notify.error('Failed to update cook request.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            notify.success('User deleted successfully.');
        } catch (err) {
            notify.error('Failed to delete user.');
        }
    };

    // Derived stats — use API stats first, fall back to local counts
    const totalUsers = stats?.totalUsers ?? users.filter((u) => u.role === 'user').length;
    const totalCooks = stats?.approvedCooks ?? users.filter((u) => u.role === 'cook' && u.isApproved).length;
    const pendingRequests = stats?.pendingCooks ?? cookRequests.filter((c) => c.cookingRequestStatus === 'pending').length;
    const totalOrders = stats?.totalOrders ?? orders.length;
    const totalRevenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const renderPanel = () => {
        if (loading) return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );

        switch (activeView) {
            case 'users':
                return <AdminUsersPanel users={users} onDeleteUser={handleDeleteUser} />;
            case 'requests':
                return (
                    <AdminRequestsPanel
                        cookRequests={cookRequests}
                        updatingId={updatingId}
                        handleCookRequest={handleCookRequest}
                    />
                );
            case 'orders':
                return <AdminOrdersPanel orders={orders} />;
            default:
                return (
                    <AdminOverviewPanel
                        user={user}
                        totalUsers={totalUsers}
                        totalCooks={totalCooks}
                        pendingRequests={pendingRequests}
                        totalOrders={totalOrders}
                        totalRevenue={totalRevenue}
                        orders={orders}
                        cookRequests={cookRequests}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            <SideBar
                navItems={ADMIN_NAV}
                user={user}
                role="admin"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-[var(--color-border)]/40 flex items-center justify-between px-4 md:px-6 shrink-0">
                    <button
                        className="lg:hidden p-1.5 rounded-md hover:bg-[var(--color-surface-low)] transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <MenuIcon size={22} className="text-[var(--color-text-muted)]" />
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                            {user?.image ? (
                                <img src={user.image} alt={user?.name || 'Admin'} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                            )}
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-[var(--color-text)]">{user?.name}</span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderPanel()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;