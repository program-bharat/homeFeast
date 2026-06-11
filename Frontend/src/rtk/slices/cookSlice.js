import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cooks: [],
    selectedCook: null,
};

const cookSlice = createSlice({
    name: "cook",
    initialState,
    reducers: {
        setCooks: (state, action) => {
            state.cooks = action.payload;
        },
        setSelectedCook: (state, action) => {
            state.selectedCook = action.payload;
        },
    },
});

export const { setCooks, setSelectedCook } = cookSlice.actions;
export default cookSlice.reducer;