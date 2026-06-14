import axiosInstance from "./axiosInstance";

export const getAdminStats = () => {
    return axiosInstance.get("/admin/dashboard");
};

export const getAllUsers = () => {
    return axiosInstance.get("/admin/users");
};

export const deleteUser = (id) => {
    return axiosInstance.delete(`/admin/users/${id}`);
};

export const getPendingCooks = () => {
    return axiosInstance.get("/admin/pending-cooks");
};

export const approveCook = (id) => {
    return axiosInstance.put(`/admin/cooks/${id}/approve`);
};

export const rejectCook = (id) => {
    return axiosInstance.put(`/admin/cooks/${id}/reject`);
};

export const getAllOrders = () => {
    return axiosInstance.get("/admin/orders");
};