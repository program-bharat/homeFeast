import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";
import cookReducer from "./slices/cookSlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        cook: cookReducer,
        order: orderReducer,
        review: reviewReducer,
        admin: adminReducer,
    },
});