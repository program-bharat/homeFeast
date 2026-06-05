import User from "../../models/User.js";
import Menu from "../../models/Menu.js";
import Order from "../../models/Order.js";

export const placeOrder = async (req, res, next) => {
    try {
        let {
            menuId,
            orderType,
            startDate,
            endDate,
            deliveryAddress,
            note,
        } = req.body;
        const menu = await Menu.findById(menuId);
        if (!menu || !menu.isAvailable) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not available',
            });
        }
        const cook = await User.findById(menu.cookId);
        if (!cook || !cook.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Cook is not approved',
            });
        }
        let totalPrice = menu.price;
        if (orderType === 'subscription') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required',
                });
            }
            if (new Date(startDate) < today) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date cannot be in the past',
                });
            }
            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date',
                });
            }
            const days = Math.ceil(
                (new Date(endDate).getTime() - new Date(startDate).getTime())
                / (1000 * 60 * 60 * 24)
            );
            totalPrice = menu.price * days;
        }
        if (orderType === 'one-time') {
            const today = new Date();
            startDate = today;
            endDate = today;
        }
        const order = await Order.create({
            userId: req.user.id,
            cookId: menu.cookId,
            menuId,
            orderType,
            startDate,
            endDate,
            totalPrice,
            deliveryAddress,
            note,
        });
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        let orders;
        if (req.user.role === 'user') {
            orders = await Order.find({ userId: req.user.id })
                .populate({ path: 'cookId', select: 'name email phone image' })
                .populate({ path: 'menuId', select: 'name mealType cuisine category price image' })
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'cook') {
            orders = await Order.find({ cookId: req.user.id })
                .populate({ path: 'userId', select: 'name email phone address' })
                .populate({ path: 'menuId', select: 'name mealType cuisine category price' })
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'admin') {
            orders = await Order.find()
                .populate({ path: 'userId', select: 'name email phone' })
                .populate({ path: 'cookId', select: 'name email phone' })
                .populate({ path: 'menuId', select: 'name mealType cuisine price' })
                .sort({ createdAt: -1 });
        }
        res.status(200).json({
            success: true,
            message: `Orders fetched successfully for ${req.user.role}`,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
}
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({ path: 'userId', select: 'name email phone address' })
            .populate({ path: 'cookId', select: 'name email phone image serviceArea' })
            .populate({ path: 'menuId', });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const isUser = order.userId._id.equals(req.user.id);
        const isCook = order.cookId._id.equals(req.user.id);
        const isAdmin = req.user.role === 'admin';
        if (!isUser && !isCook && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
}
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        if (!order.userId.equals(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized',
            });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending orders can be cancelled',
            });
        }

        order.status = 'cancelled';
        await order.save();
        res.status(200).json({
            success: true,
            message: 'Order Cancelled',
            data: order,
        })
    } catch (error) {
        next(error);
    }
}