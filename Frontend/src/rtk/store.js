import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import menuReducer from "./slices/menuSlice.js";
import cookReducer from "./slices/cookSlice.js";
import orderReducer from "./slices/orderSlice.js";
import reviewReducer from "./slices/reviewSlice.js";
import adminReducer from "./slices/adminSlice.js";
import cartReducer from './slices/cartSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        cook: cookReducer,
        cart: cartReducer,
        order: orderReducer,
        review: reviewReducer,
        admin: adminReducer,
    },
});