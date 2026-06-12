import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    orders: [],
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
            state.error = null;
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearUserData: (state) => {
            state.profile = null;
            state.orders = [];
            state.error = null;
        },
    },
});

export const { setProfile, setOrders, setLoading, setError, clearUserData } = userSlice.actions;
export default userSlice.reducer;