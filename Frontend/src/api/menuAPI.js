import axiosInstance from "./axiosInstance";

// Public
export const getAllMenus = (params) => {
    return axiosInstance.get("/menu", { params });
};

export const getMenuDetails = (id) => {
    return axiosInstance.get(`/menu/${id}`);
};

export const getCookMenus = (cookId) => {
    return axiosInstance.get(`/menu/cook/${cookId}`);
};

// Cook
export const getMyMenus = () => {
    return axiosInstance.get("/menu/my-menus");
};

export const createMenu = (data) => {
    return axiosInstance.post("/menu", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateMenu = (id, data) => {
    return axiosInstance.put(`/menu/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteMenu = (id) => {
    return axiosInstance.delete(`/menu/${id}`);
};

export const toggleMenuAvailability = (id) => {
    return axiosInstance.put(`/menu/${id}/availability`);
};