import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { logout } from '../../rtk/slices/authSlice.js';
import { fetchStart, fetchSuccess, fetchError, updateOrderStatus as updateOrderInStore } from '../../rtk/slices/dashboardSlice.js';
import { notify } from '../../utils/toast.jsx';

import { updateOrderStatus, getCookDashboardStats } from '../../api/cookAPI.js';
import { getOrders } from '../../api/orderAPI.js';
import { getMyMenus } from '../../api/menuAPI.js';

import SideBar from '../../components/layout/SideBar.jsx';
import { COOK_NAV } from '../../components/Layout/navigation.js';

import OverviewPanel from './OverViewPanel.jsx';
import MenuPanel from './MenuPanel.jsx';
import OrderPanel from './OrderPanel.jsx';
import EarningPanel from './EarningPanel.jsx';
import ProfilePanel from './ProfilePanel.jsx';

const CookDashboard = () => {
    const { user, role } = useSelector((state) => state.auth);
    const { loading, stats } = useSelector((state) => state.dashboard);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const activeView = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchAll = async () => {
            dispatch(fetchStart());
            try {
                const [ordersRes, menusRes, statsRes] = await Promise.all([
                    getOrders(), 
                    getMyMenus(),
                    getCookDashboardStats()
                ]);

                dispatch(fetchSuccess({
                    orders: ordersRes?.data || [], 
                    menus: menusRes.data?.data || [],
                    stats: statsRes.data?.data || null,
                }));
            } catch (err) {
                dispatch(fetchError('Failed to load dashboard data.'));
                notify.error('Failed to load dashboard data.');
            }
        };
        fetchAll();
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        notify.success('Logged out.');
        navigate('/login', { replace: true });
    };

    const handleOrderAction = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await updateOrderStatus(orderId, { status: newStatus });
            dispatch(updateOrderInStore({ orderId, status: newStatus }));
            notify.success(`Order ${newStatus}.`);
        } catch (err) {
            notify.error('Failed to update order.');
        } finally {
            setUpdatingId(null);
        }
    };

    const renderPanel = () => {
        if (loading) return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );

        switch (activeView) {
            case 'orders':
                return <OrderPanel updatingId={updatingId} handleOrderAction={handleOrderAction} />;
            case 'menu':
                return <MenuPanel />;
            case 'earnings':
                return <EarningPanel />;
            case 'profile':
                return <ProfilePanel />;
            default:
                return <OverviewPanel user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            <SideBar
                navItems={COOK_NAV}
                user={user}
                role="cook"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-[var(--color-border)]/40 flex items-center justify-between px-4 md:px-6 shrink-0">
                    <button
                        className="lg:hidden p-1.5 rounded-md hover:bg-[var(--color-surface-low)] transition-colors"
                        onClick={() => setSidebarOpen(true)}>
                        <MenuIcon size={22} className="text-[var(--color-text-muted)]" />
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user?.name || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || (role === 'admin' ? 'A' : 'C')}</span>
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

export default CookDashboard;