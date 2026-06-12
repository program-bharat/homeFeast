import axiosInstance from "./axiosInstance";

export const createOrder = async (data) => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
};

export const getOrders = async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
};

export const getOrderDetails = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
};

export const cancelOrder = async (id) => {
    const response = await axiosInstance.patch(`/orders/${id}/cancel`);
    return response.data;
};