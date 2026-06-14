import React from 'react';
import { useSelector } from 'react-redux';
import { IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard.jsx';

const EarningPanel = () => {
    const { orders } = useSelector((state) => state.dashboard);

    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const deliveredCount = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <div className="space-y-6">
            <h1 className="text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                Earnings
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} sub="From all delivered orders" />
                <StatCard icon={ShoppingBag} label="Orders Completed" value={deliveredCount} sub="Delivered orders" color="text-green-500" />
                <StatCard icon={Users} label="Unique Customers" value="—" sub="Coming soon" color="text-blue-500" />
            </div>
            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm p-6">
                <h2 className="font-semibold text-[var(--color-text)] mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                    Delivered Order Breakdown
                </h2>
                {deliveredOrders.length === 0 ? (
                    <p className="text-[var(--color-text-muted)] text-sm text-center py-8">No delivered orders yet.</p>
                ) : (
                    <div className="divide-y divide-[var(--color-border)]/30">
                        {deliveredOrders.map((o) => (
                            <div key={o._id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text)]">{o.menuId?.name || '—'}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{o.userId?.name} · {o.orderType}</p>
                                </div>
                                <span className="font-bold text-[var(--color-primary-dark)]">₹{o.totalPrice}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarningPanel;