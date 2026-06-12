import axiosInstance from "./axiosInstance";

export const getProfile = () => {
    return axiosInstance.get("/user/profile");
};

export const updateProfile = (data) => {
    return axiosInstance.put("/user/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const changePassword = (data) => {
    return axiosInstance.put("/user/change-password", data);
};

export const getMyOrders = () => {
    return axiosInstance.get("/user/my-orders");
};