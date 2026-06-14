import axiosInstance from "./axiosInstance";

export const getAllCooks = (params) => axiosInstance.get("/cooks", { params });
export const getCookDetails = (id) => axiosInstance.get(`/cooks/${id}`);

export const updateCookProfile = (data) =>
    axiosInstance.put("/cooks/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const getCookOrders = () => axiosInstance.get("/cooks/dashboard/orders");

export const updateOrderStatus = (id, data) =>
    axiosInstance.put(`/cooks/dashboard/orders/${id}`, data);

export const getCookEarnings = () => axiosInstance.get("/cooks/dashboard/earnings");

export const getCookDashboardStats = () => axiosInstance.get("/cooks/dashboard/stats");