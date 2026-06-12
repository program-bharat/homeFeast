import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "hf_cart";
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToStorage(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadFromStorage(),
    },
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(
                (i) => i.menuItem._id === action.payload._id
            );
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ menuItem: action.payload, quantity: 1 });
            }
            saveToStorage(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (i) => i.menuItem._id !== action.payload
            );
            saveToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveToStorage(state.items);
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartItems = (state) => state.cart.items;
export default cartSlice.reducer;