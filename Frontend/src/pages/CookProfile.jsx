import MenuCard from "../components/menu/MenuCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCookDetails } from "../api/cookAPI.js";
import { setSelectedCook } from "../rtk/slices/cookSlice.js";
import { addToCart } from "../rtk/slices/cartSlice.js";
import { notify } from "../utils/toast.jsx";
import { MapPin, Bike, Clock } from "lucide-react";

const CookProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedCook = useSelector((state) => state.cook.selectedCook);

    const [menus, setMenus] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            navigate("/cooks");
            return;
        }

        const fetchCook = async () => {
            try {
                setLoading(true);
                const res = await getCookDetails(id);
                const { cook, avgRating, totalReviews, menus } = res.data.data;

                dispatch(setSelectedCook(cook));
                setMenus(menus || []);
                setAvgRating(avgRating || 0);
                setTotalReviews(totalReviews || 0);
            } catch (error) {
                console.error("Error fetching cook profile:", error);
                notify.error("Failed to load cook profile.");
                navigate("/cooks");
            } finally {
                setLoading(false);
            }
        };

        fetchCook();

        return () => {
            dispatch(setSelectedCook(null));
        };
    }, [id, dispatch, navigate]);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        notify.success(`${item.name} added to cart!`);
    };

    const handleOrderNow = (item) => {
        dispatch(addToCart(item));
        navigate('/place-order');
    };

    if (loading) {
        return (
            <main className="pt-10 pb-20 max-w-[1280px] mx-auto px-4 md:px-8">
                <header className="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6 animate-pulse">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[var(--color-surface-container)]" />
                    <div className="flex-1 space-y-3">
                        <div className="h-10 bg-[var(--color-surface-container)] rounded w-48" />
                        <div className="h-4 bg-[var(--color-surface-container)] rounded w-64" />
                        <div className="h-4 bg-[var(--color-surface-container)] rounded w-40" />
                    </div>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
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
            </main>
        );
    }

    if (!selectedCook) return null;

    return (
        <main className="pt-10 pb-20 max-w-[1280px] mx-auto px-4 md:px-8">
            {/* ── Profile Header ── */}
            <header className="mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="shrink-0">
                    {selectedCook.image ? (
                        <img
                            src={selectedCook.image}
                            alt={selectedCook.name}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[var(--color-surface-container)] border-4 border-white shadow-lg flex items-center justify-center">
                            <span
                                className="text-[var(--color-primary-dark)] font-bold"
                                style={{ fontFamily: "var(--font-heading)", fontSize: "48px" }}
                            >
                                {selectedCook.name?.charAt(0).toUpperCase() || "C"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1
                        className="text-[var(--color-text)] mb-1"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "clamp(28px, 4vw, 44px)",
                            lineHeight: "1.1",
                            letterSpacing: "-0.02em",
                            fontWeight: 700,
                        }}
                    >
                        {selectedCook.name}
                    </h1>
                    {selectedCook.bio && (
                        <p
                            className="text-[var(--color-text-muted)] mb-3 max-w-xl"
                            style={{ fontSize: "14px", lineHeight: "22px" }}
                        >
                            {selectedCook.bio}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {selectedCook.address?.city && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-container)] text-[var(--color-text-muted)] text-xs font-medium">
                                <MapPin size={14} className="text-[var(--color-primary)]" />
                                {selectedCook.address.city}
                            </span>
                        )}
                        {selectedCook.serviceArea && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-container)] text-[var(--color-text-muted)] text-xs font-medium">
                                <Bike size={14} className="text-[var(--color-primary)]" />
                                {selectedCook.serviceArea}
                            </span>
                        )}
                        {selectedCook.deliveryTimings && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-container)] text-[var(--color-text-muted)] text-xs font-medium">
                                <Clock size={14} className="text-[var(--color-primary)]" />
                                {selectedCook.deliveryTimings}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="border-t border-[var(--color-border)]/40 mb-8" />

            <div className="mb-6">
                <h2
                    className="text-[var(--color-text)]"
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(20px, 3vw, 28px)",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {selectedCook.name?.split(" ")[0]}'s Menu
                </h2>
                <p className="text-[var(--color-text-muted)] mt-1" style={{ fontSize: "14px" }}>
                    {menus.length} {menus.length === 1 ? "dish" : "dishes"} available
                </p>
            </div>

            <section className="min-h-[40vh]">
                {menus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p
                            className="text-[var(--color-text-muted)]"
                            style={{ fontSize: "18px", lineHeight: "28px" }}
                        >
                            No meals available from this cook right now.
                        </p>
                    </div>
                ) : (
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

export default CookProfile;