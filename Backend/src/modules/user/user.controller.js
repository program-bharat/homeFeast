import User from '../../models/User.js';
import Order from '../../models/Order.js';
import bcrypt from 'bcrypt';
import cloudinary from '../../config/cloudinary.js';
import uploadToCloudinary from '../../utils/uploadToCloudinary.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, street, city, state, pincode, } = req.body;
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (street) user.address.street = street;
        if (city) user.address.city = city;
        if (state) user.address.state = state;
        if (pincode) user.address.pincode = pincode;
        if (req.file) {
            if (user.imagePublicId) {
                await cloudinary.uploader.destroy(user.imagePublicId);
            }
            const result = await uploadToCloudinary(
                req.file.buffer,
                'homefeast/profile-photos'
            );
            user.image = result.secure_url;
            user.imagePublicId = result.public_id;
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword, } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect Old Password',
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New Password and Confirm Password do not match',
            });
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New Password must be different from Old Password',
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const orders = await Order.find({ userId })
            .populate({ path: 'cookId', select: 'name email phone image serviceArea' })
            .populate({ path: 'menuId', select: 'name mealType cuisine category price image' })
            .sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            message: 'Fetched User Orders Successfully',
            data: orders,
        })
    } catch (error) {
        next(error);
    }
}