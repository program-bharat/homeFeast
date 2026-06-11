import axiosInstance from "./axiosInstance";

export const registerUser = async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response;
};

export const loginUser = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response;
};