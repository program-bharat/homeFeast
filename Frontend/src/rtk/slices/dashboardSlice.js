import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        orders: [],
        menus: [],
        stats: null, 
        earnings: null, 
        loading: false,
        error: null,
    },
    reducers: {
        fetchStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess(state, action) {
            state.loading = false;
            Object.assign(state, action.payload);
        },
        fetchError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateOrderStatus(state, action) {
            const { orderId, status } = action.payload;
            const order = state.orders.find((o) => o._id === orderId);
            if (order) order.status = status;
        },
    },
});

export const { fetchStart, fetchSuccess, fetchError, updateOrderStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;