import axiosInstance from "./axiosInstance";

export const getCookReviews = (cookId) => {
    return axiosInstance.get(`/reviews/cook/${cookId}`);
};

export const addReview = (data) => {
    return axiosInstance.post("/reviews", data);
};