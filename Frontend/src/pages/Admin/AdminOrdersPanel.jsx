import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const AdminOrdersPanel = ({ orders }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = orders.filter((o) => {
        const q = search.toLowerCase();
        const matchesSearch =
            o.menuId?.name?.toLowerCase().includes(q) ||
            o.userId?.name?.toLowerCase().includes(q) ||
            o.cookId?.name?.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                    All Orders
                </h1>
                <span className="text-sm text-[var(--color-text-muted)] font-medium">
                    Platform Revenue: <span className="text-[var(--color-primary-dark)] font-bold">₹{totalRevenue.toFixed(0)}</span>
                </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by item, customer or cook"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'accepted', 'delivered', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${statusFilter === s
                                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                    : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)]'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center text-[var(--color-text-muted)]">No orders found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface-low)]">
                                    {['Item', 'Customer', 'Cook', 'Amount', 'Type', 'Status'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]/30">
                                {filtered.map((order) => (
                                    <tr key={order._id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                                            {order.menuId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                            {order.userId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                            {order.cookId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[var(--color-primary-dark)]">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="px-4 py-3 capitalize text-[var(--color-text-muted)]">
                                            {order.orderType?.replace('-', ' ') || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPanel;