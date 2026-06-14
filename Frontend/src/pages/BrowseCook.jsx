import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CookCard from '../components/cook/CookCard.jsx';
import { getAllCooks } from '../api/cookAPI.js';
import { notify } from '../utils/toast.jsx';

const BrowseCook = () => {
    const [search, setSearch] = useState('');
    const [allCooks, setAllCooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCooks()
            .then((res) => setAllCooks(res.data.data))
            .catch(() => notify.error('Failed to load cooks'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = allCooks.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            (c.bio && c.bio.toLowerCase().includes(q)) ||
            (c.serviceArea && c.serviceArea.toLowerCase().includes(q))
        );
    });

    return (
        <main className="pt-10 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto min-h-screen">
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1
                        className="text-[var(--color-text)]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '32px',
                            lineHeight: '40px',
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Local Home Cooks near you
                    </h1>
                    <p
                        className="text-[var(--color-text-muted)] mt-2"
                        style={{ fontSize: '16px', lineHeight: '24px' }}
                    >
                        Authentic meals prepared with love in neighborhood kitchens.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or cuisine"
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                            style={{ fontSize: '16px', lineHeight: '24px', color: 'var(--color-text)' }}
                        />
                    </div>
                </div>
            </header>

            {/* Cook Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-md overflow-hidden border border-[var(--color-border)]/30 animate-pulse"
                        >
                            <div className="aspect-[4/3] bg-[var(--color-surface-container)]" />
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-[var(--color-surface-container)] rounded w-3/4" />
                                <div className="h-4 bg-[var(--color-surface-container)] rounded w-1/2" />
                                <div className="h-10 bg-[var(--color-surface-container)] rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cook) => (
                        <CookCard key={cook._id} cook={cook} />
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-20 text-[var(--color-text-muted)]">
                            <p style={{ fontSize: '18px', lineHeight: '28px' }}>
                                No cooks match "{search}". Try a different name or cuisine.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default BrowseCook;