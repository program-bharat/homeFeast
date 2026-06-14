import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle2, TrendingUp, IndianRupee, ChevronRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const OverviewPanel = ({ user }) => {
    const { orders, menus } = useSelector((state) => state.dashboard);

    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const acceptedCount = orders.filter((o) => o.status === 'accepted').length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
    const totalRevenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">Here's what's happening in your kitchen today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Clock} label="Pending Orders" value={pendingCount} sub="Awaiting your response" color="text-amber-500" />
                <StatCard icon={TrendingUp} label="Delivered" value={deliveredCount} sub="All time" color="text-green-500" />
                <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toFixed(0)}`} sub="From delivered orders" />
            </div>

            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/40">
                    <h2 className="font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                        Recent Orders
                    </h2>
                    <Link to="/cook/orders" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                        View all <ChevronRight size={14} />
                    </Link>
                </div>
                {orders.slice(0, 5).length === 0 ? (
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
                                        {order.userId?.name || 'Customer'} · ₹{order.totalPrice}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/40">
                    <h2 className="font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                        My Menu ({menus.length} items)
                    </h2>
                    <Link to="/cook/menu" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                        Manage <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                    {menus.slice(0, 8).map((m) => (
                        <div key={m._id} className="rounded-lg overflow-hidden border border-[var(--color-border)]/40 group">
                            <div className="h-60 bg-[var(--color-surface-container)] overflow-hidden">
                                <img src={m.image || 'https://placehold.co/200x96/ffe9e2/ab3500?text=🍛'}
                                    alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-2">
                                <p className="text-md font-semibold text-[var(--color-text)] truncate">{m.name}</p>
                                <p className="text-xs text-[var(--color-primary)] font-bold mt-0.5">₹{m.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewPanel;