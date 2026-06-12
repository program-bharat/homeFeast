import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from "../../hooks/UseScrollRevel.jsx";

const MenuCard = ({ item, onAddToCart, onOrderNow }) => {
    const { name, price, image, cookId } = item;
    const [added, setAdded] = useState(false);
    useScrollReveal();

    const { token, role } = useSelector((state) => state.auth);
    const isUser = token && role === "user";
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!isUser) {
            navigate('/login');
            return;
        }
        if (onAddToCart) {
            onAddToCart(item);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        }
    };

    const handleOrderNow = () => {
        if (!isUser) {
            navigate('/login');
            return;
        }
        if (onOrderNow) {
            onOrderNow(item);
        }
    };

    return (
        <div className="reveal dealay-1 meal-card bg-white rounded-md overflow-hidden border border-[var(--color-border)]/30 group cursor-pointer transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={image || "https://placehold.co/400x300/ffe9e2/ab3500?text=No+Image"}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Price Badge */}
                <div
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-[var(--color-primary)]"
                    style={{ fontSize: "12px", lineHeight: "16px", fontWeight: 600 }}
                >
                    ₹{Number(price).toFixed(2)}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3
                        className="text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "20px",
                            lineHeight: "28px",
                            fontWeight: 600,
                        }}
                    >
                        {name}
                    </h3>
                </div>

                {/* Cook */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[var(--color-surface-container)] shrink-0">
                        <img
                            src={cookId?.image || "https://placehold.co/24x24/ffe9e2/ab3500?text=C"}
                            alt={cookId?.name || "Cook"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span
                        className="text-[var(--color-text-muted)] truncate"
                        style={{ fontSize: "14px", lineHeight: "20px", fontWeight: 400 }}
                    >
                        {cookId?.name || "Home Cook"}
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                    {/* Add to Feast */}
                    <button
                        onClick={handleAddToCart}
                        className={`w-full rounded-md py-2.5 px-4 font-semibold text-white transition-all duration-200 cursor-pointer active:scale-95
                            ${added
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-primary hover:bg-[var(--color-primary-dark)]"
                            }`}
                        style={{ fontSize: "14px", lineHeight: "20px", fontWeight: 600 }}
                    >
                        {added ? "✓ Added!" : "Add to Feast"}
                    </button>

                    {/* Order Now */}
                    <button
                        onClick={handleOrderNow}
                        className="w-full rounded-md py-2.5 px-4 font-semibold text-[var(--color-primary-dark)] border border-[var(--color-primary-dark)] bg-transparent hover:bg-[var(--color-primary-dark)] hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
                        style={{ fontSize: "14px", lineHeight: "20px", fontWeight: 600 }}
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;