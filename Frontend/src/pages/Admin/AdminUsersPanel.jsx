import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';

const AdminUsersPanel = ({ users, onDeleteUser }) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        const matchesSearch =
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.phone?.includes(q);
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = (id) => {
        onDeleteUser(id);
        setConfirmDeleteId(null);
    };

    return (
        <div className="space-y-6">
            <h1
                className="text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}
            >
                Users
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or phone"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'user', 'cook', 'admin'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                                roleFilter === r
                                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                    : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)]'
                            }`}
                        >
                            {r === 'all' ? 'All' : r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center text-[var(--color-text-muted)]">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface-low)]">
                                    {['User', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]/30">
                                {filtered.map((u) => (
                                    <tr key={u._id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] overflow-hidden shrink-0 flex items-center justify-center">
                                                    {u.image ? (
                                                        <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-[var(--color-text)]">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{u.email}</td>
                                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{u.phone || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : u.role === 'cook'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {u.role === 'cook' ? (
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        u.isApproved
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    {u.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {confirmDeleteId === u._id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(u._id)}
                                                        className="px-2 py-1 rounded text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmDeleteId(u._id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={13} /> Delete
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

export default AdminUsersPanel;