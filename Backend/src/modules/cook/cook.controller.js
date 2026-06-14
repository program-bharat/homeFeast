import User from '../../models/User.js';
import Menu from '../../models/Menu.js';
import Order from '../../models/Order.js';
import Review from '../../models/Review.js';
import cloudinary from '../../config/cloudinary.js';
import uploadToCloudinary from '../../utils/uploadToCloudinary.js';

export const getAllCooks = async (req, res, next) => {
    try {
        const { city, search } = req.query;
        const filter = {
            role: 'cook',
            isApproved: true,
        };
        if (city) {
            filter['address.city'] = { $regex: city, $options: 'i' };
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { serviceArea: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
            ];
        }
        const cooks = await User.find(filter).select(
            'name email phone image address serviceArea deliveryTimings bio isApproved'
        );
        res.status(200).json({
            success: true,
            message: 'All Cooks Fetched Successfully',
            data: cooks,
        });
    } catch (error) {
        next(error);
    }
}

export const getCookProfile = async (req, res, next) => {
    try {
        const cook = await User.findOne({ _id: req.params.id, role: "cook", isApproved: true, })
            .select("-password");
        if (!cook) {
            return res.status(404).json({
                success: false,
                message: "Cook not found",
            });
        }
        const reviews = await Review.find({ cookId: req.params.id, });
        const menus = await Menu.find({ cookId: req.params.id, isAvailable: true, }).sort({ createdAt: -1 });
        const avgRating =
            reviews.length > 0
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                : 0;
        const totalReviews = reviews.length;
        res.status(200).json({
            success: true,
            message: "Cook Profile Fetched Successfully",
            data: {
                cook,
                avgRating,
                totalReviews,
                menus,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateCookProfile = async (req, res, next) => {
    try {
        const cook = await User.findById(req.user.id).select('-password');
        if (!cook) {
            return res.status(404).json({
                success: false,
                message: 'Cook Profile not found',
            });
        }
        const { name, phone, bio, serviceArea, deliveryTimings, address } = req.body;
        if (name) cook.name = name;
        if (phone) cook.phone = phone;
        if (bio !== undefined) cook.bio = bio;
        if (serviceArea !== undefined) cook.serviceArea = serviceArea;
        if (deliveryTimings !== undefined) cook.deliveryTimings = deliveryTimings;
        if (address) {
            if (address.street !== undefined) cook.address.street = address.street;
            if (address.city !== undefined) cook.address.city = address.city;
            if (address.state !== undefined) cook.address.state = address.state;
            if (address.pincode !== undefined) cook.address.pincode = address.pincode;
        }
        if (req.file) {
            if (cook.imagePublicId) {
                await cloudinary.uploader.destroy(cook.imagePublicId);
            }
            const result = await uploadToCloudinary(
                req.file.buffer,
                'homefeast/cooks'
            );
            cook.image = result.secure_url;
            cook.imagePublicId = result.public_id;
        }
        await cook.save();
        res.status(200).json({
            success: true,
            message: 'Profile Updated Successfully',
            data: cook,
        })
    } catch (error) {
        next(error);
    }
}

export const getCookOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ cookId: req.user.id })
            .populate({ path: 'userId', select: 'name email phone address' })
            .populate({ path: 'menuId', select: 'name mealType cuisine category price' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Orders Fetched for Cook',
            data: orders,
        });
    } catch (error) {
        next(error);
    }
}

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected', 'delivered'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        if (!order.cookId.equals(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cancelled orders cannot be updated',
            });
        }
        order.status = status;
        await order.save();
        res.status(200).json({
            success: true,
            message: `Order ${status}`,
            data: order,
        });
    } catch (error) {
        next(error);
    }
}

export const getCookEarnings = async (req, res, next) => {
    try {
        const orders = await Order.find({
            cookId: req.user.id,
        })
            .populate('userId', 'name')
            .populate('menuId', 'name price');
        const totalEarnings = orders
            .filter(order => ['accepted', 'delivered'].includes(order.status))
            .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

        const totalOrders = orders.length;
        const totalCompletedOrders = orders.filter(order => ['accepted', 'delivered'].includes(order.status)).length;
        const totalCancelledOrders = orders.filter(order => order.status === 'cancelled').length;
        const orderSummary = orders.map(order => ({
            id: order._id,
            customerName: order.userId?.name,
            menuName: order.menuId?.name,
            status: order.status,
            totalPrice: order.totalPrice,
            orderType: order.orderType,
            createdAt: order.createdAt,
        }));

        res.status(200).json({
            success: true,
            message: 'Cook Earnings data fetched successfully',
            data: {
                totalEarnings,
                totalOrders,
                totalCompletedOrders,
                totalCancelledOrders,
                orders: orderSummary,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const getCookDashboardStats = async (req, res, next) => {
    try {
        const cookId = req.user.id;
        const orders = await Order.find({ cookId });
        const pendingCount = orders.filter(order => order.status === 'pending').length;
        const acceptedCount = orders.filter(order => order.status === 'accepted').length;
        const deliveredCount = orders.filter(order => order.status === 'delivered').length;
        const totalRevenue = orders
            .filter(order => order.status === 'delivered')
            .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
        res.status(200).json({
            success: true,
            message: 'Dashboard stats fetched successfully',
            data: {
                pendingCount,
                acceptedCount,
                deliveredCount,
                totalRevenue,
                totalOrders: orders.length
            }
        });
    } catch (error) {
        next(error);
    }
};