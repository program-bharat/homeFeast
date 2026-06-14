import User from '../../models/User.js';
import Order from '../../models/Order.js';
import Menu from '../../models/Menu.js';
import cloudinary from '../../config/cloudinary.js';

// GET Dashboard Stats
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalCooks = await User.countDocuments({ role: 'cook' });
        const approvedCooks = await User.countDocuments({
            role: 'cook',
            isApproved: true,
        });
        const pendingCooks = await User.countDocuments({
            role: 'cook',
            cookingRequestStatus: 'pending',
        });
        const rejectedCooks = await User.countDocuments({
            role: 'cook',
            cookingRequestStatus: 'rejected',
        });
        const totalOrders = await Order.countDocuments();
        const totalMenuItems = await Menu.countDocuments();
        res.status(200).json({
            success: true,
            message: 'Dashboard Stats Fetched Successfully',
            data: {
                totalUsers,
                totalCooks,
                approvedCooks,
                pendingCooks,
                rejectedCooks,
                totalOrders,
                totalMenuItems,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('-password -createdAt -updatedAt -__v');

        res.status(200).json({
            success: true,
            message: 'All Users Fetched Successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE User
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found',
            });
        }
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Admin can't delete themselves",
            });
        }
        // Delete image from Cloudinary
        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId);
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET Pending Cooks
export const getPendingCooks = async (req, res, next) => {
    try {
        const cooks = await User.find({
            role: 'cook',
            cookingRequestStatus: 'pending',
        }).select('-password');

        res.status(200).json({
            success: true,
            message: 'Pending Cooks Fetched Successfully',
            data: cooks,
        });
    } catch (error) {
        next(error);
    }
};

// APPROVE Cook
export const approveCook = async (req, res, next) => {
    try {
        const cookId = req.params.id;
        const cook = await User.findById(cookId);
        if (!cook) {
            return res.status(404).json({
                success: false,
                message: 'Cook Not Found',
            });
        }
        cook.isApproved = true;
        cook.cookingRequestStatus = 'approved';

        await cook.save();
        res.status(200).json({
            success: true,
            message: 'Cook Approved Successfully',
            data: cook,
        });
    } catch (error) {
        next(error);
    }
};

// REJECT Cook
export const rejectCook = async (req, res, next) => {
    try {
        const cookId = req.params.id;
        const cook = await User.findById(cookId);
        if (!cook) {
            return res.status(404).json({
                success: false,
                message: 'Cook Not Found',
            });
        }
        cook.isApproved = false;
        cook.cookingRequestStatus = 'rejected';

        await cook.save();
        res.status(200).json({
            success: true,
            message: 'Cook Rejected Successfully',
            data: cook,
        });
    } catch (error) {
        next(error);
    }
};

// GET All Orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('cookId', 'name email')
            .populate('menuId', 'name price')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: 'All Orders Fetched Successfully',
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};