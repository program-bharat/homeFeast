import axiosInstance from "./axiosInstance";

// Public
export const getAllCooks = (params) => {
    return axiosInstance.get("/cooks", { params });
};

export const getCookDetails = (id) => {
    return axiosInstance.get(`/cooks/${id}`);
};

// Cook
export const getCookProfile = () => {
    return axiosInstance.get("/cooks/profile/me");
};

export const updateCookProfile = (data) => {
    return axiosInstance.put("/cooks/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getCookOrders = () => {
    return axiosInstance.get("/cooks/orders");
};

export const updateOrderStatus = (id, data) => {
    return axiosInstance.put(`/cooks/orders/${id}`, data);
};

export const getCookEarnings = () => {
    return axiosInstance.get("/cooks/earnings");
};