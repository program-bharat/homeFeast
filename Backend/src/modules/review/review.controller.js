import Review from "../../models/Review.js";
import Order from "../../models/Order.js";

export const getCookReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ cookId: req.params.cookId })
            .populate({ path: 'userId', select: 'name image' })
            .sort({ createdAt: -1 });
        const avgRating =
            reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : 0;
        res.status(200).json({
            success: true,
            message: 'Cook Ratings Fetched Successfully',
            data: {
                reviews,
                avgRating,
                totalReviews: reviews.length,
            }
        })
    } catch (error) {
        next(error);
    }
}
export const addReview = async (req, res, next) => {
    try {
        const { orderId, rating, comment } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order Not Found',
            })
        }
        if (!order.userId.equals(req.user.id)) {
            return res.status(404).json({
                success: false,
                message: 'Not authorized',
            });
        }
        if (order.status !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'You can only review a delivered order',
            });
        }
        const existingReview = await Review.findOne({ orderId, userId: req.user.id });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You already reviewed this order'
            });
        }
        const review = await Review.create({
            userId: req.user.id,
            cookId: order.cookId,
            orderId,
            rating,
            comment,
        });
        res.status(201).json({
            success: true,
            message: 'Review added',
            data: review
        });
    } catch (error) {
        next(error);
    }
}
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }
        await review.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Review deleted Successfully',
        })
    } catch (error) {
        next(error);
    }
}