import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { setMenus } from '../rtk/slices/menuSlice.js';
import { addToCart } from '../rtk/slices/cartSlice.js';
import { getAllMenus } from '../api/menuAPI.js';
import { notify } from '../utils/toast.jsx';
import MenuCard from '../components/menu/MenuCard.jsx';

const CATEGORIES = [
    { label: 'All Meals', value: '' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
];

const MEAL_TYPES = [
    { label: 'All', value: '' },
    { label: 'Veg', value: 'veg' },
    { label: 'Non-Veg', value: 'non-veg' },
];

const BrowseMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menus = useSelector((state) => state.menu.menus);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeMealType, setActiveMealType] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (activeCategory) params.category = activeCategory;
            if (activeMealType) params.mealType = activeMealType;
            if (search.trim()) params.search = search.trim();
            const res = await getAllMenus(params);
            dispatch(setMenus(res.data.data || []));
        } catch (err) {
            notify.error(err || 'Failed to load meals.');
            dispatch(setMenus([]));
        } finally {
            setLoading(false);
        }
    }, [activeCategory, activeMealType, search, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMenus();
        }, 400);
        return () => clearTimeout(timer);
    }, [fetchMenus]);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        notify.success(`${item.name} added to cart!`);
    };

    const handleOrderNow = (item) => {
        dispatch(addToCart(item));
        navigate('/place-order');
    };

    return (
        <main className="pt-10 pb-20">
            <section className="max-w-[1280px] mx-auto px-4 md:px-8 pb-12">
                <div className="max-w-3xl mx-auto text-center mb-6">
                    <h1
                        className="text-[var(--color-text)] mb-4"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            lineHeight: '1.15',
                            letterSpacing: '-0.02em',
                            fontWeight: 700,
                        }}
                    >
                        Find your next favorite feast
                    </h1>
                    <p
                        className="text-[var(--color-text-muted)] mb-6"
                        style={{ fontSize: '18px', lineHeight: '28px', fontWeight: 400 }}
                    >
                        Discover authentic home-cooked meals prepared by talented local chefs.
                    </p>
                    <div className="relative max-w-2xl mx-auto">
                        <Search
                            size={22}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-primary)] pointer-events-none"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for meals, cuisines, or cooks..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-[var(--color-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] shadow-sm transition-all"
                            style={{ fontSize: '16px', lineHeight: '24px' }}
                        />
                    </div>
                </div>

                {/* Category filter pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`px-6 py-2.5 rounded-md transition-all active:scale-95
                                    ${isActive
                                        ? 'bg-[var(--color-primary-dark)] hover:bg-primary text-white shadow-md cursor-pointer'
                                        : 'bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer'
                                    }`}
                                style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Meal type pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {MEAL_TYPES.map((mt) => {
                        const isActive = activeMealType === mt.value;
                        return (
                            <button
                                key={mt.value}
                                onClick={() => setActiveMealType(mt.value)}
                                className={`px-5 py-2 rounded-md transition-all active:scale-95 text-sm
                                    ${isActive
                                        ? 'bg-[var(--color-primary-dark)] hover:bg-primary text-white shadow-sm cursor-pointer'
                                        : 'bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer'
                                    }`}
                                style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                            >
                                {mt.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Meal Grid */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-8 min-h-[80vh]">
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-md overflow-hidden border border-[var(--color-border)]/30 animate-pulse">
                                <div className="aspect-[4/3] bg-[var(--color-surface-container)]" />
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-[var(--color-surface-container)] rounded w-3/4" />
                                    <div className="h-4 bg-[var(--color-surface-container)] rounded w-1/2" />
                                    <div className="h-10 bg-[var(--color-surface-container)] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && menus.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="text-[var(--color-text-muted)]" style={{ fontSize: '18px', lineHeight: '28px' }}>
                            No meals found{search ? ` for "${search}"` : ''}. Try a different filter.
                        </p>
                    </div>
                )}

                {!loading && menus.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menus.map((item) => (
                            <MenuCard
                                key={item._id}
                                item={item}
                                onAddToCart={handleAddToCart}
                                onOrderNow={handleOrderNow}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default BrowseMenu;