import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const AdminRequestsPanel = ({ cookRequests, updatingId, handleCookRequest }) => {
    const [filter, setFilter] = useState('pending');

    const filtered = cookRequests.filter((c) =>
        filter === 'all' ? true : c.cookingRequestStatus === filter
    );

    return (
        <div className="space-y-6">
            <h1 className="text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                Cook Requests
            </h1>
            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center text-[var(--color-text-muted)]">
                        No {filter === 'all' ? '' : filter} requests.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface-low)]">
                                    {['Cook', 'Email', 'Phone', 'Location', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]/30">
                                {filtered.map((cook) => (
                                    <tr key={cook._id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] overflow-hidden shrink-0">
                                                    {cook.image ? (
                                                        <img src={cook.image} alt={cook.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[var(--color-primary-dark)]">
                                                            {cook.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-[var(--color-text)]">{cook.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{cook.email}</td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{cook.phone || '—'}</td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                            {cook.address?.city || '—'}{cook.address?.state ? `, ${cook.address.state}` : ''}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                                cook.cookingRequestStatus === 'approved' ? 'bg-green-100 text-green-700'
                                                : cook.cookingRequestStatus === 'rejected' ? 'bg-red-100 text-red-600'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {cook.cookingRequestStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {cook.cookingRequestStatus === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={updatingId === cook._id}
                                                        onClick={() => handleCookRequest(cook._id, 'approve')}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 size={13} /> Approve
                                                    </button>
                                                    <button
                                                        disabled={updatingId === cook._id}
                                                        onClick={() => handleCookRequest(cook._id, 'reject')}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle size={13} /> Reject
                                                    </button>
                                                </div>
                                            )}
                                            {cook.cookingRequestStatus !== 'pending' && (
                                                <span className="text-xs text-[var(--color-text-muted)]">No actions</span>
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

export default AdminRequestsPanel;