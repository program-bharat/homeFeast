import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UtensilsCrossed, ClipboardList, IndianRupee, ShoppingBag, ChevronRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const AdminOverviewPanel = ({
    user,
    totalUsers,
    totalCooks,
    pendingRequests,
    totalOrders,
    totalRevenue,
    orders,
    cookRequests,
}) => (
    <div className="space-y-6">
        <div>
            <h1
                className="text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}
            >
                Welcome back, {user?.name}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
                Here's a snapshot of what's happening on HomeFeast.
            </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
            <StatCard icon={Users} label="Total Users" value={totalUsers} sub="Registered customers" color="text-blue-500" />
            <StatCard icon={UtensilsCrossed} label="Active Cooks" value={totalCooks} sub="Approved cooks" color="text-green-500" />
            <StatCard icon={ClipboardList} label="Pending Requests" value={pendingRequests} sub="Awaiting approval" color="text-amber-500" />
            <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} sub="All time" color="text-purple-500" />
            <StatCard
                icon={IndianRupee}
                label="Platform Revenue"
                value={`₹${Number(totalRevenue).toFixed(0)}`}
                sub="From delivered orders"
            />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/40">
                <h2
                    className="font-semibold text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}
                >
                    Recent Orders
                </h2>
                <Link
                    to="/admin/orders"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                    View all <ChevronRight size={14} />
                </Link>
            </div>
            {orders.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">No orders yet.</div>
            ) : (
                <div className="divide-y divide-[var(--color-border)]/30">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between px-5 py-3.5">
                            <div className="min-w-0">
                                <p className="font-medium text-sm text-[var(--color-text)] truncate">
                                    {order.menuId?.name || 'Menu item'}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                    {order.userId?.name || 'Customer'} → {order.cookId?.name || 'Cook'} · ₹{order.totalPrice}
                                </p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Pending Cook Requests */}
        <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/40">
                <h2
                    className="font-semibold text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}
                >
                    Pending Cook Requests
                </h2>
                <Link
                    to="/admin/requests"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                    View all <ChevronRight size={14} />
                </Link>
            </div>
            {cookRequests.filter((c) => c.cookingRequestStatus === 'pending').length === 0 ? (
                <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">No pending requests.</div>
            ) : (
                <div className="divide-y divide-[var(--color-border)]/30">
                    {cookRequests
                        .filter((c) => c.cookingRequestStatus === 'pending')
                        .slice(0, 5)
                        .map((cook) => (
                            <div key={cook._id} className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] overflow-hidden shrink-0 flex items-center justify-center">
                                        {cook.image ? (
                                            <img src={cook.image} alt={cook.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                                                {cook.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-[var(--color-text)] truncate">{cook.name}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] truncate">{cook.email}</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shrink-0">
                                    Pending
                                </span>
                            </div>
                        ))}
                </div>
            )}
        </div>
    </div>
);

export default AdminOverviewPanel;