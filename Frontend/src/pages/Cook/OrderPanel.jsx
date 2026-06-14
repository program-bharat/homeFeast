import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const OrderPanel = ({ updatingId, handleOrderAction }) => {
    const { orders } = useSelector((state) => state.dashboard);

    return (
        <div className="space-y-6">
            <h1 className="text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                Orders
            </h1>
            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                    <div className="py-16 text-center text-[var(--color-text-muted)]">No orders yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface-low)]">
                                    {['Item', 'Customer', 'Amount', 'Type', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]/30">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                                            {order.menuId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                            {order.userId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[var(--color-primary-dark)]">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="px-4 py-3 capitalize text-[var(--color-text-muted)]">
                                            {order.orderType?.replace('-', ' ')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={updatingId === order._id}
                                                        onClick={() => handleOrderAction(order._id, 'accepted')}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">
                                                        <CheckCircle2 size={13} /> Accept
                                                    </button>
                                                    <button
                                                        disabled={updatingId === order._id}
                                                        onClick={() => handleOrderAction(order._id, 'rejected')}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
                                                        <XCircle size={13} /> Reject
                                                    </button>
                                                </div>
                                            )}
                                            {order.status === 'accepted' && (
                                                <button
                                                    disabled={updatingId === order._id}
                                                    onClick={() => handleOrderAction(order._id, 'delivered')}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50">
                                                    <CheckCircle2 size={13} /> Mark Delivered
                                                </button>
                                            )}
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

export default OrderPanel;