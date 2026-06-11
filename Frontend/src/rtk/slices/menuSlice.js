import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menus: [],
    selectedMenu: null,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenus: (state, action) => {
            state.menus = action.payload;
        },
        setSelectedMenu: (state, action) => {
            state.selectedMenu = action.payload;
        },
    },
});

export const { setMenus, setSelectedMenu } = menuSlice.actions;
export default menuSlice.reducer;