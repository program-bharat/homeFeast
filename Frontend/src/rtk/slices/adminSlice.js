import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    stats: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
    },
});

export const { setUsers, setStats } = adminSlice.actions;
export default adminSlice.reducer;